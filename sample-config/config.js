/* Magic Mirror Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
	//address: "172.30.1.24",
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	ipWhitelist: "",
	//ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], 	// Set [] to allow all IP addresses
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true

	//language: "en",	// ricky : original 2020.08.03//
	language: "ko", 
	logLevel: ["INFO", "LOG", "WARN", "ERROR"],
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
	// local for armv6l processors, default
	//   starts serveronly and then starts chrome browser
	// false, default for all NON-armv6l devices
	// true, force serveronly mode, because you want to.. no UI on this device
	modules: [
/*		{
			module: "MMM-GooglePhotos",
			position: "fullscreen_below",
			config: {
					albums: ["sohyemini"], // Set your album name. like ["My wedding", "family share", "Travle to Paris"]
					updateInterval: 1000 * 60, // minimum 10 seconds.
					sort: "random", //"new", // "old", "random"
					uploadAlbum: null, // Only album created by `create_uploadable_album.js`.
					condition: {
						fromDate: null, // Or "2018-03", RFC ... format available
						toDate: null, // Or "2019-12-25",
						minWidth: null, // Or 400
						maxWidth: null, // Or 8000
						minHeight: null, // Or 400
						maxHeight: null, // Or 8000
						minWHRatio: null,
						maxWHRatio: null,
						// WHRatio = Width/Height ratio ( ==1 : Squared Photo,   < 1 : Portraited Photo, > 1 : Landscaped Photo)
					},
					showWidth: 1080, // These values will be used for quality of downloaded photos to show. real size to show in your MagicMirror region is recommended.
					showHeight: 1920,
					timeFormat: "YYYY/MM/DD HH:mm", // Or `relative` can be used.
			  }
		},
*/		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "소혜민의 일정", // "US Holidays",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar-check",
						url: "https://calendar.google.com/calendar/ical/sohyemini%40gmail.com/private-101a04d329ffe4b17ad2cefd90a83976/basic.ics"				
					}
				]
			}
		},
		{
			module: 'MMM-GmailFeed',
			position: 'top_left',
			config: {
				username: 'sohyemini@gmail.com',
				password: 'nujgztisfwhdwqdy',
				updateInterval: 60000,
				maxEmails: 5,
				maxSubjectLength: 38,
				maxFromLength: 15,
				playSound: false
			}
		},
		/*
		{
			module: "compliments",
			position: "lower_third"
		},
		*/
		{ 
			module: "currentweather",
			position: "top_right",
			
			config: {	
				location: "Seoul",
				locationID: "1835848", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				appid: "d6f43e085fcbdfb6ca7d3b6daeed3b43"
			}
		},
		{
			module: 'MMM-AirQuality',
			position: 'top_right', // you may choose any location
				config: {
				location: 'Seoul', // the location to check the index for
				lang: "kr"
				}
		},	
		{
			module: "weatherforecast",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				location: "Seoul",
				locationID: "1835848", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				appid: "d6f43e085fcbdfb6ca7d3b6daeed3b43",
				maxNumberOfDays: 7
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						//title: "New York Times", // ricky : 2020.08.31
						title: "연합 뉴스",
						//url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
						url: "http://www.yonhapnewstv.co.kr/browse/feed/"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
			}
		},
		{
			module: 'MMM-BackgroundSlideshow',
			position: 'fullscreen_below',
			config: {
				imagePaths: ['modules/media/'],
				transitionImages: true,
				randomizeImageOrder: true,
				recursiveSubDirectories : true,
				showImageInfo : true,
				backgroundSize : 'contain',
				slideshowSpeed : 1000*30,
			},
		},		
/*		{
			module: 'MMM-PIR-Sensor',
			position: "top_right",
			config: {
				// See 'Configuration options' for more information.
				sensorPin: 23,
				powerSavingDelay: 120, // Turn HDMI OFF after 60 seconds of no motion, until motion is detected again
				preventHDMITimeout: 4, // Turn HDMI ON and OFF again every 4 minutes when power saving, to avoid LCD/TV timeout
				supportCEC: true, 				
				presenceIndicator: "fa-eye", // Customizing the indicator
				presenceOffIndicator: "fa-eye", // Customizing the indicator
				presenceIndicatorColor: "#f51d16", // Customizing the indicator
				presenceOffIndicatorColor: "#2b271c" // Customizing the indicator
			}
		},				
		{
			module: 'MMM-Remote-Control',
			// uncomment the following line to show the URL of the remote control on the mirror
			//position: 'bottom_left',
			// you can hide this module afterwards from the remote control itself
			config: {
				customCommand: {},  // Optional, See "Using Custom Commands" below
				customMenu: "custom_menu.json", // Optional, See "Custom Menu Items" below
				showModuleApiMenu: true, // Optional, Enable the Module Controls menu
				apiKey: "",         // Optional, See API/README.md for details
			}
		},
*/		{
			module: 'MMM-HideAndShow-Sensor',
			config: {
				pin: 23,				// 모션센서 (항상 연결되어 있다는 가정)
				echoPin: 24,			// 초음파센서 에코 핀 또는 스위치 GPIO 핀
				triggerPin: 18,			// 초음파센서 트리거핀
				iSlideShowTime: 75,		// 슬라이드쇼 시간, 단위 초
				switch_on: false,		// 스위치를 사용하면 True, 초음파 센서를 이용하면 false
				position: "center",		
			}
		},	
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
