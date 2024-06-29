# Swiper Music Poster

```js
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
```
> 1. swiper effect 중 coverflow effect를 사용하여 Musci Poster 페이지를 구현하였습니다.
> 2. 뮤직 포스터를 클릭시 화면이 뒤집히는 효과를 추가하여 뒷면에 노래 설명이 나타납니다. ( 설명을 다 넣지는 않음 )
> 3. play 버튼을 누르면 해당 포스터의 음악이 재생이 됩니다. ( 범쌤이 Misson02에서 제공 해주신 audio.js를 활용하여 구현 )
> 4. 원하는 포스터 영역을 클릭하면 해당 포스터로 슬라이드가 되면서 포커스가 됩니다.
> 5. next, prev 버튼을 만들어 swiper에 연결하여 navigation 기능이 가능하도록 하였습니다.
