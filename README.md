
#MMM-HideAndShow-Sensor

The purpose of this module are making show and hide other modules with sensor or toggle button. You can use motion sensor HC-SR501, Ultra sonic sensor HC-SR04 and toggle switch can be used with MagicMirror.
The concept of this module assume that motion sensor is used always to detect person's movement, it there is no body all of module will be hided. and you can also use ultra sonic or toggle switch to change MagicMirror mode. because it has magicmirror mode and slideshow mode. if you have ultra sonic senor on it whenever something is within 1m, magicsensor will be changed mirror mode, if not It'll be changed to slideshow mode.
And when you use toggle button each time when you press the button magicmirror mode will be changed between mirror mode and slideshow mode.
In the MMM-HideAndShow-Sensor.js, I liested all of module nanes which I used in my project, if you want to use it please modify it by yourself.

이 모듈의 목적은 모션센서, 초음파센서와 토글 버튼을 매직미러에서 사용하기 위함입니다.
모션센서는 항상 사용된다는 가정하에 초음파센서와 토글 버튼은 둘 중에 하나만을 사용할 수 있습니다. 모션센서는 동작 감지가 일정시간 안되면 자동으로 모든 모듈을 숨기는 용도로 사용이 되고 초음파 센서는 매직미러 앞 1미터 이내에 물체가 감지되면 거울모드 그렇지 않으면 슬라이드쇼 모드로 변경이 됩니다. 초음파 센서를 사용하기 어려운 장소에서 사용할 것을 고려하여 모션센서 대신에 토글버튼을 사용할 수 있으며 이 경우에는 토글버튼을 누를때마다 매직미러 모드와 슬라이드 쇼 모드가 매번 변경이 됩니다.
MMM-HideAndShow-Sensor.js에는 모든 서드파티 모듈들을 리스트 업해서 hide show를 하도록 구현이 되어 있습니다. 구미에 맞게 수정해서 사용하시기 바랍니다.

  
##[Clone source codes]
  cd ~/MagicMirror/modules
  git clone https://github.com/sohyemini/MMM-HideAndShow-Sensor.git
  cd MMM-HideAndShow-Sensor
  npm install

## example of config
edit your config.js

			module: 'MMM-HideAndShow-Sensor',
			config: {
				pin: 23,                //SR04 Pin #
				bShow: true,            //show all or not except 
				echoPin: 24,            //SR501 echo pin #
				triggerPin: 18,        //SR501 trigger Pin #
				bMirror: false,         // Mirror mode
				iMotion: 300,            //300sec
			}
      

