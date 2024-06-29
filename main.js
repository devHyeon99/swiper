import Swiper from "swiper/bundle";
import AudioPlayer from "./audio.js";
import data from "./data.js";
import "swiper/css/bundle";

const swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
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
  navigation: {
    nextEl: ".next",
    prevEl: ".prev",
  },
});

const swiperWrapper = document.querySelector(".swiper-wrapper");
let currentAudioPlayer = null;

const handleClick = (event) => {
  const slide = event.target.closest(".swiper-slide");
  if (!slide) return;

  const index = slide.dataset.index;
  swiper.slideToLoop(index);

  const card = slide.querySelector(".card");
  const img = slide.querySelector(".card-front img");
  const flipDuration = 1000;

  if (event.target === img) {
    card.classList.add("card-flip");

    setTimeout(() => {
      card.classList.remove("card-flip");
    }, flipDuration);
  }

  const button = slide.querySelector(".play-btn");

  if (event.target === button) {
    const audioName = data[index].name;

    if (currentAudioPlayer) {
      currentAudioPlayer.stop();
    }

    currentAudioPlayer = new AudioPlayer(`./assets/audio/${audioName}.mp3`);
    currentAudioPlayer.play();
  }
};

swiperWrapper.addEventListener("click", handleClick);
