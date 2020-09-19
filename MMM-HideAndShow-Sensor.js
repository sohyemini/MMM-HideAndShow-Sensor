/****************************************************************/
/*                   MMM-HideAndShow-Sensor                     */
/*                                                              */
/*                            Sept 10, 2020                     */
/*                     Written by Sohyemini                     */
/****************************************************************/
'use strict';

Module.register("MMM-HideAndShow-Sensor", {
	defaults : {
		echoPin: 24,
		triggerPin: 18,
		distance: 70, // <70 cm will show compliments for given delay
		sensorTimeout: 10000,
		animationSpeed: 100,
		measuringInterval: 500, // in milliseconds
		delay: 30, // 30 seconds compliments will be shown
		usePIR: false,
		powerSavingDelay: 30,
		verbose: false,
		calibrate: true,
       	autoStart: true,
       	iMotionTime: 60*5,
       	currentMode : "STARTED",
       	clickDelay: 500,
    	bMirror: false,  
   		bTurnOn: true, 	 	
   		bswitch: true,
   		switch_mode: "SLIDESHOW",
	},
	
	start: function () {	
		var self = this;
		this.loaded = false;	
		this.config.bTurnOn = true;	
		this.config.started = false;	
		this.config.iMotionTime = this.config.iSlideShowTime;
		this.config.bswitch = this.config.switch_on;

		// switch_on이 true이면 스위치를 사용하고 초음파 센서를 사용하지 않으므로
		// 둘 중에 하나만 실행이 되도록 notification을 node helper로 보냄
		if(this.config.switch_on)
		{
			this.sendSocketNotification('CONFIG_SWITCH', this.config);
			console.log("스위치 사용할꺼야");
		}
		else
		{
			this.sendSocketNotification('CONFIG_ULTRASONIC', this.config);
			console.log("초음파 센서 사용할꺼야");
		}
	},

	socketNotificationReceived: function (notification, payload) {

		// 전체 끔
		if (notification === 'HIDE_ALL' && config.currentMode != "HIDE_ALL" ){
			console.log("+++++++++++++++++++++++++++++++turn off");
			config.bTurnOn = false;
			config.iMotion = config.iMotionTime;
			MM.getModules().withClass(['newsfeed', 
                                      'weatherforecast', 
									  'MMM-AirQuality',
									  'currentweather',
									  'MMM-GmailFeed',
									  'calendar',
									  'clock',
									  'MMM-BackgroundSlideshow',
									  'currentweather'])
                                .enumerate(function(module){
                                    module.hide(1000);
                                });
            config.currentMode = "HIDE_ALL";                    
		}
		
		// 포토 앨범
		if (notification === "SHOW_PHOTO" && config.currentMode != "SHOW_PHOTO" ){
			
			console.log("+++++++++++++++++++++++++++++++show photo");
			config.bTurnOn = true;
			config.iMotion = config.iMotionTime;
			config.startedS1 = false;
			config.currentMode = "SHOW_PHOTO"; 

			
			MM.getModules().withClass(['newsfeed', 
                                      'weatherforecast', 
									  'MMM-AirQuality',
									  'currentweather',
									  'MMM-GmailFeed',
									  'calendar',
									  'clock',
									  //'MMM-BackgroundSlideshow',
									  //'MMM-GooglePhotos',
									  'currentweather'])
                                .enumerate(function(module){
                                    module.hide(1000);
                                });
                                
			MM.getModules().withClass([
									  'MMM-BackgroundSlideshow',
									  //'MMM-GooglePhotos',
									  ])
                                .enumerate(function(module){
                                    module.show(1000);
                                });                  
		}	
		
		// 거울모드, 구글포토 빼고 다 보여줌
		if (notification === "SHOW_MIRROR" && config.currentMode != "SHOW_MIRROR"){
			console.log("+++++++++++++++++++++++++++++++show all and hide google photo");
			config.bTurnOn = true;
			config.iMotion = config.iMotionTime;
			MM.getModules().withClass(['newsfeed', 
                                      'weatherforecast', 
									  'MMM-AirQuality',
									  'currentweather',
									  'MMM-GmailFeed',
									  'calendar',
									  'clock',
									  //'MMM-BackgroundSlideshow',
									  //'MMM-GooglePhotos',
									  'currentweather'])
                                .enumerate(function(module){
                                    module.show(1000);
                                });
                                                   
            MM.getModules().withClass([
									  'MMM-BackgroundSlideshow',
									  //'MMM-GooglePhotos'
									  ])
                                .enumerate(function(module){
                                    module.hide(1000);
                                });                    
            config.currentMode = "SHOW_MIRROR"
		}


		//autoStart Measuring if configured
		if (notification === 'STARTED') 
				this.sendSocketNotification("ACTIVATE_MEASURING", true);
	},	
});
