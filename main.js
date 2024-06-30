import Swiper from "swiper/bundle";
import AudioPlayer from "./audio.js";
import data from "./data.js";
import "swiper/css/bundle";

const swiper = new Swiper(".swiper", {
  effect: "coverflow",
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 5,
    stretch: 0,
    depth: 250,
    modifier: 0.5,
    slideShadows: true,
  },
  loop: true,
  mousewheel: {
    enabled: true,
  },
});

const swiperWrapper = document.querySelector(".swiper-wrapper");
let currentAudioPlayer = null;
let currentAudioName = null;
let slidePlayStates = {};
let isDragging = false;

const flipCard = (card, flipDuration) => {
  card.classList.add("card-flip");
  setTimeout(() => {
    card.classList.remove("card-flip");
  }, flipDuration);
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const updateProgressBar = (progressBar, timeDisplay) => {
  if (!currentAudioPlayer) return;

  currentAudioPlayer.addEventListener("timeupdate", () => {
    if (!isDragging) {
      const currentTime = currentAudioPlayer.time;
      const duration = currentAudioPlayer.duration;

      if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(
          duration
        )}`;
      }
    }
  });
};

const resetUI = (index) => {
  const slide = document.querySelector(`.swiper-slide[data-index="${index}"]`);
  if (!slide) return;

  const progressBar = slide.querySelector(".bar");
  const timeDisplay = slide.querySelector(".time-display");
  const button = slide.querySelector(".play-btn");

  // progressBar 초기화
  progressBar.style.width = "0%";
  // timeDisplay 초기화
  timeDisplay.textContent = "0:00 / 0:00";
  // 버튼 초기화
  button.setAttribute("name", "play-circle-outline");
};

const playAudio = (button, index) => {
  const audioName = data[index].name;

  // 이전 오디오와 현재 재생하려는 오디오가 다를 경우
  if (currentAudioName !== audioName) {
    // 이전 오디오 정지 및 새 오디오 재생을 위해 stop() 메서드 호출
    if (currentAudioPlayer) {
      currentAudioPlayer.stop();

      // 이전 슬라이드의 재생 상태 업데이트
      // 0번째를 재생중에 1번째를 재생시작 했으면 아직 0번째가 true로 되어 있음.
      // 그 값을 찾아서 key를 찾아내고 false로 처리 후 끝나면 새로운 상태와 오디오 생성
      const prevIndex = Object.keys(slidePlayStates).find(
        (key) => slidePlayStates[key]
      );

      if (prevIndex) {
        resetUI(prevIndex); // 이전 뮤직 플레이어 progress, time, button 초기화
        slidePlayStates[prevIndex] = false;
      }
    }

    // 새로운 AudioPlayer 인스턴스 생성 및 재생
    currentAudioPlayer = new AudioPlayer(`./assets/audio/${audioName}.mp3`);
    currentAudioPlayer.play();
    button.setAttribute("name", "pause-circle-outline");
    currentAudioName = audioName;

    // 현재 슬라이드의 재생 상태 업데이트
    slidePlayStates[index] = true;
    return;
  }

  // 현재 오디오가 재생 중인 경우
  if (currentAudioPlayer && currentAudioPlayer.isPlaying()) {
    currentAudioPlayer.pause();
    button.setAttribute("name", "play-circle-outline");
    slidePlayStates[index] = false;
    return;
  }

  // 일시정지 중이라면 이전 위치에서 재생을 다시 시작
  if (currentAudioPlayer && !currentAudioPlayer.isPlaying()) {
    currentAudioPlayer.play(currentAudioPlayer.time);
    button.setAttribute("name", "pause-circle-outline");
    slidePlayStates[index] = true;
    return;
  }

  // 새로운 AudioPlayer 인스턴스를 생성하여 재생
  currentAudioPlayer = new AudioPlayer(`./assets/audio/${audioName}.mp3`);
  currentAudioPlayer.play();
  button.setAttribute("name", "pause-circle-outline");
  currentAudioName = audioName;

  // 현재 슬라이드의 재생 상태 업데이트
  slidePlayStates[index] = true;
};

const handleClick = (event) => {
  const slide = event.target.closest(".swiper-slide");
  const progressBar = slide.querySelector(".bar");
  const timeDisplay = slide.querySelector(".time-display");
  const prev = slide.querySelector(".prev");
  const button = slide.querySelector(".play-btn");
  const next = slide.querySelector(".next");
  const card = slide.querySelector(".card");
  const img = slide.querySelector(".card-front img");
  const flipDuration = 1000;

  if (!slide) return;

  const index = Number(slide.dataset.index);
  swiper.slideToLoop(index); // 선택한 슬라이드로 이동

  if (event.target === img) {
    flipCard(card, flipDuration);
  }

  if (event.target === prev) {
    if (index === 0) {
      swiper.slideToLoop(data.length - 1);
    }
    swiper.slideToLoop(index - 1);
  }

  if (event.target === next) {
    if (index === data.length - 1) {
      swiper.slideToLoop(0);
    }
    swiper.slideToLoop(index + 1);
  }

  if (event.target === button) {
    playAudio(button, index);
    updateProgressBar(progressBar, timeDisplay);
  }
};

swiperWrapper.addEventListener("click", handleClick);
