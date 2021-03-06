/**
 * Utility module making it easy to use the Web MIDI API, and Electron specific helper methods
 * @module electron-midi
 * @version 0.1.3
 * @author Jason Banfield <developer@dmxify.com>
 * @license MIT
 */

const consoleLogMidiMessages = function(e) {
  var str = '';
  for (var i = 0; i < e.data.length; i++) {
    str += "0x" + e.data[i].toString(16) + " ";
  }
  console.log(`${e.srcElement.name}:${e.srcElement.type} [${e.data.length} bytes] - ${str}`);
}

/**
 * @class ElectronMidi - The default export of the electron-midi module.
 * @property {function} onHardwareChange - callback to execute when Midi hardware availability changes (i.e. added/removed)
 * @property {function} onInputMessage - callback to execute when Midi hardware input message is received
 * @property {function} onReady - callback to execute when this ElectronMidi class instance has finished initializing
 * @method midiAccess - get `MidiAccess` object, containing midi ports, hardware states, and event handlers
 * @method inputs - get `Iterable` containing all `MidiInputPort` objects.
 * @method outputs - get `Iterable` containing all `MidiOutputPort` objects.
 * @method learn - Returns `Promise` which overrides next default action of the `onmidimessage` event. Resolves with the next `onmidimessage` event's `MidiInputMessage`{data.<object>} and {name.<string>} of the MidiInputPort
 * @method echoMIDIMessage
 */
const ElectronMidi = class {
  constructor() {
    // initially get midiAccess states
    this._midiAccess = {};
    this._onHardwareChange = function() {};
    this._onReady = function() {};
    this._onInputMessage = consoleLogMidiMessages;
    this._onOutputMessage = this.echoMIDIMessage;
    this.init();
  }

  /**
   * @method midiAccess
   * @returns {object} ElectronMidi class instance property value for MidiAccess
   */
  get midiAccess() {
    return this._midiAccess;
  }

  /**
   * @method inputs - get `Iterable` containing all `MidiInputPort` objects.
   * @returns {iterable.<object>}
   */
  get inputs() {
    return this._midiAccess.inputs;
  }

  /**
   * @method outputs - get `Iterable` containing all `MidiOutputPort` objects.
   * @returns {iterable.<object>}
   */
  get outputs() {
    return this._midiAccess.outputs;
  }

  /**
   * @method learn - Returns a promise which temporarily overrides the default onmidimessage event handler and only resolves when onmidimessage is triggered
   * @returns {Promise}
   * @resolve {Object} - The next `MidiInputMessage` triggered by a MidiInputPort, containing:
   * - `data`: `array` containing MidiMessage `uint8Array` values
   * - `input`: the name of the `MidiInputPort`
   */
  learn() {
    this._previous_onInputMessage = this._onInputMessage;
    return new Promise((resolve) => {
      // override onmidimessage handler:
      this.onInputMessage = (e) => {
        // revert to previous onmidimessage handler:
        this.onInputMessage = this._previous_onInputMessage;
        // and send the triggered midi data back to the promise's resolve callback:
        resolve({
          data: e.data,
          input: e.target.name
        });
      }
    });
  }

  /**
   * @name initMidiInputs - Internal method
   * @private
   */
  initMidiInputs() {
    // get inputs iterator
    let inputs = this._midiAccess.inputs.values();
    // iterate over the inputs iterator, setting the onmidimessage handler for each input port.
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = (e) => {
        this._onInputMessage(e);
        this._onOutputMessage(e);
      }
    }
  }

  /**
   * @name applyMidiAccess_onstatechange - Internal method
   * @private
   */
  applyMidiAccess_onstatechange() {
    if (this._midiAccess) {
      this._midiAccess.onstatechange = (e) => {
        // execute class's internal callback
        this.initMidiInputs();
        // followed by user defined callback,
        // only if MidiAccess's outputs / inputs changed:
        // console.log(e);
        // console.warn(`${e.port.type} ${e.port.state} ${e.port.connection} - ${e.port.name} `);
        // if (e.port == 'MIDIInput') {
        //
        // }
        this._onHardwareChange(e);
      }
    }
  };



  /**
   * Event listeners
   */

  set onInputMessage(fn) {
    this._onInputMessage = (e) => {
      consoleLogMidiMessages(e);
      fn(e);
    }
  }
  set onOutputMessage(fn) {
    this._onOutputMessage = (e) => {
      this.echoMIDIMessage(e);
      fn(e);
    }
  }

  set onHardwareChange(fn) {
    this._onHardwareChange = fn;
  }

  set onReady(fn) {
    this._onReady = fn;
  }

  /**
   * @method echoMIDIMessage - Echos input MidiMessage to the first Midi output device port with the same name
   */
  echoMIDIMessage(e) {
    this.send(e.target.name, e.data)
  }

  /**
   * @method send - sends `MidiMessage` to a `MidiOutputPort` with a specific `MidiOutputPortName`.
   * @property {string} midiOutputPortName - Name of the MidiOutputPort to send this MidiMessage to.
   * @property {array} data - array containing three ES2017 uint8Array values, making up a MidiMessage.
   * @returns {undefined} - Returns `undefined` if specified `MidiOutputPort` is not found.
   */
  send(midiOutputPortName, data) {
    let outputs = this._midiAccess.outputs.values();
    for (var o = outputs.next(); o && !o.done; o = outputs.next()) {
      if (o.value.name == midiOutputPortName) {
        o.value.send(data);
        return;
      }
    }
  }

  /**
   * @method sendAll - sends each `MidiMessage` in an array to a `MidiOutputPort` with a specific `MidiOutputPortName`.
   * @property {string} midiOutputPortName - Name of the MidiOutputPort to send this MidiMessage to.
   * @property {array} arrData - 2d array, each nested array contains three ES2017 uint8Array values, making up a MidiMessage.
   * @returns {undefined} - Returns `undefined` if specified `MidiOutputPort` is not found.
   */
  sendAll(midiOutputPortName, arrData) {
    arrData.forEach(data => this.send(midiOutputPortName, data));
  }

  /**
   * @method init - Calls the Web MIDI API's `navigator.requestMIDIAccess()` method, and sets class instance with the returned `MidiAccess` property. It then sets event handlers accordingly.
   * @private
   */
  init() {
    navigator.requestMIDIAccess()
      .then(midiAccess => {
          this._midiAccess = midiAccess;
          // set onmidimessage handler:
          this.applyMidiAccess_onstatechange();
          this.initMidiInputs();
          this._onReady();
        },
        error => {
          console.error(error);
        });
  }
}

module.exports = ElectronMidi;
