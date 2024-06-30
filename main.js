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
let currentSlideIndex = null;
let slidePlayStates = {};
let isDragging = false;

// 카드 뒤집기 함수
const flipCard = (card, flipDuration) => {
  card.classList.add("card-flip");
  setTimeout(() => {
    card.classList.remove("card-flip");
  }, flipDuration);
};

// 음악 재생 시간 설정
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

// 음악 재생 프로그레스바, 시간 업데이트 함수
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

// 음악 플레이어 UI 초기화 함수
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

// 음악 싱크 조정 핸들러
const handleSeekAudio = (event, progress, progressBar, timeDisplay) => {
  const slide = event.target.closest(".swiper-slide");
  const slideIndex = Number(slide.dataset.index);

  // 현재 재생 중인 슬라이드와 클릭한 슬라이드가 동일한지 확인
  if (!currentAudioPlayer || slideIndex !== currentSlideIndex) return;

  const rect = progress.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const width = rect.width;
  const seekTime = (offsetX / width) * currentAudioPlayer.duration;

  currentAudioPlayer.seek(seekTime);
  updateProgressBar(progressBar, timeDisplay);
};

// 음악 재생 끝나고 이벤트 처리 핸들러
const handleEndAudio = (button, index) => {
  const nextIndex = (index + 1) % data.length;
  const newslide = document.querySelector(
    `.swiper-slide[data-index="${nextIndex}"]`
  );
  const Button = newslide.querySelector(".play-btn");
  const progressBar = newslide.querySelector(".bar");
  const timeDisplay = newslide.querySelector(".time-display");

  button.setAttribute("name", "play-circle-outline");
  swiper.slideToLoop(nextIndex);

  playAudio(Button, nextIndex);
  updateProgressBar(progressBar, timeDisplay);
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

    // audio 재생이 끝났을 때 이벤트 처리
    currentAudioPlayer.addEventListener("ended", () =>
      handleEndAudio(button, index)
    );

    currentAudioPlayer.play();
    button.setAttribute("name", "pause-circle-outline");

    // 현재 슬라이드의 재생 상태 업데이트
    slidePlayStates[index] = true;
    currentAudioName = audioName;
    currentSlideIndex = index;
    return;
  }

  // 현재 오디오가 재생 중인 경우
  if (currentAudioPlayer && currentAudioPlayer.isPlaying()) {
    currentAudioPlayer.pause();
    button.setAttribute("name", "play-circle-outline");
    return;
  }

  // 일시정지 중이라면 이전 위치에서 재생을 다시 시작
  if (currentAudioPlayer && !currentAudioPlayer.isPlaying()) {
    currentAudioPlayer.play(currentAudioPlayer.time);
    button.setAttribute("name", "pause-circle-outline");
    slidePlayStates[index] = true;
    return;
  }
};

const handleClick = (event) => {
  const slide = event.target.closest(".swiper-slide");
  const progress = slide.querySelector(".progress");
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
      if (currentAudioPlayer) handleEndAudio(button, data.length - 2);
      return;
    }
    swiper.slideToLoop(index - 1);
    if (currentAudioPlayer) handleEndAudio(button, index - 2);
  }

  if (event.target === next) {
    if (index === data.length - 1) {
      swiper.slideToLoop(0);
      if (currentAudioPlayer) handleEndAudio(button, -1);
      return;
    }
    swiper.slideToLoop(index + 1);
    if (currentAudioPlayer) handleEndAudio(button, index);
  }

  if (event.target === button) {
    playAudio(button, index);
    updateProgressBar(progressBar, timeDisplay);
  }

  if (event.target === progress) {
    handleSeekAudio(event, progress, progressBar, timeDisplay);
  }
};

swiperWrapper.addEventListener("click", handleClick);
