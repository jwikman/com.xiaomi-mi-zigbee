'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraWallSwitchDoubleL extends ZigBeeDevice {

	async onMeshInit() {
		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		// Register capabilities and reportListeners for Left switch
		this.registerCapability('onoff', 'genOnOff', {
			endpoint: 1
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
			this.switchOneAttrListener.bind(this), 1, true);

		// Register capabilities and reportListeners for Right switch
		this.registerCapability('onoff.1', 'genOnOff', {
			endpoint: 2
		});
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
			this.switchTwoAttrListener.bind(this), 2, true);

	}

	// Method to handle changes to attributes
	switchOneAttrListener(data) {
		this.log('[AqaraLightControlDouble] [switchOneAttrListener] Received data =', data);
		this.setCapabilityValue('onoff', data === 1);
	}

	switchTwoAttrListener(data) {
		this.log('[AqaraLightControlDouble] [switchTwoAttrListener] Received data =', data);
		let currentValue = this.getCapabilityValue('onoff.1');
		this.setCapabilityValue('onoff.1', data === 1);
		if (currentValue !== (data === 1)) {
			Homey.app[`_triggerSwitchTwoTurned${data === 1 ? 'On' : 'Off'}`].trigger(this, {}, {}).catch(this.error);
		}
	}

	// <<<< Temporary till until Zigbee Meshdriver bug is fixed.
	// See https://github.com/athombv/homey/issues/2137
	// Rewrite parent method to overcome Zigbee Meshdriver bug.
	_mergeSystemAndUserOpts(capabilityId, clusterId, userOpts) {

		// Merge systemOpts & userOpts
		let systemOpts = {};

		let tempCapabilityId = capabilityId;
		let index = tempCapabilityId.lastIndexOf('.');
		if (index !== -1) {
			tempCapabilityId = tempCapabilityId.slice(0, index)
		}

		try {
			systemOpts = Homey.util.recursiveDeepCopy(require(`../../node_modules/homey-meshdriver/lib/zigbee/system/capabilities/${tempCapabilityId}/${clusterId}.js`));

			// Bind correct scope
			for (let i in systemOpts) {
				if (systemOpts.hasOwnProperty(i) && typeof systemOpts[i] === 'function') {
					systemOpts[i] = systemOpts[i].bind(this);
				}
			}
		}
		catch (err) {
			if (err.code !== 'MODULE_NOT_FOUND' || err.message.indexOf(`../../node_modules/homey-meshdriver/lib/zigbee/system/capabilities/${tempCapabilityId}/${clusterId}.js`) < 0) {
				process.nextTick(() => {
					throw err;
				});
			}
		}

		// Insert default endpoint zero
		if (userOpts && !userOpts.hasOwnProperty('endpoint')) userOpts.endpoint = this.getClusterEndpoint(clusterId);
		else if (typeof userOpts === 'undefined') userOpts = {
			endpoint: this.getClusterEndpoint(clusterId)
		};

		this._capabilities[capabilityId][clusterId] = Object.assign(
			systemOpts || {},
			userOpts || {}
		);
	}
	// >>>>
}

module.exports = AqaraWallSwitchDoubleL;

/*
Product ID: QBKG03LM
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] ZigBeeDevice has been inited
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] ------------------------------------------
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] Node: f0892c11-3cf9-4448-acb8-30691a9c43a3
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Battery: false
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 0
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genBasic
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genBasic
2018-01-14 10:00:22 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- zclVersion : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- appVersion : 18
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- stackVersion : 2
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- hwVersion : 38
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- manufacturerName : LUMI
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- modelId : lumi.ctrl_neutral2
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- dateCode : 11-11-2016
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- powerSource : 4
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- locationDesc :
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genPowerCfg
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genPowerCfg
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- mainsVoltage : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- mainsAlarmMask : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- batteryVoltage : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genDeviceTempCfg
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genDeviceTempCfg
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentTemperature : 21
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- lowTempThres : 55
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- highTempThres : 60
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genIdentify
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genIdentify
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- identifyTime : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genTime
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genTime
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOta
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOta
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 1
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genGroups
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genGroups
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- nameSupport : 128
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genScenes
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genScenes
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- count : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentScene : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentGroup : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sceneValid : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- nameSupport : 128
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- 61440 : 53562368
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genBinaryOutput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genBinaryOutput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- activeText : ON
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- description : CHANNEL1
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- inactiveText : OFF
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minimumOffTime : 500000
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minimumOnTime : 500000
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- applicationType : 67109376
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 2
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genGroups
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genGroups
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- nameSupport : 128
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genScenes
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genScenes
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- count : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentScene : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- currentGroup : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sceneValid : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- nameSupport : 128
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genBinaryOutput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genBinaryOutput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- activeText : ON
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- description : CHANNEL2
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- inactiveText : OFF
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minimumOffTime : 500000
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minimumOnTime : 500000
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- applicationType : 67109377
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 3
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 1
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genMultistateInput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genMultistateInput
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- numberOfStates : 4
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 4
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:23 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genMultistateInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genMultistateInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- numberOfStates : 4
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 5
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genOnOff
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genOnOff
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- onOff : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genMultistateInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genMultistateInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- numberOfStates : 4
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] - Endpoints: 6
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] -- Clusters:
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- zapp
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] --- genAnalogInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- cid : genAnalogInput
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- sid : attrs
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- description : POWER
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- maxPresentValue : 1600
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- minPresentValue : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- outOfService : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- presentValue : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- resolution : 1
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- statusFlags : 0
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ---- applicationType : 590336
2018-01-14 10:00:24 [log] [ManagerDrivers] [ctrl_neutral2] [0] ------------------------------------------

Left button to a wireless switch:
Cluster: genBasic (0x0000)
Atribute: Unknown (0xff22) 65314
Data Type: 8-bit unsigned (0x20)
	disabled (regular switch): 18
	enabled: 254

Right button to a wireless switch:
Cluster: genBasic (0x0000)
Atribute: Unknown (0xff23) 65315
Data Type: 8-bit unsigned (0x20)
	disabled (regular switch): 18
	enabled: 254

When converted to a wireless switch:
Cluster: genOnOff (0x0006)
Atribute: onOff (0x0000)
1x click: Double attribute (off (0x00) + on (0x01))
2x click: data value 2 (0x02)
Hold: Off (0x00)
Release: ON (0x01)
*/