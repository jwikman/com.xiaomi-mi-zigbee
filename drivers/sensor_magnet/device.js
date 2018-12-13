'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class XiaomiDoorWindowSensor extends ZigBeeDevice {
	onMeshInit() {
		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		// Listen for attribute changes on the genOnOff cluster
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 60, null,
				this.onContactReport.bind(this), 0)
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genOnOff - Contact', err);
			});

		this.registerAttrReportListener('genBasic', '65282', 1, 60, null, data => {
			this.log('65282', data);
		}, 0);
	}

	onContactReport(data) {
		this.log(`alarm_contact -> ${data === 1}`);
		this.setCapabilityValue('alarm_contact', data === 1);
	}

}

module.exports = XiaomiDoorWindowSensor;

// MCCGQ01LM_sensor_magnet
/*
Node overview
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] Node: 2a3902d3-988a-4ae5-adea-6e0d7c85ec5e
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] - Battery: false
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] - Endpoints: 0
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] -- Clusters:
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- zapp
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genBasic
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genBasic
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genIdentify
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genIdentify
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genGroups
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genGroups
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genScenes
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genScenes
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genOnOff
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genOnOff
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genLevelCtrl
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genLevelCtrl
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- genOta
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : genOta
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] --- manuSpecificCluster
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- cid : manuSpecificCluster
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ---- sid : attrs
2017-10-21 00:55:34 [log] [ManagerDrivers] [sensor_magnet] [0] ------------------------------------------

65281 - 0xFF01 report:
Not reported
*/