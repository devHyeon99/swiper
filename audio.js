class AudioPlayer {
  #audio = null;

  constructor(source) {
    this.#audio = document.createElement("audio");
    this.#audio.src = source;
  }

  play(startTime = 0) {
    this.#audio.currentTime = startTime;
    this.#audio.play();
  }

  seek(time) {
    this.#audio.currentTime = time;
  }

  loopPlay() {
    this.play();
    this.#audio.addEventListener("ended", this.play.bind(this));
  }

  pause() {
    this.#audio.pause();
  }

  stop() {
    this.pause();
    this.#audio.currentTime = 0;
  }

  isPlaying() {
    return !this.#audio.paused && !this.#audio.ended;
  }

  get time() {
    return this.#audio.currentTime;
  }

  set time(value) {
    this.#audio.currentTime = value;
  }

  get duration() {
    return this.#audio.duration;
  }

  addEventListener(event, callback) {
    this.#audio.addEventListener(event, callback);
  }

  removeEventListener(event, callback) {
    this.#audio.removeEventListener(event, callback);
  }
}

export default AudioPlayer;
