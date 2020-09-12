
MM2 hide and show using sensors

  
[Clone source codes]

cd ~/MagicMirror/modules

git clone https://github.com/sohyemini/MMM-HideAndShow-Sensor.git


install

cd MMM-HideAndShow-Sensor

npm install

edit your config.js

			module: 'MMM-HideAndShow-Sensor',
			config: {
				pin: 23,                //SR04 Pin #
				position: "center",
				bShow: true,            //show all or not except 
				echoPin: 24,            //SR501 echo pin #
				triggerPin: 18,        //SR501 trigger Pin #
				bMirror: false,         // Mirror mode
				iMotion: 300,            //300sec
			}
      
It's just test code for my book
