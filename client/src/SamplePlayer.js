class SamplePlayer {
    constructor(context, buffer, settings) {
        // samplePlayer object 
        // create a sourceNode
        // connect to filter and gain nodes
        // connect to destination
        // register it in audio.keyboard
        // methods for filter enveloppe and releases
        this.volume = settings.volume;
        this.pitch = settings.pitch;
        this.tone = settings.tone;

        this.ctx = context;
        this.buffer = buffer;
        
        this.vca = this.ctx.createGain();
        this.vca.gain.value = 0.;

        this.filter = this.ctx.createBiquadFilter();
        this.filter.frequency.value =  this.tone;
        this.filter.type = 'highpass';
        //
        //
    }
    on() {
        this.player = this.ctx.createBufferSource();
        this.player.buffer = this.buffer;
        this.player.playbackRate.value = Math.pow(2, this.pitch/12);
        this.player.connect(this.filter);
        this.filter.connect(this.vca);
        this.vca.connect(this.ctx.destination);
        this.player.start();
        this.vca.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.005);
    }
    off() {
        this.vca.gain.linearRampToValueAtTime(0., this.ctx.currentTime + 0.05);
        setTimeout(this.player.stop.bind(this.player), 150);
    }
    setVolume(val) {
        this.volume = val;
    }
    setPitch(semi) {
        this.pitch = semi;
        this.player.playbackRate.exponentialRampToValueAtTime(Math.pow(2, this.pitch/12),this.ctx.currentTime + 0.05 );
    }
    setFilter(freq) {
        this.filter.frequency.linearRampToValueAtTime(this.tone, this.ctx.currentTime + 0.05);
    }
    // enveloppe(a, d, s, r) {

    // }
}

export default SamplePlayer;


// recréer le graph à chaque noteOn !!! 
// createBufferSource 
// buffer
// filter
// vca
// destination