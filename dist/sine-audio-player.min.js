{
  class SipnePlayer extends HTMLElement {
    playing = false;
    volume = 100;
    prevVolume = 0.50;
    initialized = false;
    bufferPercentage = 50;
    nonAudioAttributes = new Set(['buffer-percentage']);
    
    constructor() {
      super();
      
      this.attachShadow({mode: 'open'});
      this.display();
    }
    
    static get observedAttributes() {
      return [
        'src', 'muted', 'loop', 'preload', 'autoplay','buffer-percentage'
      ];
    }
    
    async attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case 'src':
          this.initialized = false;
          this.display();
          this.initializeAudio();
          break;
        case 'muted':
          this.toggleMute(Boolean(this.audio?.getAttribute('muted')));
          break;
        case 'buffer-percentage':
          this.bufferPercentage = Number(newValue) || 75;
          break;
        default:
      }
      
      this.updateAudioAttributes(name, newValue);
    }
    
    updateAudioAttributes(name, value) {
      if (!this.audio || this.nonAudioAttributes.has(name)) return;
      if (this.attributes.getNamedItem(name)) {
        this.audio.setAttribute(name, value ?? '')
      } else {
        this.audio.removeAttribute(name);
      }
    }
    
    initializeAudio() {
      if (this.initialized) return;
      
      this.initialized = true;
      
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioCtx.createGain();
      this.analyserNode = this.audioCtx.createAnalyser();
      this.track = this.audioCtx.createMediaElementSource(this.audio);
      this.audio.crossOrigin = 'anonymous';
      
      this.analyserNode.fftSize = 2048;
      this.bufferLength = this.analyserNode.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      this.analyserNode.getByteFrequencyData(this.dataArray);
      
      this.track
        .connect(this.gainNode)
        .connect(this.analyserNode)
        .connect(this.audioCtx.destination);
      
      this.changeVolume();
    }
    
    attachEvents() {
      this.volumeBar.parentNode.addEventListener('click', e => {
        if (e.target === this.volumeBar.parentNode) {
          this.toggleMute();
        }
      }, false);
      
      this.playPauseBtn.addEventListener('click', this.togglePlay.bind(this), false);
      
      this.volumeBar.addEventListener('input', this.changeVolume.bind(this), false);
      
      this.progressBar.addEventListener('input', (e) => this.seekTo(this.progressBar.value), false);
      
      this.audio.addEventListener('loadedmetadata', () => {
        this.progressBar.max = this.audio.duration;
        this.durationEl.textContent = this.getTimeString(this.audio.duration);
        this.updateAudioTime();
      })
      
      this.audio.addEventListener('error', (e) => {
        this.playPauseBtn.disabled = true;
      })
      
      this.audio.addEventListener('timeupdate', () => {
        this.updateAudioTime(this.audio.currentTime);
      })
      
      this.audio.addEventListener('ended', () => {
        this.playing = false;
        this.playPauseBtn.textContent = 'play';
        this.playPauseBtn.classList.remove('playing');
      }, false);
      
      this.audio.addEventListener('pause', () => {
        this.playing = false;
        this.playPauseBtn.textContent = 'play';
        this.playPauseBtn.classList.remove('playing');
      }, false);
      
      this.audio.addEventListener('play', () => {
        this.playing = true;
        this.playPauseBtn.textContent = 'pause';
        this.playPauseBtn.classList.add('playing');
        this.updateFrequency();
      }, false);
    }
    
    async togglePlay() {
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }
      
      if (this.playing) {
        return this.audio.pause();
      }
      
      return this.audio.play();
    }
    
    getTimeString(time) {
      const secs = `${parseInt(`${time % 60}`, 10)}`.padStart(2, '0');
      const min = parseInt(`${(time / 60) % 60}`, 10);
  
      return `${min}:${secs}`;
    }
    
    changeVolume() {
      this.volume = Number(this.volumeBar.value);
      
      if (Number(this.volume) > 1) {
        this.volumeBar.parentNode.className = 'volume-bar over';
      } else if (Number(this.volume) > 0) {
        this.volumeBar.parentNode.className = 'volume-bar half';
      } else {
        this.volumeBar.parentNode.className = 'volume-bar';
      }
      
      if (this.gainNode) {
        this.gainNode.gain.value = this.volume;
      }
    }
    
    toggleMute(muted = null) {
      this.volumeBar.value = muted || this.volume === 0 ? this.prevVolume : 0;
      this.changeVolume();
    }
    
    seekTo(value) {
      this.audio.currentTime = value;
    }
    
    updateAudioTime() {
      this.progressBar.value = this.audio.currentTime;
      this.currentTimeEl.textContent = this.getTimeString(this.audio.currentTime);
    }

    style() {
      return `
      <style>     
      .audio-player {
        background: #fff;
        width: 400px;
        min-width: 300px;
        height: 46px;
        color: #000;
        justify-content: space-between;
        user-select: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        margin: 0 0 25px;
        border: solid 2px black;
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.07);
      }
      
      .play-btn {
          width: 30px;
          min-width: 30px;
          height: 30px;
          background: #fff;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 18 24'%3E%5Cn %3Cpath fill='%23007db5' fill-rule='evenodd' d='M18 12L0 24V0' class='play-pause-btn__icon'/%3E%3C/svg%3E");
          appearance: none;
          border: none;
          margin-left: 10px;
          text-indent: -999999px;
          overflow: hidden;
      }
      
      .play-btn.playing {
        background: #fff;
        background-image: url("data:image/svg+xml,%3Csvg version='1.1' fill='%23007db5' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 365 365' style='enable-background:new 0 0 365 365%3B' xml:space='preserve'%3E%3Cg%3E%3Crect x='74.5' width='100' height='365'/%3E%3Crect x='217.5' width='100' height='365'/%3E%3C/g%3E%3C/svg%3E ");
      }
      
      .volume-bar {
          width: 30px;
          min-width: 30px;
          height: 30px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' fill='currentColor' class='bi bi-volume-mute-fill' viewBox='0 0 16 16'%3E%3Cpath fill='%23007db5' d='M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E");
          position: relative;
          margin-right: 10px;
      }
      
      .volume-bar.half {
          width: 30px;
          min-width: 30px;
          height: 30px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' fill='currentColor' class='bi bi-volume-up-fill' viewBox='0 0 16 16'%3E%3Cpath fill='%23007db5' d='M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z'/%3E%3Cpath fill='%23007db5' d='M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z'/%3E%3C/svg%3E");
      }
      .volume-bar.over {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' fill='currentColor' class='bi bi-volume-up-fill' viewBox='0 0 16 16'%3E%3Cpath fill='%23007db5' d='M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z'/%3E%3Cpath fill='%23007db5' d='M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z'/%3E%3Cpath fill='%23007db5' d='M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z'/%3E%3C/svg%3E");
      }
      
      .volume-field {
          display: none;
          position: absolute;
          appearance: none;
          height: 6px;
          right: 100%;
          top: 50%;
          transform: translateY(-50%) rotate(180deg);
          z-index: 5;
          margin: 0;
          border: solid 1px black;
          border-radius: 2px;
          background: #ffffff;
      }
      
      .volume-field::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 10px;
          background: #007db5;
      }
      
      .volume-field::-moz-range-thumb {
          appearance: none;
          height: 20px;
          width: 10px;
          background: #007db5;
      }
      
      .volume-field::-ms-thumb  {
          appearance: none;
          height: 20px;
          width: 10px;
          background: #007db5;
      }
      
      .volume-bar:hover .volume-field {
          display: block;
      }
      
      .progress-indicator {
          display: flex;
          background: #B0B0B0;
          justify-content: flex-end;
          position: relative;
          flex: 1;
          font-size: 12px;
          align-items: center;
          height: 10px;
      }
      
      .progress-bar {
          flex: 1;
          position: absolute;
          top: 50%;
          left: 0;
          z-index: 2;
          transform: translateY(-50%);
          width: 100%;
          appearance: none;
          margin: 0;
          overflow: hidden;
          background: none;
      }
      
      .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
      }
      
      .progress-bar:focus {
          outline: none;
      }
        
      .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 10px;
          width: 10px;
          background: #222;
          cursor: pointer;
      }
        
      .progress-bar::-moz-range-thumb {
          height: 10px;
          width: 10px;
          background: #222;
          cursor: pointer;
      }
        
      .progress-bar::-webkit-slider-runnable-track {
        width: 100%;
        height: 10px;
        cursor: pointer;
        background: #B0B0B0;
      }
      
      .progress-bar:focus::-webkit-slider-runnable-track {
        background: #B0B0B0;
      }
      
      .progress-bar::-moz-range-track {
        width: 100%;
        height: 10px;
        cursor: pointer;
        background: #B0B0B0;
      }
      
      .duration,
      .current-time {
          font-family: "Roboto", sans-serif;
          line-height: 18px;
          color: #55606e;
          font-size: 15px;
          line-height: 18px;
          position: relative;
          z-index: 5;
          margin-left: 5px;
          margin-right: 5px;
      }
      
      .duration::before {
          content: '';
          display: inline-block;
          margin-right: 2px;
      }
      
      canvas {
          display:none;
      }
      </style>
      `
    }
    
    display() {
      this.shadowRoot.innerHTML = `
       ${this.style()}
        <figure class="audio-player">
          <audio style="display: none"></audio>
          <button class="play-btn" type="button">Play</button>
          <span class="current-time">0:0</span>
          <div class="progress-indicator">
              <input type="range" max="100" value="0" class="progress-bar">
          </div>
          <span class="duration">0:00</span>
          <div class="volume-bar">
              <input type="range" min="0" max="2" step="0.01" value="${this.volume}" class="volume-field">
          </div>
        </figure>
      `;
      
      this.audio = this.shadowRoot.querySelector('audio');
      this.playPauseBtn = this.shadowRoot.querySelector('.play-btn');
      this.volumeBar = this.shadowRoot.querySelector('.volume-field');
      this.currentTimeEl = this.shadowRoot.querySelector('.current-time');
      this.progressBar = this.shadowRoot.querySelector('.progress-bar');
      this.durationEl = this.shadowRoot.querySelector('.duration');
      const scale = window.devicePixelRatio;
      this.volumeBar.value = this.volume;
      for (let i = 0; i < this.attributes.length; i++) {
        const attr = this.attributes[i];
        this.updateAudioAttributes(attr.name, attr.value);
      }
      
      this.attachEvents();
    }
  }
  customElements.define('sine-player', SipnePlayer);
}