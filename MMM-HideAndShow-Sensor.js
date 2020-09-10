/****************************************************************/
/*                   MMM-HideAndShow-Sensor                     */
/*                                                              */
/*                            Sept 10, 2020                     */
/*                     Written by Sohyemini                     */
/****************************************************************/

Module.register('MMM-HideAndShow-Sensor', {
	start: function () {		
		this.sendSocketNotification('CONFIG', this.config);
		Log.info('MMM-HASS / Start : ' + this.name);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === 'SHOW_ALERT') {
			this.sendNotification(notification, payload);
		}
	},
});
