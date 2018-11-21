import {samples} from './constants.js';
import SamplePlayer from './SamplePlayer.js'

// helper
const map = (val, min, max, tmin, tmax) => ((val - min) / (max - min)) * (tmax - tmin) + tmin;

const audio = {}

audio.sourceNodes = {};

audio.ctx = new (window.AudioContext || window.webkitAudioContext)();

// registre des bufferSources actifs
audio.keyboard = [];
audio.settings = {
    volume:0.8,
    tone: 50, //
    pitch: 0. // attention sur l'interface 0.5 équivaut à 0...
}

audio.resume = function() {
    this.ctx.resume();
}

// notes
audio.noteOn = function(note) {
    this.keyboard[note] = new SamplePlayer(this.ctx,
        this.sourceNodes[this.instrument][note],
        this.settings);
    this.keyboard[note].on();
}
audio.noteOff = function(note) {
    if (this.keyboard[note]) {
        this.keyboard[note].off();
    }
}

// preset
audio.setInstrument = function(instrument) {
    this.instrument = instrument;
}

// audio params
audio.setPitch = function(semi) {
    const pitch = map(semi, 0, 1, -2, 2);
    this.settings.pitch = pitch;
    this.keyboard.forEach( node => node.setPitch(pitch)  )
}
audio.setVolume = function(volume) {
    this.settings.volume = volume;
    this.keyboard.forEach( node => { node.setVolume(volume)} )
}
audio.setTone = function(tone) {
    const frequency = map(tone, 0, 1, 50, 1000);
    this.settings.tone = frequency;
    this.keyboard.forEach( node => node.setFilter(frequency));
}


// populate sourceNodes with samples
audio.loadSamples = function() {
    for (let instrument in samples) {
        this.sourceNodes[instrument] = [];
        for (let i = 0; i < samples[instrument].length; i++) {
            const url = '/snd/' + instrument + '/' + encodeURIComponent(samples[instrument][i]);
            this.loadSample(url, instrument, i );
        }
    }
}

audio.loadSample = function(url, instrument, number) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
        this.ctx.decodeAudioData(
            request.response,
            decodedSample => {
                // AudioBuffer
                this.sourceNodes[instrument][number] = decodedSample;
            },
            error => console.log('ERROR LOADING SAMPLE : ' + error)
        );
    }
    request.send();
}

export default audio;