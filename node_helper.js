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
	    this.startedS1 = false;
	    this.mode = "off";
	    
	    console.log('MMM-HASS -----> start function started in node_helper');

	    var x = setInterval(()=>{
		console.log('MMM-HASS -----> set interval');
		if(main_config != null){
		    main_config.iMotion = main_config.iMotion - 1;
		    console.log('MMM-HASS -----> config.iMotion =' + main_config.iMotion);
		    if (main_config.iMotion <= 0)
		    {
			if(main_config.currentMode != "HIDE_ALL")
			{
			    main_config.currentMode = "HIDE_ALL";
			    this.stopListener();
			    this.sendSocketNotification("HIDE_ALL",{});
			    //main_config.bTurnOn = false;
			    console.log('MMM-HASS -----> send HIDE_ALL notification');
			}
		    }
		}
	    }, 1000);
	    
	    this.started = false;
    }, // end of start function
    
    hideModuels: function() {

    },

    setupListener: function() {
	    this.trigger = new Gpio(this.config.triggerPin, "out");
	    this.echo = new Gpio(this.config.echoPin, "in", "both");
	    this.startTick = { ticks: [0, 0] };
	    this.lastDistance = { distance: 0.0 };
	    this.measureCb = this.measure.bind(this);
    },
    
    startListener: function() {
	    this.echo.watch(this.measureCb);
	    this.mode = "measuring";
	    this.sampleInterval = setInterval(this.doTrigger.bind(this), this.config.measuringInterval);
    },
    
    stopListener: function() {
	    this.echo.unwatch(this.measureCb);
	    this.mode = "off";
	    clearInterval(this.sampleInterval);
    },
    
    doTrigger: function() {
	    // Set trigger high for 10 microseconds
	    this.trigger.writeSync(1);
	    usleep(this._config.TRIGGER_PULSE_TIME);
	    this.trigger.writeSync(0);
    },
    
    measure: function(err, value) {
	    var self = this;
	    var diff, usDiff, dist;
	    var average = 0;
	    if (err) {
		throw err;
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
				
		if (this.config.calibrate && this.config.bTurnOn) {
			if(dist.toFixed(2) < 100 )//&& !this.config.bMirror && self.config.currentMode != "SHOW_MIRROR") // 거울
			{
			    self.sendSocketNotification("SHOW_MIRROR",dist.toFixed(2));//{});
			    console.log("MMM-HASS / ===================== SHOW_MIRROR");
			}
			else //if(self.config.currentMode != "SHOW_PHOTO" && this.config.bMirror)
			{
			    self.sendSocketNotification("SHOW_PHOTO",dist.toFixed(2));//{});
			    console.log("MMM-HASS / ===================== SHOW_PHOTO  222222" + dist.toFixed(2) + "xxxx" + this.config.bMirror);
			}
		} else 
		    console.log("MMM-HASS / ==============>" + this.config.bTurnOn + "yyyyyyy" + dist.toFixed(2) + "xxxx" + this.config.bMirror);
	    }
    },

    socketNotificationReceived: function (notification, payload) 
    {
	    var self = this;
	    
	    if (notification === 'CONFIG') {
		if (!this.startedS1) {
		    this.config = payload;
		    main_config = payload;
		    console.log('MMM-HASS / get config.iMotion = ' + this.config.iMotion);
		    this.setupListener();
		    this.startedS1 = true;
		    
		}
		this.sendSocketNotification("STARTED", null);
	    } else if (notification === 'ACTIVATE_MEASURING' && payload === true) {
		this.startListener();
	    } else if (notification === 'ACTIVATE_MEASURING' && payload === false) {
		this.stopListener();
	    } else if(notification == 'PRE_CONFIG') {
		this.startedS1 = false;
	    }
	    
	    if (notification === 'CONFIG' && this.started == false) 
	    {
		    const self = this;
		    this.config = payload;
		    // GPIO의 Pin 지정
		    this.pir = new Gpio(this.config.pin, 'in', 'both');
		    // GPIO로 부터 값 읽기
		    this.pir.watch(function (err, value) 
        	   {
			    console.log('MMM-HASS / watch : value ' + value);
			    // 읽은 값이 있으면
			    if(value && main_config.currentMode != "SHOW_PHOTO")
			    { 
				    console.log('MMM-HASS / PIR 이벤트 받음 iMotion = ' + main_config.iMotion);
				    self.sendSocketNotification('SHOW_PHOTO',{});
				    main_config.iMotion = main_config.iMotionTime;
			    } // end of if
		    }); // end of watch
		    this.started = true;
	    } // end of if
    }, // end of function
	
}); // end of NodeHelper.create
