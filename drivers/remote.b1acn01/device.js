'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

let lastKey = null;

class AqaraRemoteb1acn01 extends ZigBeeDevice {
	async onMeshInit() {

		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		// supported scenes and their reported attribute numbers (all based on reported data)
		this.sceneMap = {
			1: {
				scene: 'Key Pressed 1 time'
			},
			2: {
				scene: 'Key Pressed 2 times'
			},
			0: {
				scene: 'Key Held Down'
			},
			255: {
				scene: 'Key Released'
			},
		};

		// Scene reports are provided by the genMultistateInput cluster / presentValue attribute
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 3600, 1,
				this.onSceneListener.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genMultistateInput - presentValue');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genMultistateInput - presentValue', err);
			});

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

		this.triggerButton1_button = new Homey.FlowCardTriggerDevice('button1_button');
		this.triggerButton1_button
			.register();

	}

	onSceneListener(repScene) {
		this.log('genMultistateInput', repScene, this.sceneMap[repScene].scene, 'lastKey', lastKey);

		if (lastKey !== repScene) {
			lastKey = repScene;
			if (Object.keys(this.sceneMap).includes(repScene.toString())) {
				const remoteValue = {
					scene: this.sceneMap[repScene].scene,
				};
				this.log('Scene trigger', remoteValue.scene);
				// Trigger the trigger card with 1 dropdown option
				Homey.app.triggerButton1_scene.trigger(this, null, remoteValue);
				// Trigger the trigger card with tokens
				this.triggerButton1_button.trigger(this, remoteValue, null);
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
			})
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
module.exports = AqaraRemoteb1acn01;

// WXKG11LM_ remote.b1acn01
/*
Node overview:
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ------------------------------------------
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] Node: f5b42996-97aa-45d8-a8c4-b45772286c06
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] - Battery: false
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] - Endpoints: 0
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] -- Clusters:
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] --- zapp
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] --- genBasic
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ---- 65281 : !�
                                                                               (!�!�$
!
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ---- cid : genBasic
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ---- sid : attrs
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ---- modelId : lumi.remote.b1acn01
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] --- genIdentify
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ---- cid : genIdentify
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ---- sid : attrs
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] --- genMultistateInput
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ---- cid : genMultistateInput
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ---- sid : attrs
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ---- presentValue : 255
2018-10-13 17:15:04 [log] [ManagerDrivers] [remote.b1acn01] [0] ------------------------------------------
*/