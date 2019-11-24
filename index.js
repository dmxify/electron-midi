/**
 * ElectronMidi Class
 * Description: Utility class making it easy to use the Web MIDI API, and Electron specific helper methods
 * License: MIT
 * Author: Jason Banfield / DMXify
 * Email: developer@dmxify.com
 */





const consoleLogMidiMessages = function(e) {
  var str = '';
  for (var i = 0; i < e.data.length; i++) {
    str += "0x" + e.data[i].toString(16) + " ";
  }
  console.log(`${e.srcElement.name}:${e.srcElement.type} [${e.data.length} bytes] - ${str}`);
}

const ElectronMidi = class {
  constructor() {
    // initially get midiAccess states
    this._midiAccess = {};
    this._onHardwareChange = function() {};
    this._onReady = function() {};
    this._onInputMessage = consoleLogMidiMessages;
    this._onOutputMessage = function(e) {
      console.log(e)
    };
    this.init();
  }
  get midiAccess() {
    return this._midiAccess;
  }

  /** get input devices */
  get inputs() {
    return this._midiAccess.inputs;
  }
  /** get output devices */
  get outputs() {
    return this._midiAccess.outputs;
  }

  learn() {
    this._previous_onInputMessage = this._onInputMessage;
    return new Promise((resolve) => {
      this.onInputMessage = (e) => {
        this.onInputMessage = this._previous_onInputMessage;
        resolve({
          data: e.data,
          input: e.target.name
        });
      }
    });
  }

  /**
   * Internal methods
   */
  internal_setAllInputHandlers() {
    // get inputs iterator
    let inputs = this._midiAccess.inputs.values();
    // iterate over the inputs iterator, setting the onmidimessage handler for each input port.
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      console.dir(`set ${input.value.name}`);
      input.value.onmidimessage = (e) => {
        this._onInputMessage(e);
      }
    }
  }
  internal_set_midiAccess_onstatechange() {
    if (this._midiAccess) {
      this._midiAccess.onstatechange = (e) => {
        // execute class's internal callback
        this.internal_onHardwareChange(e);
        // followed by user defined callback
        this._onHardwareChange(e);
      }
    }
  };

  internal_onHardwareChange(e) {
    // set onmidimessage for input ports here:
    this.internal_setAllInputHandlers();
    //console.log(e.port.manufacturer, e.port.name, e.port.type, e.port.state);
  }


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
    this._onOutputMessage = fn;
  }

  set onHardwareChange(fn) {
    this._onHardwareChange = fn;
    this.internal_set_midiAccess_onstatechange();
  }

  set onReady(fn) {
    this._onReady = fn;
  }

  init() {
    navigator.requestMIDIAccess()
      .then(midiAccess => {
          this._midiAccess = midiAccess;

          // set onmidimessage handler:
          this.internal_setAllInputHandlers();
        },
        error => {
          console.error(error);
        })
      .then(() => {
        this.internal_set_midiAccess_onstatechange();
      })
      .then(() => {
        this._onReady();
      });
  }
}

module.exports = ElectronMidi;
