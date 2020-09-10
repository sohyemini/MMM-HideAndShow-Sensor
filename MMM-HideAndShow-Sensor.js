/****************************************************************/
/*                   MMM-HideAndShow-Sensor                     */
/*                                                              */
/*                            Sept 10, 2020                     */
/*                     Written by Sohyemini                     */
/****************************************************************/

Module.register('MMM-HideAndShow-Sensor', {
	start: function () {		
		console.log('MMM-HASS / Start : ' + this.name);
		this.sendSocketNotification('CONFIG', this.config);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === 'SHOW_ALERT') {
			console.log('MMM-HASS / MMM-HideAndShow-Sensor');
			this.sendNotification(notification, payload);
		} 
		
		if (notification === "HIDE_MODULES") {
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
		    console.log('MMM-HASS : turn off....in main js');
		    this.sendNotification(notification, payload);
		}
		
		if (notification === "SHOW_MODULES") {
			config.bShow = true;
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
                                    module.show();
                                });
		    console.log('MMM-HASS : turn on....in main js');
		    this.sendNotification(notification, payload);
		}		
	},
});
