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
        this.player = this.ctx.createBufferSource();
        this.player.buffer = buffer;
        this.player.playbackRate.value = Math.pow(2, this.pitch/12);

        this.vca = this.ctx.createGain();
        this.vca.gain.value = 0.;

        this.filter = this.ctx.createBiquadFilter();
        this.filter.frequency.value =  this.tone;
        this.filter.type = 'highpass';
        //

        this.player.connect(this.filter);
        this.filter.connect(this.vca);
        this.vca.connect(this.ctx.destination);
        //
    }
    on() {
        this.player.start();
        this.vca.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.05);
    }
    off() {
        this.vca.gain.exponentialRampToValueAtTime(0.0000000000001, this.ctx.currentTime + 0.1);
        setTimeout(this.player.stop.bind(this.player), 100);
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
    enveloppe(a, d, s, r) {

    }
}

export default SamplePlayer;