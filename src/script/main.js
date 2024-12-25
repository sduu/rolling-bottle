import { enterBtnShop, leaveBtnShop } from './components/buttonAnimations';
import { animateLogo } from './components/logoAnimations';
import { Marquee } from './components/marquee';
import MouseCursor from './components/mouseCursor';
import { initCanvas } from './components/rollingBottle';
import { initScrollListener, getScrollTop } from './utils/scrollUtil';

const scrollContent = document.querySelector('#scroll-content');
const cursorContent = document.querySelector('#cursor-content');
const canvasWrap = document.querySelector('#scene-content');
const footer = document.querySelector('.footer');
const footerShopIcon = document.querySelector('.footer .btn-shop i');
const headerLogo = document.querySelector('.header .logo');
const footerLogo = document.querySelector('.footer .logo');

let isMobile, stickyStep, stickyNum, footerTop;

const smoothScroll = initScrollListener(scrollContent, scrollTop => {
  ScrollTrigger.update();

  cursorContent.style.top = `${scrollTop}px`;
  if (!isMobile) {
    if (scrollTop < footerTop) {
      canvasWrap.style.top = `${scrollTop}px`;
    }
  }
});

gsap.registerPlugin(ScrollTrigger, TextPlugin);
ScrollTrigger.defaults({ scroller: scrollContent });
ScrollTrigger.scrollerProxy(scrollContent, {
  scrollTop(value) {
    if (arguments.length) smoothScroll.scrollTop = value;
    return smoothScroll.scrollTop;
  },
});

ScrollTrigger.matchMedia({
  '(max-width: 767px)': () => {
    isMobile = true;
  },
  '(min-width: 768px)': () => {
    isMobile = false;
  },
});

const marquee = new Marquee(document.querySelector('.section-marquee'), {
  duration: 30,
  repeat: -1,
  ease: 'none',
});

const cursorManager = new MouseCursor('#cursor-content');
cursorManager.init();

/* Sticky 섹션 애니메이션 */
const detailTxt1 = [
  [
    '01. Vivamus elementum semper nisi',
    '02. Aenean vulputate eleifend tellus',
    '03. porttitor eu, consequat vitae',
    '04. Aliquam lorem ante',
  ],
  [
    '01. Aenean imperdiet.',
    '02. Etiam ultricies nisi vel augue',
    '03. Curabitur ullamcorper ultricies nisi',
    '04. Nam eget dui',
  ],
  ['01. elementum semper nisi', '02. Curabitur ullamcorper', '03. Aliquam lorem', '04. Etiam ultricies nisi vel augue'],
];
const detailTxt2 = [
  'Lorem ipsum dolor sit amet, consectetuer',
  'consectetuer adipiscing elit. Aenean',
  'Cum sociis natoque penatibus et magnis dis',
];

stickyNum = 3;
gsap
  .timeline({
    scrollTrigger: {
      trigger: '.section-sticky',
      start: '0',
      end: `${stickyNum * 200}%`,
      pin: true,
      scrub: true,
      onUpdate: ({ progress, direction, vars, isActive }) => {
        if (stickyStep !== Math.trunc(progress * stickyNum)) {
          stickyStep = Math.trunc(progress * stickyNum);
          stickyStep === stickyNum ? null : animateSticky(stickyStep);
        }
      },
    },
  })
  .fromTo(
    '.section-sticky .deco-item',
    { opacity: 0, scale: 0 },
    { duration: 1, stagger: 0.2, opacity: 1, scale: 1, rotate: 30 },
    '<'
  )
  .to('.section-sticky .deco-item', { duration: 1, stagger: 0.2, opacity: 0, scale: 1.5, rotate: 60 })
  .repeat(2);

function animateSticky(step = 0) {
  const detailText = detailTxt1[step];
  gsap.utils.toArray('.section-sticky .detail li').forEach((item, i) => {
    gsap.to(item, { text: { value: detailText[i], padSpace: true } });
  });
  gsap.to('.section-sticky .detail p', { text: { value: detailTxt2[step], padSpace: true } });

  document.querySelectorAll('.section-sticky text').forEach((item, index) => {
    if (index === step) {
      item.classList.add('is-active');
    } else {
      item.classList.remove('is-active');
    }
  });

  document.querySelector('.section-sticky').classList = `section-sticky is-step-${step}`;

  if (step === 0) {
    gsap.to('body', {
      'background-color': '#5c79e5',
      'background-image': 'linear-gradient(315.01deg, #78abcf 8.31%, #5c79e5 88.22%)',
    });
  } else if (step === 1) {
    gsap.to('body', {
      'background-color': '#6f00ff',
      'background-image': 'linear-gradient(155.92deg, #929dff 5.36%, #3f52ff 85.08%)',
    });
    document.body.classList = 'theme-light';
  } else if (step === 2) {
    gsap.to('body', {
      'background-color': '#fff',
      'background-image':
        'linear-gradient(154.45deg, rgba(0, 26, 255, 0.39) -60.92%, rgba(0, 26, 255, 0) 34.15%, rgba(0, 26, 255, 0.39) 108.43%)',
    });
    document.body.classList = 'theme-dark';
  }
  marquee.pause();
}

/* main-section-4 스크롤 이벤트 */
ScrollTrigger.create({
  trigger: '.main-section-4',
  start: 'top center',
  endTrigger: '.footer',
  end: '30% 100%',
  onEnter: () => animateSection4(),
  onEnterBack: () => animateSection4(),
});
function animateSection4() {
  gsap.to('body', { 'background-color': '#ceebeb', 'background-image': 'none' });
  document.body.classList = 'theme-dark';
  marquee.play();
}

/* 푸터 스크롤 이벤트 */
ScrollTrigger.create({
  trigger: '.footer',
  start: '30% 100%',
  onEnter: () => animateFooter(),
  onEnterBack: () => animateFooter(),
});
function animateFooter() {
  gsap.to('body', {
    'background-color': '#5c79e5',
    'background-image': 'linear-gradient(315deg, #78abcf 8.31%, #5c79e5 88.22%);',
  });
  document.body.classList = 'theme-light';
}

/* 이벤트 초기화 */
document.addEventListener('DOMContentLoaded', () => {});
window.addEventListener('load', () => {
  initCanvas(getScrollTop, isMobile);
  footerTop = footer.offsetTop - window.innerHeight;
});
footerShopIcon.addEventListener('mouseenter', enterBtnShop);
footerShopIcon.addEventListener('mouseleave', leaveBtnShop);
headerLogo.addEventListener('mouseenter', animateLogo);
footerLogo.addEventListener('mouseenter', animateLogo);
