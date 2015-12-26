var Service, Characteristic, types;

var wpi = require( 'wiring-pi' );

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    types = homebridge.hapLegacyTypes;  
    homebridge.registerPlatform("homebridge-wiring-pi", "homebridge-wiring-pi", WiringPiPlatform);
}

// Construct the platform object
function WiringPiPlatform(log,config) {
    this.log = log;
    this.config = config;
    this.devices = config.devices;
}

WiringPiPlatform.prototype.accessories = function(callback) {
    var results = [];
    for(var index = 0; index < this.devices.length; index++) {
        var newDevice = new WiringPiDevice(this.log,this.devices[index]);
        results.push(newDevice);
    }
    callback(results);
}

function WiringPiDevice(log,device) {
    this.log = log;
    this.device = device;
    this.uuid_base  = "wiringpi_" + this.device.pin + "_" + this.device.raiseMs;
    this.name = device.name;
}

WiringPiDevice.prototype.identify = function(callback) {
    // Do the identify action
    callback();
}

WiringPiDevice.prototype.execute = function(callback,param2) {
    console.log("Execute got: "+callback+" param2: "+param2);
}

WiringPiDevice.prototype.getServices = function() {
    var informationService = new Service.AccessoryInformation();
	
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Wiring Pi")
      .setCharacteristic(Characteristic.Model, this.device.name)
      .setCharacteristic(Characteristic.SerialNumber, this.device.name + ' Pin ' + this.device.pin + ' RaiseMs ' + this.device.raiseMs);	
	  
    var statelessSwitchService = new Service.StatelessProgrammableSwitch();
    this.statelessSwitchService = statelessSwitchService;
    this.informationService = informationService;	
    
    statelessSwitchService
      .getCharacteristic(Characteristic.ProgrammableSwitchEvent)
      .on('set', this.execute.bind(this));
	  
    return [informationService, statelessSwitchService];	
}

module.exports.platform = WiringPiPlatform;
module.exports.accessory = WiringPiDevice;




