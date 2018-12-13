'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

let lastKey = null;

class AqaraRemoteb286acn01 extends ZigBeeDevice {
	async onMeshInit() {

		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		// supported scenes and their reported attribute numbers (all based on reported data)
		this.buttonMap = {
			Left: {
				button: 'Left button',
			},
			Right: {
				button: 'Right button',
			},
			Both: {
				button: 'Both buttons',
			},
		};

		this.sceneMap = {
			1: {
				scene: 'Key Pressed 1 time'
			},
			2: {
				scene: 'Key Pressed 2 times'
			},
			0: {
				scene: 'Key long pressed'
			},
		};

		// Scene reports are provided by the genMultistateInput cluster / presentValue attribute
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 3600, 1,
				this.onSceneListener.bind(this, 'Left'), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genMultistateInput - presentValue');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genMultistateInput - presentValue', err);
			});

		// Scene reports are provided by the genMultistateInput cluster / presentValue attribute
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 3600, 1,
				this.onSceneListener.bind(this, 'Right'), 1)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genMultistateInput - presentValue');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genMultistateInput - presentValue', err);
			});

		// Scene reports are provided by the genMultistateInput cluster / presentValue attribute
		this._attrReportListeners['2_genMultistateInput'] = this._attrReportListeners['2_genMultistateInput'] || {};
		this._attrReportListeners['2_genMultistateInput']['presentValue'] =
			this.onSceneListener.bind(this, 'Both');

		/*
		// Scene reports are provided by the genMultistateInput cluster / presentValue attribute
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 3600, 1,
				this.onSceneListener.bind(this, 'Both'), 2)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genMultistateInput - presentValue');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genMultistateInput - presentValue', err);
			});
		*/

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
				this.onLifelineReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genBasic - Lifeline');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genBasic - Lifeline', err);
			});

		// define and register FlowCardTriggers
		this.onSceneAutocomplete = this.onSceneAutocomplete.bind(this);

		this.triggerButton2_button = new Homey.FlowCardTriggerDevice('button2_button');
		this.triggerButton2_button
			.register();

	}

	onSceneListener(repButton, repScene) {
		this.log('genMultistateInput - presentValue', this.buttonMap[repButton].button, this.sceneMap[repScene].scene, 'lastKey', lastKey);
		if (lastKey !== repButton + ' ' + repScene) {
			lastKey = repButton + ' ' + repScene;
			if (Object.keys(this.sceneMap).includes(repScene.toString())) {
				const remoteValue = {
					button: this.buttonMap[repButton].button,
					scene: this.sceneMap[repScene].scene,
				};
				this.log('genMultistateInput - presentValue', remoteValue);
				// Trigger the trigger card with 2 autocomplete options
				Homey.app.triggerButton2_scene.trigger(this, null, remoteValue);
				// Trigger the trigger card with tokens
				this.triggerButton2_button.trigger(this, remoteValue, null);
				// reset lastKey after the last trigger
				this.buttonLastKeyTimeout = setTimeout(() => {
					lastKey = null;
				}, 3000);
			}
		}
	}

	onSceneAutocomplete(query, args, callback) {
		let resultArray = [];
		for (let sceneID in this.sceneMap) {
			resultArray.push({
				id: this.sceneMap[sceneID].scene,
				name: Homey.__(this.sceneMap[sceneID].scene),
			});
		}
		// filter for query
		resultArray = resultArray.filter(result => {
			return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
		});
		this.log(resultArray);
		return Promise.resolve(resultArray);
	}

	onButtonAutocomplete(query, args, callback) {
		let resultArray = [];
		for (let sceneID in this.buttonMap) {
			resultArray.push({
				id: this.buttonMap[sceneID].button,
				name: Homey.__(this.buttonMap[sceneID].button),
			});
		}

		// filter for query
		resultArray = resultArray.filter(result => {
			return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
		});
		this.log(resultArray);
		return Promise.resolve(resultArray);
	}

	onLifelineReport(value) {
		this.log('lifeline report', new Buffer(value, 'ascii'));
		/*
		const parsedData = parseData(new Buffer(value, 'ascii'));
		// this.log('parsedData', parsedData);

		// battery reportParser (ID 1)
		const parsedVolts = parsedData['1'] / 100.0;
		const minVolts = 2.5;
		const maxVolts = 3.0;

		const parsedBatPct = Math.min(100, Math.round((parsedVolts - minVolts) / (maxVolts - minVolts) * 100));
		this.log('lifeline - battery', parsedBatPct);
		if (this.hasCapability('measure_battery') && this.hasCapability('alarm_battery')) {
			// Set Battery capability
			this.setCapabilityValue('measure_battery', parsedBatPct);
			// Set Battery alarm if battery percentatge is below 20%
			this.setCapabilityValue('alarm_battery', parsedBatPct < (this.getSetting('battery_threshold') || 20));
		}

		// contact alarm reportParser (ID 100)
		// const parsedContact = (parsedData['100'] === 1);
		// this.log('lifeline - contact alarm', parsedContact);
		// this.setCapabilityValue('alarm_contact', parsedContact);

		function parseData(rawData) {
			const data = {};
			let index = 0;
			while (index < rawData.length) {
				const type = rawData.readUInt8(index + 1);
				const byteLength = (type & 0x7) + 1;
				const isSigned = Boolean((type >> 3) & 1);
				data[rawData.readUInt8(index)] = rawData[isSigned ? 'readIntLE' : 'readUIntLE'](index + 2, byteLength);
				index += byteLength + 2;
			}
			return data;
		}
		*/
	}
}
module.exports = AqaraRemoteb286acn01;

// WXKG12LM_sensor_switch.aq3
/*
Node overview:
2018-10-13 17:37:48 [log] [ManagerDrivers] [remote.b286acn01] [0] ZigBeeDevice has been inited
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ------------------------------------------
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] Node: 94d963cd-7751-4ed6-a799-e4bd841a6bc4
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] - Battery: false
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] - Endpoints: 0
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] -- Clusters:
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- zapp
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genBasic
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genBasic
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genIdentify
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genIdentify
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genGroups
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genGroups
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genScenes
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genScenes
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genMultistateInput
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genMultistateInput
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genOta
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genOta
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- manuSpecificCluster
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : manuSpecificCluster
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] - Endpoints: 1
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] -- Clusters:
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- zapp
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genIdentify
2018-10-13 17:37:49 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genIdentify
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genGroups
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genGroups
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genScenes
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genScenes
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genMultistateInput
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genMultistateInput
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] - Endpoints: 2
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] -- Clusters:
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] --- zapp
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genIdentify
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genIdentify
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genGroups
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genGroups
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genScenes
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genScenes
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] --- genAnalogInput
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- cid : genAnalogInput
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ---- sid : attrs
2018-10-13 17:37:50 [log] [ManagerDrivers] [remote.b286acn01] [0] ------------------------------------------
*/