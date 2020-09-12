/****************************************************************/
/*                        node_helper.js                        */
/*                                                              */
/*                         Sept 10, 2020                        */
/*                   Written by Sohyemini                       */
/****************************************************************/
'use strict';

//onoff 모듈의 GPIO를 얻어옵니다.
const Gpio = require('onoff').Gpio;
const NodeHelper = require('node_helper');
let { usleep } = require('usleep');

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
		
	    var x = setInterval(function(){
		config.iMotion = config.iMotion - 1;
		if (config.iMotion === 0)
		    self.sendSocketNotification("HIDE_MODULES",{});
	    }, 1000);
	    
	    this.started = false;
    }, // end of start function

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
				
		if (this.config.calibrate) {
			if(dist.toFixed(2) < 100 ) // 거울
			    self.sendSocketNotification("SHOW_MIRROR",dist.toFixed(2));//{});
			else // 일반
			    self.sendSocketNotification("HIDE_MIRROR",dist.toFixed(2));//{});
		}
		
		console.log("MMM-HASS / distance to object = " + dist.toFixed(2) + "cm");
	    }
    },

    socketNotificationReceived: function (notification, payload) 
    {
	    var self = this;
	    
	    if (notification === 'CONFIG') {
		if (!this.startedS1) {
		    this.config = payload;
		    this.setupListener();
		    this.startedS1 = true;
		}
		this.sendSocketNotification("STARTED", null);
	    } else if (notification === 'ACTIVATE_MEASURING' && payload === true) {
		this.startListener();
	    } else if (notification === 'ACTIVATE_MEASURING' && payload === false) {
		this.stopListener();
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
			    if(value)
			    {
				    //Notification 생성, SHOW_ALERT을 통해서 화면에 Toast 출력
				  /*  self.sendSocketNotification('SHOW_ALERT', 
				    {
					    title: 'PIR',
					    message: 'Motion detected!',
					    timer: 1000
				    }); // end of sendSocketNotification
				   */ 
				    console.log('MMM-HASS / PIR 이벤트 받음 iMotion = ' + config.iMotion);
				    self.sendSocketNotification("SHOW_MODULES",{});
			    } // end of if
		    }); // end of watch
		    this.started = true;
	    } // end of if
    }, // end of function
	
}); // end of NodeHelper.create
