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
		sensorTimeout: 5000,
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
		console.log('MMM-HASS / B<-------------------------------------------');			
		if(self.config.echoPin <= 27 && self.config.triggerPin <= 27) {
			//send config to node_helper
			console.log('MMM-HASS / xSending config to node_helper');
			this.sendSocketNotification('CONFIG', this.config);
		} else {
			console.log('MMM-HASS / xImproper Pin configuration.  Please use BCM Numbering');
		}
							
		console.log('MMM-HASS / Start : ' + this.name);
		this.sendSocketNotification('CONFIG', this.config);
	},

	notificationReceived: function(notification, payload, sender) {
		console.log('MMM-HASS / A<-------------------------------------------');
		//loading text
		if (notification === 'DOM_OBJECTS_CREATED') {
            		this.loaded = true;
			var complimentModules = MM.getModules().withClass('compliments');

                        if(complimentModules && complimentModules.length == 1){

                                Log.info('Hiding compliment module since all modules were loaded.');
                                var compliment = complimentModules[0];
                                // compliment.hide(0, {lockString: this.name});
                                compliment.hide(0);

                        } else if (complimentModules.length < 1) {
                                Log.warn('No Compliments Module loaded. Nothing to hide!');
                        }
	
			//get powerSavingDelay from MMM-PIR-Sensor
			if(this.config.usePIR){
				var pirModules = MM.getModules().withClass('MMM-PIR-Sensor');
				if(pirModules.length > 0) {
					var pirModule = pirModules[0];
					this.config.powerSavingDelay = pirModule.config.powerSavingDelay;
					console.log('powerSavingDelay of MMM-PIR module is '+ this.config.powerSavingDelay);
                        	} else {
                                	Log.warn('MMM-PIR-Sensor is configured to be used but could not be found! Please enable it!');
                        	}
                	}
        	}
	
		// hide compliment module by default after all modules were loaded
		if (notification == 'ALL_MODULES_STARTED'){
			/* below code does not work!! has to be executed when DOM_OBJECTS_CREATED is fired
			var complimentModules = MM.getModules().withClass('compliments');
			
			if(complimentModules && complimentModules.length == 1){
			
				Log.info('Hiding compliment module since all modules were loaded.');
				var compliment = complimentModules[0];
				compliment.hide(0, {lockString: this.name});
			} else if (complimentModules.length < 1) {
                        	Log.warn('No Compliments Module loaded. Nothing to hide!');
			} */
		}
		
		//turn on measuring if USER_PRESENCE is true and if we configured to use PIR
		if (notification == 'USER_PRESENCE' && this.config.usePIR){
			if(payload == true){
				//begin measuring only for powerSavingDelay
				clearTimeout(this.deactivateMeasuring);
				this.sendSocketNotification('ACTIVATE_MEASURING', true);
				
			}
			
			if(payload == false){
				//stop measuring after powerSavingDelay is timed out
				var self = this;
				this.deactivateMeasuring = setTimeout(function(){
					self.sendSocketNotification('ACTIVATE_MEASURING', false);
				}, this.config.powerSavingDelay * 1000);
			}
		}	
	},

	socketNotificationReceived: function (notification, payload) {
		console.log('MMM-HASS / C<-------------------------------------------');
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
		
		
		console.log("MMM-HASS / --------------------------------------------xxxxxxxxxx-->");
		var complimentModules = MM.getModules().withClass('compliments');
		console.log("MMM-HASS / --------------------------------------------yyyyyyyyyyy-->");
		if (complimentModules.length > 0) {
			var compliment = complimentModules[0];
		}
		//autoStart Measuring if configured
		if (notification === 'STARTED') {
		    if (this.config.autoStart && !this.config.usePIR) {
			this.sendSocketNotification("ACTIVATE_MEASURING", true);
		    }
		}
		
		
		if (notification === 'CALIBRATION') {
		    this.displayData = "<table border=\"1\" cellpadding=\"5\"><tr align=\"center\"><th>Distance</td></tr><tr align=\"center\"><td>" + payload + "</td></tr></table>";
		    //this.updateDom(this.config.animationSpeed);
		    this.updateDom(0);
		} 
		
		if (notification === 'MEASUREMENT') {
		    	//this.sendNotification("SHOW_ALERT", { title: "Distance Measurement", message: payload, imageFA: "hand-paper-o", timer: 500});
		    console.log("MMM-HASS / --------------------------------------------masure.-->" + this.config.distance);	
			if(payload < this.config.distance) {
                                //broadcast USER_PRESENCE_NEAR: true
                                // this.sendNotification("USER_PRESENCE_NEAR", true);
				console.log('USER_PRESENCE_NEAR: true');
			}
		}


		// if (notification === 'MEASUREMENT' && compliment && compliment.hidden == true) {
		if (notification === 'MEASUREMENT' && compliment) {
			var self = this;
			var distance = payload;
			if(distance < this.config.distance) {
				clearTimeout(this.deactivateComplimentsTimeout);
				//only ask for showing when compliment is actually hidden, otherwise timeout is cleared and set again
				if(compliment.hidden == true){
    					console.log('Asking compliment module to show');
					compliment.show(self.config.animationSpeed, {lockString: this.name});
	
				}
	
				this.deactivateComplimentsTimeout = setTimeout(function(){
    					console.log('Asking compliment module to hide');
					compliment.hide(self.config.animationSpeed, {lockString: this.name});
				}, this.config.delay *1000)
			}
		}
	},	
			
						
	getDom: function() {
		console.log('MMM-HASS / EE<-------------------------------------------');
		var wrapper = document.createElement("div");
		
		if (!this.loaded) {
		    wrapper.innerHTML = "Loading "+this.name+"...";
		    wrapper.className = "dimmed light small";
		    return wrapper;
		}
		if (this.error) {
		    wrapper.innerHTML = "Error loading data...";
		    return wrapper;
		}

		if (typeof this.displayData !== "undefined") {
		    wrapper.innerHTML = this.displayData;
		    wrapper.className = "dimmed light small";
		}
		return wrapper;
	}
	
});
