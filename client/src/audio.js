import {samples} from './constants.js';
import SamplePlayer from './SamplePlayer.js'

// helper
const map = (val, min, max, tmin, tmax) => ((val - min) / (max - min)) * (tmax - tmin) + tmin;

// 
const audioFactory = () => {
    //const audio = {};
    const sourceNodes = {};
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // registre des bufferSources actifs
    const keyboard = [];
    const settings = {
        volume:0.8,
        tone: 50,
        pitch: 0.
    }
    const resume = function resume() {
        this.ctx.resume();
    }

    // notes
    const noteOn = function noteOn(note) {
        this.keyboard[note] = new SamplePlayer(this.ctx,
            this.sourceNodes[this.instrument][note],
            this.settings);
        this.keyboard[note].on();
    }
    const noteOff = function noteOff(note) {
        if (this.keyboard[note]) {
            this.keyboard[note].off();
        }
    }

    // preset
    const setInstrument = function setInstrument(instrument) {
        this.instrument = instrument;
    }

    // audio params
    const setPitch = function setPitch(semi) {
        const pitch = map(semi, 0, 1, -2, 2);
        this.settings.pitch = pitch;
        this.keyboard.forEach( node => node.setPitch(pitch)  )
    }
    const setVolume = function setVolume(volume) {
        this.settings.volume = volume;
        this.keyboard.forEach( node => { node.setVolume(volume)} )
    }
    const setTone = function setTone(tone) {
        const frequency = map(tone, 0, 1, 50, 1000);
        this.settings.tone = frequency;
        this.keyboard.forEach( node => node.setFilter(frequency));
    }

    // populate sourceNodes with samples
    const loadSamples = function loadSamples() {
        for (let instrument in samples) {
            this.sourceNodes[instrument] = [];
            for (let i = 0; i < samples[instrument].length; i++) {
                const url = '/snd/' + instrument + '/' + encodeURIComponent(samples[instrument][i]);
                this.loadSample(url, instrument, i );
            }
        }
    }

    const loadSample = function loadSample(url, instrument, number) {
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

    return {
        sourceNodes,
        ctx,
        keyboard,
        settings,
        resume,
        noteOn,
        noteOff,
        setInstrument,
        setPitch,
        setVolume,
        setTone,
        loadSamples,
        loadSample
    }
}

export default audioFactory;