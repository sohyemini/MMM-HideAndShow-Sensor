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
	    console.log('MMM-HASS : start node_helper ');
	    this.started = false;
    }, // end of start function

    socketNotificationReceived: function (notification, payload) 
    {
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
				    self.sendSocketNotification('SHOW_ALERT', 
				    {
					    title: 'PIR',
					    message: 'Motion detected!',
					    timer: 2500
				    }); // end of sendSocketNotification
			    } // end of if
		    }); // end of watch
		    this.started = true;
	    } // end of if
    }, // end of function
	
}); // end of NodeHelper.create
