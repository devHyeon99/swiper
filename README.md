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
> 5. 재생중인 음악이 끝나면 다음곡이 재생 됩니다.
> 6. 곡을 한번이라도 재생 하였으면 prev, next 버튼을 통해 곡을 넘기면서 재생 가능 합니다.
> 7. progress 선택을 통해 노래 시간 조정이 가능 합니다.
> 8. 마우스 휠, 그랩 으로 포스터 이동이 가능 합니다.
