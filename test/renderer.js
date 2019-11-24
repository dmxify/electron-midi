const {
  ipcRenderer,
  shell
} = require('electron');

//open links externally by default
const linksToBrowser = require('electron-hyperlinks-to-browser')

/* require the electron-midi module for testing (relative path): */
const ElectronMidi = require('./../')
const electronMidi = new ElectronMidi();

// electronMidi.onHardwareChange = function(e){
//   console.log(`override: ${e.port}`);
// };

electronMidi.onHardwareChange = function(e) {
  refreshDom();
}

electronMidi.onReady = refreshDom;

function refreshDom() {
  // for each I/O device populate dropdowns.

  // remove existing options:
  let selectInputs = document.getElementById("selectInputs");
  let selectOutputs = document.getElementById("selectOutputs");
  // remove the current options from the input select
  while (selectInputs.options.length > 0) {
    selectInputs.remove(0);
  }
  while (selectOutputs.options.length > 0) {
    selectOutputs.remove(0);
  }

  for (let input of electronMidi.inputs.values()) {
    var opt = document.createElement("option");
    opt.text = input.name;
    document.getElementById("selectInputs").add(opt);
  }
  for (let output of electronMidi.outputs.values()) {
    var opt = document.createElement("option");
    opt.text = output.name;
    document.getElementById("selectOutputs").add(opt);
  }
};
