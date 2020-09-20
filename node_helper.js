/****************************************************************/
/*                        node_helper.js                        */
/*                                                              */
/*                         Sept 10, 2020                        */
/*                   Written by Sohyemini                       */
/****************************************************************/
'use strict';

var NodeHelper = require("node_helper");
//onoff 모듈의 GPIO를 얻어옵니다.
const Gpio = require('onoff').Gpio;
let { usleep } = require('usleep');
var main_config = null;
	
module.exports = NodeHelper.create({    
    
    _config: {
	    MICROSECONDS_PER_CM: 1e6 / 34321,
	    // SAMPLE_SIZE: 5,
	    TRIGGER_PULSE_TIME: 10, // microseconds (us)
	    // SWIPE_DIFFERENCE_MULTIPLE: 1.3
    },
	
    start: function () 
    {
	    var self = this;
	    this.started = false;
	    this.started_switch = false;
	    this.startedS1 = false;
	    this.mode = "off";

	    // 모션센서 
	    var x = setInterval(()=>{
		if(main_config != null){
		    main_config.iSlideShowTime = main_config.iSlideShowTime - 1;
		    console.log("MMM-HASS / helper > after " + main_config.iSlideShowTime + "sec module will be hided, current Mode = " + main_config.currentMode);
		    if (main_config.iSlideShowTime === 0)
		    {
			if(main_config.currentMode != "HIDE_ALL")
			{
			    console.log("MMM-HASS / helper > module hide notification send");
			    main_config.currentMode = "HIDE_ALL";
			    this.stopListener();
			    this.sendSocketNotification("HIDE_ALL",{});
			}
		    }
		}
	    }, 1000);
	    
	    this.started = false;
	    this.started_switch = false;
    }, // end of start function
    
    // Function for ULTRA_SONIC
    hideModuels: function() {},

    // Function for ULTRA_SONIC
    setupListener: function() {
	    console.log("MMM-HASS > node helper > setupListener");
	    
	    if(!this.switch_on && main_config != null)
	    {
		this.trigger = new Gpio(main_config.triggerPin, "out");
		this.echo = new Gpio(main_config.echoPin, "in", "both");
	    }
		
	    this.startTick = { ticks: [0, 0] };
	    this.lastDistance = { distance: 0.0 };
	    this.measureCb = this.measure.bind(this);
    },
    
    // Function for ULTRA_SONIC
    startListener: function() {
	    console.log("MMM-HASS > node helper > startListener");
	    this.echo.watch(this.measureCb);
	    this.mode = "measuring";
	    this.sampleInterval = setInterval(this.doTrigger.bind(this), this.config.measuringInterval);
    },
    
    // Function for ULTRA_SONIC
    stopListener: function() {
	    console.log("MMM-HASS > node helper > stopListener");
	    //if(!this.switch_on)
		this.echo.unwatch(this.measureCb);
	    this.mode = "off";
	    clearInterval(this.sampleInterval);
    },
    
    // Function for ULTRA_SONIC
    doTrigger: function() {
	    this.trigger.writeSync(1);
	    usleep(this._config.TRIGGER_PULSE_TIME);
	    this.trigger.writeSync(0);
    },
    
    // Function for ULTRA_SONIC
    measure: function(err, value) {
	    var self = this;
	    var diff, usDiff, dist;
	    var average = 0;
	    if (err) {
		throw err;
	    }
	    
	    console.log("MMM-HASS > node helper > measure function");
	    
	    if(self.config.switch_on)
	    {
		console.log("MMM-HASS > node helper > measure function : return because of switch is used");
		return;
	    }
	    
	    if (value == 1) {
		this.startTick["ticks"] = process.hrtime();
	    } else {
		
		diff = process.hrtime(this.startTick["ticks"]);
		// Full conversion of hrtime to us => [0]*1000000 + [1]/1000
		usDiff = diff[0] * 1000000 + diff[1] / 1000;
		if (usDiff > this.config.sensorTimeout)  // Ignore bad measurements
		    return;

		dist = usDiff / 2 / this._config.MICROSECONDS_PER_CM;
		
		this.lastDistance["distance"] = dist.toFixed(2);
		
		console.log("MMM-HASS > node helper > measure function distance is = " + dist.toFixed(2));		
		if (this.config.calibrate && this.config.bTurnOn) {
			if(dist.toFixed(2) < 100 )
			    self.sendSocketNotification("SHOW_MIRROR",dist.toFixed(2));
			else
			    self.sendSocketNotification("SHOW_PHOTO",dist.toFixed(2));
		} 
	    }
    },

    socketNotificationReceived: function (notification, payload) 
    {
	    var self = this;
	    
	    if (notification === 'CONFIG') {
		if (!this.startedS1) {
		    this.config = payload;
		    main_config = payload;
		    if(!this.switch_on)
			this.setupListener();
		    this.startedS1 = true;	    
		}
		this.sendSocketNotification("STARTED", null);
	    } else if (notification === 'CONFIG_ULTRASONIC') {
		if(!this.switch_on)
		    this.setupListener();
	    } else if (notification === 'ACTIVATE_MEASURING' && payload === true) {
		this.startListener();
	    } else if (notification === 'ACTIVATE_MEASURING' && payload === false) {
		this.stopListener();
	    } 

	    if (notification === 'CONFIG' && this.started == false) 
	    {
		    const self = this;
		    this.config = payload;
		    main_config = payload;
		    // GPIO의 Pin 지정
		    this.pir = new Gpio(this.config.pin, 'in', 'both');
		    // GPIO로 부터 값 읽기
		    this.pir.watch((err, value) =>
		   {
		       main_config.iSlideShowTime = main_config.localSlideShowTime;
			if(value && main_config.currentMode == "HIDE_ALL")
			{ 
				self.sendSocketNotification('SHOW_PHOTO',{});
				if(!this.switch_on)
				    this.setupListener();
				this.startedS1 = true;
				this.config = payload;
				main_config = payload;
				main_config.currentMode = "STARTED";
				this.sendSocketNotification("STARTED", null);
			} // end of if
		    }); // end of watch
		    this.started = true;
	    } // end of if
	    
	    //스위치를 사용하는 경우 
	    if(notification === 'CONFIG_SWITCH' && this.started_switch == false) 
	    {
		const self = this;
		this.config = payload;	  
		main_config = payload;
		let GPIO = require('onoff').Gpio;
		console.log("MMM_HASS > helper > CONFIG_SWITCH notification received")
		let button = new GPIO(this.config.echoPin, 'in', 'both',{ persistentWatch: true, debounceTimeout: this.config.clickDelay });
		button.watch(function(err, state) {
			// check the state of the button; 1 == pressed, 0 == not pressed
			if(state == 1) {
				// send notification for broadcast
				//self.sendSocketNotification(self.config.notificationMessage, true);
				if(self.config.switch_mode === "SLIDESHOW")
				{
				    console.log("MMM_HASS / node helper > Show Mirror");
				    self.config.switch_mode = "MIRROR";
				    self.sendSocketNotification("SHOW_MIRROR",{});
				}
				else
				{
				    self.config.switch_mode = "SLIDESHOW";
				    self.sendSocketNotification('SHOW_PHOTO',{});
				    console.log("MMM_HASS / node helper > Show Photo");
				}
			}
		});          
		this.started_switch = true;
	    }
    }, // end of function
	
}); // end of NodeHelper.create
