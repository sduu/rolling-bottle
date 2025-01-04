import { gsap } from 'gsap';

const canvasWrap = document.querySelector('#scene-content');
const canvas = canvasWrap.querySelector('canvas');
const footer = document.querySelector('.footer');
const ctx = canvas.getContext('2d');

let footerTop = footer.offsetTop - window.innerHeight;

export const initCanvas = (getScrollTopFn, isMobile) => {
  const sceneClip = new Image();
  const sceneNum = 299;
  const sceneArray = [];
  let scenePos = { x: 0 };
  let sceneSize;
  let sceneEl;
  let currentScene;
  let progress;
  let frame;
  let resizeTimer;

  sceneClip.src = './assets/images/frame/A_00000_alpha.png';

  for (let i = 0; i <= sceneNum; i++) {
    let index = i + '';
    sceneEl = new Image();
    sceneEl.src = `./assets/images/frame/A_${index.padStart(5, '0')}.webp`;
    sceneArray.push(sceneEl);
  }

  resize();
  update();

  window.addEventListener('resize', function () {
    resize();
  });

  [scenePos, '.scene-content-btn'].forEach(item => {
    gsap.fromTo(
      item,
      { x: () => 0.35 * canvas.offsetWidth },
      {
        x: 0,
        scrollTrigger: {
          trigger: '.header',
          start: 'top top',
          endTrigger: '.main-section-2',
          end: 'top top',
          scrub: true,
          // markers: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  function drawScene() {
    ctx.save();
    ctx.drawImage(
      sceneClip,
      canvas.width / 2 - sceneSize / 2 + scenePos.x,
      canvas.height / 2 - sceneSize / 2,
      sceneSize,
      sceneSize
    );
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(
      sceneArray[currentScene],
      canvas.width / 2 - sceneSize / 2 + scenePos.x,
      canvas.height / 2 - sceneSize / 2,
      sceneSize,
      sceneSize
    );

    ctx.restore();
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    progress = Math.min(getScrollTopFn() / (footerTop / 4), 4) || 0;
    progress = progress - Math.trunc(progress);
    currentScene = Math.round(sceneNum * progress);

    drawScene();

    frame = requestAnimationFrame(update);
  }

  function resize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cancelAnimationFrame(frame);

      if (isMobile) return;

      footerTop = document.querySelector('.footer').offsetTop - window.innerHeight;
      const scrollTop = getScrollTopFn();
      const posTop = scrollTop > footerTop ? footerTop : scrollTop;

      canvas.width = canvasWrap.offsetWidth;
      canvas.height = canvasWrap.offsetHeight;

      sceneSize = (580 / 1280) * canvas.offsetWidth;

      canvasWrap.style.top = posTop + 'px';

      update();
    }, 300);
  }
};
