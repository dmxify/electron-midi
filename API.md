<a name="module_electron-midi"></a>

## electron-midi
Utility module making it easy to use the Web MIDI API, and Electron specific helper methods

**Version**: 0.1.3  
**Author**: Jason Banfield <developer@dmxify.com>  
**License**: MIT  

* [electron-midi](#module_electron-midi)
    * [~echoMIDIMessage()](#module_electron-midi..echoMIDIMessage)
    * [~midiAccess()](#module_electron-midi..midiAccess) ⇒ <code>object</code>
    * [~inputs - get `Iterable` containing all `MidiInputPort` objects.()](#module_electron-midi..inputs - get `Iterable` containing all `MidiInputPort` objects.) ⇒ <code>iterable.&lt;object&gt;</code>
    * [~outputs - get `Iterable` containing all `MidiOutputPort` objects.()](#module_electron-midi..outputs - get `Iterable` containing all `MidiOutputPort` objects.) ⇒ <code>iterable.&lt;object&gt;</code>
    * [~learn - Returns a promise which temporarily overrides the default onmidimessage event handler and only resolves when onmidimessage is triggered()](#module_electron-midi..learn - Returns a promise which temporarily overrides the default onmidimessage event handler and only resolves when onmidimessage is triggered) ⇒ <code>Promise</code>
    * [~echoMIDIMessage - Echos input MidiMessage to the first Midi output device port with the same name()](#module_electron-midi..echoMIDIMessage - Echos input MidiMessage to the first Midi output device port with the same name)
    * [~send - sends `MidiMessage` to a `MidiOutputPort` with a specific `MidiOutputPortName`.()](#module_electron-midi..send - sends `MidiMessage` to a `MidiOutputPort` with a specific `MidiOutputPortName`.) ⇒ <code>undefined</code>

<a name="module_electron-midi..echoMIDIMessage"></a>

### electron-midi~echoMIDIMessage()
**Kind**: inner method of [<code>electron-midi</code>](#module_electron-midi)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| onHardwareChange | <code>function</code> | callback to execute when Midi hardware availability changes (i.e. added/removed) |
| onInputMessage | <code>function</code> | callback to execute when Midi hardware input message is received |
| onReady | <code>function</code> | callback to execute when this ElectronMidi class instance has finished initializing |

<a name="module_electron-midi..midiAccess"></a>

### electron-midi~midiAccess() ⇒ <code>object</code>
**Kind**: inner method of [<code>electron-midi</code>](#module_electron-midi)  
**Returns**: <code>object</code> - ElectronMidi class instance property value for MidiAccess  
<a name="module_electron-midi..inputs - get `Iterable` containing all `MidiInputPort` objects."></a>

### electron-midi~inputs - get `Iterable` containing all `MidiInputPort` objects.() ⇒ <code>iterable.&lt;object&gt;</code>
**Kind**: inner method of [<code>electron-midi</code>](#module_electron-midi)  
<a name="module_electron-midi..outputs - get `Iterable` containing all `MidiOutputPort` objects."></a>

### electron-midi~outputs - get `Iterable` containing all `MidiOutputPort` objects.() ⇒ <code>iterable.&lt;object&gt;</code>
**Kind**: inner method of [<code>electron-midi</code>](#module_electron-midi)  
<a name="module_electron-midi..learn - Returns a promise which temporarily overrides the default onmidimessage event handler and only resolves when onmidimessage is triggered"></a>

### electron-midi~learn - Returns a promise which temporarily overrides the default onmidimessage event handler and only resolves when onmidimessage is triggered() ⇒ <code>Promise</code>
**Kind**: inner method of [<code>electron-midi</code>](#module_electron-midi)  
**Resolve**: <code>Object</code> - The next `MidiInputMessage` triggered by a MidiInputPort, containing:- `data`: `array` containing MidiMessage `uint8Array` values- `input`: the name of the `MidiInputPort`  
<a name="module_electron-midi..echoMIDIMessage - Echos input MidiMessage to the first Midi output device port with the same name"></a>

### electron-midi~echoMIDIMessage - Echos input MidiMessage to the first Midi output device port with the same name()
**Kind**: inner method of [<code>electron-midi</code>](#module_electron-midi)  
<a name="module_electron-midi..send - sends `MidiMessage` to a `MidiOutputPort` with a specific `MidiOutputPortName`."></a>

### electron-midi~send - sends `MidiMessage` to a `MidiOutputPort` with a specific `MidiOutputPortName`.() ⇒ <code>undefined</code>
**Kind**: inner method of [<code>electron-midi</code>](#module_electron-midi)  
**Returns**: <code>undefined</code> - - Returns `undefined` if specified `MidiOutputPort` is not found.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| midiOutputPortName | <code>string</code> | Name of the MidiOutputPort to send this MidiMessage to. |
| data | <code>array</code> | array containing three ES2017 uint8Array values, making up a MidiMessage. |

