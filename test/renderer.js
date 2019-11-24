const {
  ipcRenderer,
  shell
} = require('electron');

//open links externally by default
const linksToBrowser = require('electron-hyperlinks-to-browser')

/* require the electron-midi module for testing (relative path): */
const ElectronMidi = require('./../')
/* require the electron-midi module for testing (node_modules path): */
//const ElectronMidi = require('electron-midi')
const electronMidi = new ElectronMidi();

electronMidi.onReady = refreshDom;
electronMidi.onHardwareChange = refreshDom;
electronMidi.onInputMessage = showInputMessage;

function refreshDom() {
  // for each I/O device populate dropdowns.

  let divInputDevices = document.getElementById("divInputDevices");
  divInputDevices.innerHTML = ""; // clear old DOM
  for (let input of electronMidi.inputs.values()) {
    var device = document.createElement("div");
    device.innerHTML = input.name;
    device.classList.add('device');
    divInputDevices.appendChild(device);
  }

  let divOutputDevices = document.getElementById("divOutputDevices");
  divOutputDevices.innerHTML = ""; // clear old DOM
  for (let output of electronMidi.outputs.values()) {
    var device = document.createElement("div");
    device.innerHTML = output.name;
    device.classList.add('device');
    divOutputDevices.appendChild(device);
  }


  document.getElementById("divStatusMessages").innerHTML = `Device list updated [${getTime()}]`;
};

function showInputMessage(e) {
  document.getElementById("divStatusMessages").innerHTML = `${e.srcElement.name}: [${e.data[0]},${e.data[1]},${e.data[2]}]`;
}



function getTime() {
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return time;
}

document.getElementById("btnLearn").addEventListener("click", () => {
  document.getElementById("divLearnInput").innerHTML = 'Now press any button on your Midi Device to learn it';

  electronMidi.learn()
    .then((result) => {
      document.getElementById("divLearnInput").innerHTML = `Learnt: ${result.input}:[${result.data[0]},${result.data[1]},${result.data[2]}]`;
    });
});
