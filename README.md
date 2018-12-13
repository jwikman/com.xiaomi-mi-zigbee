# Xiaomi / Aqara Smart Home (Zigbee)

### This app requires Homey SW release 1.5.7 or higher

This app adds support for the Zigbee Smart Home devices made by [Xiaomi Smart Home Devices](https://xiaomi-mi.com/).  
<a href="https://github.com/TedTolboom/com.xiaomi-mi-zigbee">
  <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/assets/images/small.png">
</a>  

## Links:
[Xiaomi-mi / Aqara Zigbee app Athom apps](https://apps.athom.com/app/com.xiaomi-mi-zigbee)                    
[Xiaomi-mi / Aqara Zigbee app Github repository](https://github.com/TedTolboom/com.xiaomi-mi-zigbee)   

**Note:** This app is using [HomeyConfig composer](https://www.npmjs.com/package/node-homey-config-composer).   
Please file Pull Requests on the *development* branch of this repository and with respect to the refactored files in _/drivers_ and _/config_ folders.   

## Supported devices (supported capabilities)
* [Door/Window sensor (MCCGQ01LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-door-window-sensors/) (contact alarm)
* [Occupancy Sensor (RTCGQ01LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-occupancy-sensor/) (motion alarm)
* [Temperature/Humidity Sensor (WSDCGQ01LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-temperature-humidity-sensor/) (temperature, relative humidity)
* [Wireless switch (WXKG01LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-wireless-switch/) (1x - 4x click, Key Held, Key released)  
* [Smart socket plug ZigBee edition (ZNCZ02LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-smart-socket-plug-2-zigbee-edition-white/) (onoff, measure_power)
* [Cube (MFKZQ01LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-smart-home-cube-white/) (Slide, Shake, Double Tap, Rotate (angle, relative angle), Flip 90°, Flip 180°), see [device readme for details](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/blob/master/docs/README_cube.md)

* [Aqara Curtain Controller (ZNCLDJ11LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-aqara-smart-curtain-controller-white/) (open, close, idle, setpoint (100% = open, 0% = closed))   
* [Aqara Window/Door Sensor (MCCGQ11LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-aqara-window-door-sensor/) (contact alarm)
* [Aqara Human Body Sensor (RTCGQ11LM)](https://xiaomi-mi.com/sockets-and-sensors/aqara-human-body-sensor/) (motion alarm, luminance)
* [Aqara Temperature and Humidity Sensor (WSDCGQ11LM)](https://xiaomi-mi.com/sockets-and-sensors/aqara-temperature-and-humidity-sensor/) (temperature, relative humidity, atmospheric pressure)
* [Aqara Smart Light Wall Switch (L) Single (QBKG04LM)](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-light-wall-switch-zigbee-version-single-key/) / [Double (QBKG03LM)](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-light-wall-switch-zigbee-version-double-key/) (onoff)
* [Aqara Smart Light Wall Switch (LN) Single (QBKG11LM)](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-light-wall-switch-zigbee-version-single-key/) / [Double (QBKG12LM)](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-light-wall-switch-zigbee-version-double-key/) (onoff)
* [Aqara Smart Socket ZigBee Version (QBCZ11LM)](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-socket-zigbee-version/) (onoff, measure_power)
* [Aqara Wireless switch (WXKG11LM, productID `sensor_switch.aq2`)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-aqara-smart-wireless-switch/) (1x - 4x click)   
* [Aqara Wireless Mini Switch (2018) (WXKG11LM, productID `remote.b1acn01`)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-aqara-smart-wireless-switch/) (1x, 2x click, key held, key released)   
* [Aqara Wireless switch with Gyro (WXKG12LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-aqara-smart-wireless-switch/) (1x, 2x click, key held, key released, Shaken)
* [Aqara Wireless Remote Switch Single (WXKG03LM, productID `sensor_86sw1lu`)](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-light-wall-switch-single-key/) / [Double (WXKG02LM, productID `sensor_86sw2Un`)](https://xiaomi-mi.com/sockets-and-sensors/remote-switch-for-aqara-smart-light-wall-switch-double-key/) (1x click for each button and combined)     
* [Aqara Wireless Switch Single (2018) (WXKG03LM, productID `remote.b186acn01`)](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-light-wall-switch-single-key/) / [Double (2018) (WXKG02LM, productID `remote.b286acn01`)](https://xiaomi-mi.com/sockets-and-sensors/remote-switch-for-aqara-smart-light-wall-switch-double-key/) (1x, 2x click, long press for each button and combined)   
* [Aqara Vibration Sensor (DJT11LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-smart-home-cube-white/) (tilt-, vibration-, drop-motion, tilt angles (to reference plane), tilt angles (to previous position), vibration strength, tilt-, vibration-, drop-alarm)      

**Notes:**
* Battery operated devices will not yet show the **battery level**; this will be added in a future release (manufacturer specific ZigBee implementation)    
* The Smart socket plug and Aqara Smart Socket ZigBee version report the actual power (W), **consumed energy (kWh)** will be added in a future release (manufacturer specific ZigBee implementation)    

## Devices Work in Progress (awaiting additional clusters in Homey's Zigbee implementation)
* MiJia Honeywell Smoke Detector White
* MiJia Honeywell Gas Leak Detector
* MiJia Aqara Water sensor

## Supported Languages:
* English
* Dutch

## Acknowledgements:
This app and driver development has been supported by:  
* Sprut666666   
* Kasteleman   
* BasKiers
* RobinBolscher

## Feedback:
Any requests please post them in the [Xiaomi-mi Zigbee topic on the Athom Forum](https://forum.athom.com/discussion/4120/) or contact me on [Slack](https://athomcommunity.slack.com/team/tedtolboom)    
Please report issues at the [issues section on Github](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues) otherwise in the above mentioned topic.     

## Change Log:
### v 0.4.3
* Add support for the Aqara Wireless Mini Switch (2018) (WXKG11LM, productID `sensor_switch.aq2`), issue [#89](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/89)    
* Add support for the Aqara Wireless Switch Single (2018) (WXKG03LM, productID `remote.b186acn01`), issue [#88](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/88)    
* Add support for the Aqara Wireless Switch Double (2018) (WXKG02LM, productID `remote.b286acn01`), issue [#88](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/88)    
**Note:** These devices are released by Xiaomi / Aqara with the same product code, but different firmware & capabilities. It is not possible based on the device label to determine which version you have, only based on the Zigbee productID once added to Homey   
* Fix issue where alarm triggers for Aqara vibration sensor were triggered twice, issue [#97](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/97)   
* Add settings option to determine amount of decimals reported for temperature & humidity, feature request [#98](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/98)   

### v 0.4.2
* Add support for the Aqara Vibration Sensor (DJT11LM), with capabilities tilt-, vibration-, drop-motion, tilt angles (to reference plane), tilt angles (to previous position), vibration strength, tilt-, vibration-, drop-alarm   
* Removing the old, no longer working, (marked DEPRECATED) cards as announced in as of release v 0.3.0   
* Optimizing the attribute report settings   
* Update ZigBee meshdriver to 1.2.27      

### v 0.4.1
* Fix issue where the Aqara Smart Light Wall Switch (**LN**) Single (product type no: QBKG11LM) can not be controlled   

### v 0.4.0
* Add support for the 'Aqara Curtain controller' (product type no: ZNCLDJ11LM)   
* Fix issue where Aqara Smart Light Wall Switch (**L**) right button is not activated by FlowCard, issue [#64](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/64).   
Existing flows for this device will need to be rebuild   
* Fix issue / add support for Aqara Smart Light Wall Switch (**LN**), issue [#60](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/60).   
Re-inclusion of devices with Zigbee Product ID `lumi.ctrl_ln1.aq1` and `lumi.ctrl_ln2.aq1` is needed   

**Note:** The old (marked DEPRECATED) flow cards of the wireless switches will be removed in a next release; please rebuild your flows based on the new cards   

### v 0.3.0
* Add support for Aqara Wireless switch with Gyro (product type no: WXKG12LM)   
**Note:** Switches with this type no. that were included before will need to be re-included in order to work properly   
* Replaced old scene trigger cards with autocomplete cards to fix reported issues   
**Note:** The old (marked DEPRECATED) cards will be removed in a next release; please rebuild your flows based on the new cards  
* Update ZigBee meshdriver to 1.2.12   

### v 0.2.5
* Add temperature offset correction setting for the Xiaomi temperature & humidity sensor and the Aqara temperature & humidity sensor   
* Fix typo in Xiaomi Cube flow trigger card

### v 0.2.4
* Fix issue where Aqara Wireless Remote Switch Single init results in app crash, issue [#46](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/46)   

### v 0.2.3
* Updated app dependency to latest Stable Homey Software release (>= 1.5.7)
* Update ZigBee meshdriver to 1.2.7   
* Add support for the Xiaomi Cube rotation angle (and relative angle) capability, fix issue [#29](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/29)
* Add additional ID's for Aqara Smart Light Wall Switch Single / Double, fix issue [#20](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/20))
* Add additional ID's for Aqara Wireless Switch, fix issue [#38](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/38))   
* Fix issue where unsupported options are presented in the trigger card of the Aqara Wireless Remote Switch Single, related to [#37](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/37)

### v 0.2.2
* Update relative link in readme.md to direct link (Homey apps compatible)   
* Update app manifest for supported Devices   

### v 0.2.1
* Add support for Xiaomi Cube (Slide, Shake, Double Tap, Rotate (action, not angle yet), Flip 90°, Flip 180°).   
**note:** Cubes included based on previous development builds need to be re-included   

### v 0.2.0
* Add support for Smart socket plug ZigBee edition (onoff, measure_power)   
* Add support for Aqara Smart Light Wall Switch Single / Double (onoff)   
* Add support for Aqara Smart Socket ZigBee Version (onoff, measure_power)   
* Add explicitly in app title dependency on Homey SW release (>= 1.5.4)   
