/****************************************************************/
/*                        node_helper.js                        */
/*                                                              */
/*                         Sept 10, 2020                        */
/*                   Written by Sohyemini                       */
/****************************************************************/

const Gpio = require('onoff').Gpio;
const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({	
    start: function () 
    {
		  this.started = false;
    }, // end of start function

    socketNotificationReceived: function (notification, payload) 
    {
      if (notification === 'CONFIG' && this.started == false) 
      {
        const self = this;
       
        this.config = payload;
        this.pir = new Gpio(this.config.pin, 'in', 'both');
        this.pir.watch(function (err, value) 
        {				
          console.log('watch : value ' + value);
        
          if(value) 
          {
            self.sendSocketNotification('MOTION_DETECTED', 
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
