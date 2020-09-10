/****************************************************************/
/*                        node_helper.js                        */
/*                                                              */
/*                         Sept 10, 2020                        */
/*                   Written by Sohyemini                       */
/****************************************************************/

//onoff 모듈의 GPIO를 얻어옵니다.
const Gpio = require('onoff').Gpio;
const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({	
    start: function () 
    {
	    var self = this;
	    var x = setInterval(function(){
		console.log('MMM-HASS : config.iMotion = config.iMotion - 1 / iMotion = ' + config.iMotion);
		config.iMotion = config.iMotion - 1;
		if (config.iMotion === 0)
		{
		    self.sendSocketNotification("HIDE_MODULES",{});
		    /*getModules().withClass(['newsfeed', 
                                                          'weatherforecast', 
                                                          'MMM-AirQuality',
                                                          'currentweather',
                                                          'MMM-GmailFeed',
                                                          'calendar',
                                                          'clock',
                                                          'currentweather'])
                                .enumerate(function(module){
                                    module.hide();
                                });
		    console.log('MMM-HASS : turn off....');
		    * */
		}
	    }, 1000);
	    console.log('MMM-HASS : start node_helper ');
	    this.started = false;
    }, // end of start function

    socketNotificationReceived: function (notification, payload) 
    {
	    var self = this;
	    if (notification === 'CONFIG' && this.started == false) 
	    {
		    const self = this;
		    this.config = payload;
		    console.log('MMM-HASS / socketNotificationReceived, CONFIG, this.started.......');
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
				   */ console.log('MMM-HASS / PIR 이벤트 받음 iMotion = ' + config.iMotion);
				    config.iMotion = 12;//600;
				    bShow = true;
				    self.sendSocketNotification("SHOW_MODULES",{});
			    } // end of if
			    /*else
			    {
				config.iMotion = config.iMotion -1 ;
				if(config.iMotion === 0)
				    console.log('MMM-HASS / turn off screen');
				console.log('MMM-HASS / iMotion = ' + config.iMotion);
			    }*/
		    }); // end of watch
		    this.started = true;
	    } // end of if
    }, // end of function
	
}); // end of NodeHelper.create
