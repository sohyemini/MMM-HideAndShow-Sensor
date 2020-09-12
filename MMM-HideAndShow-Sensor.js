/****************************************************************/
/*                   MMM-HideAndShow-Sensor                     */
/*                                                              */
/*                            Sept 10, 2020                     */
/*                     Written by Sohyemini                     */
/****************************************************************/

Module.register('MMM-HideAndShow-Sensor', {
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
	},
	
	start: function () {	
		var self = this;
		this.loaded = false;			
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
		
		 Log.log("[SoHyeMin] notification = " + notification + "   payload = " + payload);
		// 전체 끔, 거울모드는 아님
		if (notification === "HIDE_MODULES"){// && !config.bMirror) {
			console.log("+++++++++++++++++++++++++++++++turn off the screen");
			config.bShow = false;
			MM.getModules().withClass(['newsfeed', 
                                      'weatherforecast', 
									  'MMM-AirQuality',
									  'currentweather',
									  'MMM-GmailFeed',
									  'calendar',
									  'clock',
									  //'MMM-BackgroundSlideshow',
									  'MMM-GooglePhotos',
									  'currentweather'])
                                .enumerate(function(module){
                                    module.hide();
                                });
		    this.sendNotification(notification, payload);
		}
		
		// 포토 앨범, 거울모드 아님
		if (notification === "SHOW_MODULES"){// && !config.bMirror) {
			console.log("+++++++++++++++++++++++++++++++show google photo and hide others");
			config.bShow = true;
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
									  //'MMM-BackgroundSlideshow',
									  'MMM-GooglePhotos',
									  //'currentweather'
									  ])
                                .enumerate(function(module){
                                    module.show();
                                });
                                
		    this.sendNotification(notification, payload);
		}	
		
		// 거울모드, 구글포토 빼고 다 보여줌
		if (notification === "SHOW_MIRROR"){// && config.bShow) {
			console.log("+++++++++++++++++++++++++++++++show all and hide google photo");
			config.bSMirror = true;
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
									  //'MMM-BackgroundSlideshow',
									  'MMM-GooglePhotos',
									  //'currentweather'
									  ])
                                .enumerate(function(module){
                                    module.hide();
                                });                    
		    this.sendNotification(notification, payload);
		}
		
		//구글포토만 보여줌
		if (notification === "HIDE_MIRROR"){// && config.bShow) {
			console.log("+++++++++++++++++++++++++++++++Hide all except google photo");
			config.bMirror = false;
			MM.getModules().withClass([//'newsfeed', 
                                      //'weatherforecast', 
									  //'MMM-AirQuality',
									  //'currentweather',
									  //'MMM-GmailFeed',
									  //'calendar',
									  //'clock',
									  //'MMM-BackgroundSlideshow',
									  'MMM-GooglePhotos',
									  //'currentweather'
									  ])
                                .enumerate(function(module){
                                    module.show();
                                });
            MM.getModules().withClass(['newsfeed', 
                                      'weatherforecast', 
									  'MMM-AirQuality',
									  'currentweather',
									  'MMM-GmailFeed',
									  'calendar',
									  'clock',
									  //'MMM-BackgroundSlideshow',
									  //'MMM-GooglePhotos',
									  'currentweather'
									  ])
                                .enumerate(function(module){
                                    module.hide();
                                });                    
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
