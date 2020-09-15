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
       	iMotionTime: 30,
       	currentMode : "STARTED",
	},
	
	start: function () {	
		var self = this;
		this.loaded = false;	
		this.config.bTurnOn = true;	
		this.config.started = false;	
		console.log("+++++++++++++++++++++++++++++++HASS +++++ start");
		this.sendSocketNotification('CONFIG', this.config);
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
                                    module.hide();
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
                                    module.hide();
                                });
                                
			MM.getModules().withClass([
									  'MMM-BackgroundSlideshow',
									  //'MMM-GooglePhotos',
									  ])
                                .enumerate(function(module){
                                    module.show();
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
                                    module.show();
                                });
                                                   
            MM.getModules().withClass([
									  'MMM-BackgroundSlideshow',
									  //'MMM-GooglePhotos'
									  ])
                                .enumerate(function(module){
                                    module.hide();
                                });                    
            config.currentMode = "SHOW_MIRROR"
		}


		//autoStart Measuring if configured
		if (notification === 'STARTED') 
				this.sendSocketNotification("ACTIVATE_MEASURING", true);
	},	
});
