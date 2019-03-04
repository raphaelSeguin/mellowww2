class SamplePlayer {
    constructor(context, buffer, settings) {
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
    }
    on() {
        this.player = this.ctx.createBufferSource();
        this.player.buffer = this.buffer;
        this.player.playbackRate.value = Math.pow(2, this.pitch/12);
        this.player.connect(this.filter);
        this.filter.connect(this.vca);
        this.vca.connect(this.ctx.destination);
        this.player.start();
        this.vca.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.01);
    }
    off() {
        this.vca.gain.setTargetAtTime(0., this.ctx.currentTime, 0.01);
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
}

export default SamplePlayer;