import {samples, buildURL} from './constants.js';
import SamplePlayer from './SamplePlayer.js';

/*
maybe use Chris Wilson monkey patch...
https://github.com/cwilso/AudioContext-MonkeyPatch/blob/gh-pages/AudioContextMonkeyPatch.js
*/

// helper
const map = (val, min, max, tmin, tmax) => ((val - min) / (max - min)) * (tmax - tmin) + tmin;
// 
const audioFactory = () => {
    let counter = 0;
    const totalNumberOfSamples = 210;
    const sourceNodes = {};
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // registre des bufferSources actifs
    const keyboard = [];
    let instrument;
    const settings = {
        volume:0.8,
        tone: 50,
        pitch: 0.
    }
    let loadingProgessionSubscribers = [];
    const resume = function resume() {
        ctx.resume();
    }
    // notes
    const noteOn = function noteOn(note) {
        keyboard[note] = new SamplePlayer(
            ctx,
            sourceNodes[instrument][note],
            settings
        );
        keyboard[note].on();
    }
    const noteOff = function noteOff(note) {
        if (keyboard[note]) {
            keyboard[note].off();
        }
    }
    // preset
    const setInstrument = function setInstrument(instru) {
        instrument = instru;
    }
    // audio params
    const setPitch = function setPitch(semi) {
        const pitch = map(semi, 0, 1, -2, 2);
        settings.pitch = pitch;
        keyboard.forEach( node => node.setPitch(pitch)  )
    }
    const setVolume = function setVolume(volume) {
        settings.volume = volume;
        keyboard.forEach( node => { node.setVolume(volume)} )
    }
    const setTone = function setTone(tone) {
        const frequency = map(tone, 0, 1, 50, 1000);
        settings.tone = frequency;
        keyboard.forEach( node => node.setFilter(frequency));
    }

    // populate sourceNodes with samples
    const loadSamples = function loadSamples() {
        for (let instrument in samples) {
            sourceNodes[instrument] = [];
            for (let i = 0; i < samples[instrument].length; i++) {
                const url = buildURL + 'snd/' + instrument + '/' + encodeURIComponent(samples[instrument][i]);
                loadSample(url, instrument, i );
            }
        }
    }

    const loadSample = function loadSample(url, instrument, number) {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            ctx.decodeAudioData(
                request.response,
                decodedSample => {
                    // AudioBuffer
                    sourceNodes[instrument][number] = decodedSample;
                    counter += 1;
                    publishLoadingProgression( counter/totalNumberOfSamples );
                },
                error => console.log('ERROR LOADING SAMPLE : ' + error)
            );
        }
        request.send();
    }
    const publishLoadingProgression = (val) => {
        loadingProgessionSubscribers.forEach( fn => fn(val) );
    }
    const subscribeLoadingProgression = (fn) => {
        loadingProgessionSubscribers.push(fn);
    }
    return {
        resume,
        noteOn,
        noteOff,
        setInstrument,
        setPitch,
        setVolume,
        setTone,
        loadSamples,
        loadSample,
        subscribeLoadingProgression
    }
}

export default audioFactory;