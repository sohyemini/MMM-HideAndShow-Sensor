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
       	currentMode : "SHOW_PHOTO",
	},
	
	start: function () {	
		var self = this;
		this.loaded = false;	
		this.config.bTurnOn = true;
		this.config.bMirror = false;		
		if(self.config.echoPin <= 27 && self.config.triggerPin <= 27) {
			//send config to node_helper
			this.sendSocketNotification('CONFIG', this.config);
		}

		this.sendSocketNotification('CONFIG', this.config);
	},

	socketNotificationReceived: function (notification, payload) {
		
		if (notification === 'SHOW_ALERT') {
			this.sendNotification(notification, payload);
		} 

		// 전체 끔
		if (notification === 'HIDE_ALL' && config.currentMode != "HIDE_ALL" ){
			console.log("+++++++++++++++++++++++++++++++turn off");
			config.bTurnOn = false;
			config.bMirror = false;
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
		    this.sendNotification(notification, payload);
		}
		
		// 포토 앨범
		if (notification === "SHOW_PHOTO" && config.currentMode != "SHOW_PHOTO" ){
			
			console.log("+++++++++++++++++++++++++++++++show google photo and hide others(SHOW_PHOTO)");
			config.bTurnOn = true;
			config.bMirror = false;
			config.iMotion = config.iMotionTime;
			console.log("+++++++++++++++++++++++++++++++show google photo and hide others(SHOW_PHOTO)-----startedS1 = " + config.startedS1 );
		//	if(config.startedS1){
				config.startedS1 = false;
				this.start();
		//	}
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
                                
			MM.getModules().withClass([//'newsfeed', 
                                      //'weatherforecast', 
									  //'MMM-AirQuality',
									  //'currentweather',
									  //'MMM-GmailFeed',
									  //'calendar',
									  //'clock',
									  'MMM-BackgroundSlideshow',
									  //'MMM-GooglePhotos',
									  //'currentweather'
									  ])
                                .enumerate(function(module){
                                    module.show();
                                });
                                
		    this.sendNotification(notification, payload);
		}	
		
		// 거울모드, 구글포토 빼고 다 보여줌
		if (notification === "SHOW_MIRROR" && config.currentMode != "SHOW_MIRROR"){
			console.log("+++++++++++++++++++++++++++++++show all and hide google photo");
			config.bMirror = true;
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
            MM.getModules().withClass([//'newsfeed', 
                                      //'weatherforecast', 
									  //'MMM-AirQuality',
									  //'currentweather',
									  //'MMM-GmailFeed',
									  //'calendar',
									  //'clock',
									  'MMM-BackgroundSlideshow',
									  //'MMM-GooglePhotos',
									  //'currentweather'
									  ])
                                .enumerate(function(module){
                                    module.hide();
                                });                    
            config.currentMode = "SHOW_MIRROR"
		    this.sendNotification(notification, payload);
		}


		//autoStart Measuring if configured
		if (notification === 'STARTED') 
		{
		    if (this.config.autoStart && !this.config.usePIR) 
		    {
				this.sendSocketNotification("ACTIVATE_MEASURING", true);
		    }
		}
	},	
});
