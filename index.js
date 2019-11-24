/**
 * ElectronMidi Class
 * Description: Utility class making it easy to use the Web MIDI API, and Electron specific helper methods
 * License: MIT
 * Author: Jason Banfield / DMXify
 * Email: developer@dmxify.com
 */

const private_onHardwareChange = function(e) {
  console.log(e.port.manufacturer, e.port.name, e.port.type, e.port.state);
};

const internal_set_midiAccess_onstatechange = (self) => {
  if (self._midiAccess) {
    self._midiAccess.onstatechange = (e) => {
      // execute class's internal callback
      private_onHardwareChange(e);
      // followed by user defined callback
      self._onHardwareChange(e);
    }
  }
};

const ElectronMidi = class {
  constructor() {
    // initially get midiAccess states
    this._midiAccess = {};
    this._onHardwareChange = function() {};
    this._onReady = function() {};
    this.init();
  }
  get midiAccess() {
    return this._midiAccess;
  }

  get inputs() {
    return this._midiAccess.inputs;
  }
  get outputs() {
    return this._midiAccess.outputs;
  }

  /** set onHardwareChange
   *    set a user defined callback
   */
  set onHardwareChange(fn) {
    this._onHardwareChange = fn;
    internal_set_midiAccess_onstatechange(this);
  }

  get onHardwareChange() {
    return this._onHardwareChange;
  }

  set onReady(fn) {
    this._onReady = fn;
  }

  init() {
    navigator.requestMIDIAccess()
      .then(midiAccess => {
          this._midiAccess = midiAccess;
        },
        error => {
          console.error(error);
        }).then(() => {
        internal_set_midiAccess_onstatechange(this);
      }).then(() => {
        this._onReady();
      });
  }
}
/*

*/

module.exports = ElectronMidi;
