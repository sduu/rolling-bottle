(function () {
  const scrollContent = document.querySelector('#scroll-content');
  const cursorContent = document.querySelector('#cursor-content');
  const canvasWrap = document.querySelector('#scene-content');
  const footer = document.querySelector('.footer');
  const footerShopIcon = document.querySelector('.footer .btn-shop i');
  const headerLogo = document.querySelector('.header .logo');
  const footerLogo = document.querySelector('.footer .logo');

  let footerTop = footer.offsetTop - window.innerHeight;
  let isMobile, scrollTop, bodyOffsetHeight, stickyStep;

  /* 스크롤 바 및 플러그인 초기화 */
  const ScrollbarPlugin = window.Scrollbar.ScrollbarPlugin;
  class DisableScrollPlugin extends ScrollbarPlugin {
    static pluginName = 'disableScroll';
    static defaultOptions = {direction: ''};

    transformDelta(delta) {
      if (this.options.direction) delta[this.options.direction] = 0;
      return {...delta};
    }
  }
  Scrollbar.use(DisableScrollPlugin);

  const smoothScroll = window.Scrollbar.init(scrollContent, {
    thumbMinSize: 10,
    speed: 2,
    plugins: {disableScroll: {direction: 'x'}},
  });
  document.querySelector('.scrollbar-track-x').remove();

  /* 스크롤 이벤트 리스너 */
  smoothScroll.addListener(({offset, limit}) => {
    scrollTop = offset.y;
    bodyOffsetHeight = limit.y;
    ScrollTrigger.update();

    cursorContent.style.top = `${scrollTop}px`;
    if (!isMobile && scrollTop < footerTop) {
      canvasWrap.style.top = `${scrollTop}px`;
    }
  });

  /* ScrollTrigger 설정 */
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
  ScrollTrigger.defaults({scroller: scrollContent});
  ScrollTrigger.scrollerProxy(scrollContent, {
    scrollTop(value) {
      if (arguments.length) smoothScroll.scrollTop = value;
      return smoothScroll.scrollTop;
    },
  });

  /* 미디어 쿼리 설정 */
  ScrollTrigger.matchMedia({
    '(max-width: 767px)': () => {
      isMobile = true;
    },
    '(min-width: 768px)': () => {
      isMobile = false;
    },
  });

  /* Marquee 클래스 */
  class Marquee {
    constructor(wrapper, options) {
      this.targets = wrapper.querySelectorAll('.section-marquee-inner');
      this.options = options;
      this.timeline = gsap.timeline();
      this.init();
    }

    init() {
      this.targets.forEach(target => {
        const direction = target.getAttribute('data-marquee') === 'left' ? -1 : 1;
        const offsetWidth = target.querySelector('p').offsetWidth;
        target.appendChild(target.querySelector('p').cloneNode(true));

        this.timeline.fromTo(
          target,
          {x: direction === -1 ? 0 : -offsetWidth},
          {
            ...this.options,
            x: direction === -1 ? -offsetWidth : 0,
          },
          '<',
        );
      });
      this.timeline.pause();
    }

    play() {
      this.timeline.play();
    }
    pause() {
      this.timeline.pause();
    }
  }

  const marquee = new Marquee(document.querySelector('.section-marquee'), {
    duration: 30,
    repeat: -1,
    ease: Linear.easeNone,
  });

  /* Sticky 섹션 애니메이션 */
  const detailTxt1 = [
    ['01. Vivamus elementum semper nisi', '02. Aenean vulputate eleifend tellus', '03. porttitor eu, consequat vitae', '04. Aliquam lorem ante'],
    ['01. Aenean imperdiet.', '02. Etiam ultricies nisi vel augue', '03. Curabitur ullamcorper ultricies nisi', '04. Nam eget dui'],
    ['01. elementum semper nisi', '02. Curabitur ullamcorper', '03. Aliquam lorem', '04. Etiam ultricies nisi vel augue'],
  ];
  const detailTxt2 = ['Lorem ipsum dolor sit amet, consectetuer', 'consectetuer adipiscing elit. Aenean', 'Cum sociis natoque penatibus et magnis dis'];

  stickyNum = 3;
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.section-sticky',
        start: '0',
        end: `${stickyNum * 200}%`,
        pin: true,
        scrub: true,
        onUpdate: ({progress, direction, vars, isActive}) => {
          if (stickyStep !== Math.trunc(progress * stickyNum)) {
            stickyStep = Math.trunc(progress * stickyNum);
            stickyStep === stickyNum ? null : animateSticky(stickyStep);
          }
        },
      },
    })
    .fromTo('.section-sticky .deco-item', {opacity: 0, scale: 0}, {duration: 1, stagger: 0.2, opacity: 1, scale: 1, rotate: 30}, '<')
    .to('.section-sticky .deco-item', {duration: 1, stagger: 0.2, opacity: 0, scale: 1.5, rotate: 60})
    .repeat(2);

  function animateSticky(step = 0) {
    const detailText = detailTxt1[step];
    gsap.utils.toArray('.section-sticky .detail li').forEach((item, i) => {
      gsap.to(item, {text: {value: detailText[i], padSpace: true}});
    });
    gsap.to('.section-sticky .detail p', {text: {value: detailTxt2[step], padSpace: true}});

    document.querySelectorAll('.section-sticky text').forEach((item, index) => {
      if (index === step) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });

    document.querySelector('.section-sticky').classList = `section-sticky is-step-${step}`;

    if (step === 0) {
      gsap.to('body', {'background-color': '#5c79e5', 'background-image': 'linear-gradient(315.01deg, #78abcf 8.31%, #5c79e5 88.22%)'});
    } else if (step === 1) {
      gsap.to('body', {'background-color': '#6f00ff', 'background-image': 'linear-gradient(155.92deg, #929dff 5.36%, #3f52ff 85.08%)'});
      document.body.classList = 'theme-light';
    } else if (step === 2) {
      gsap.to('body', {
        'background-color': '#fff',
        'background-image': 'linear-gradient(154.45deg, rgba(0, 26, 255, 0.39) -60.92%, rgba(0, 26, 255, 0) 34.15%, rgba(0, 26, 255, 0.39) 108.43%)',
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
    gsap.to('body', {'background-color': '#ceebeb', 'background-image': 'none'});
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
    gsap.to('body', {'background-color': '#5c79e5', 'background-image': 'linear-gradient(315deg, #78abcf 8.31%, #5c79e5 88.22%);'});
    document.body.classList = 'theme-light';
  }

  /* 캔버스 스크롤 이펙트 */
  const canvas = canvasWrap.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  function initCanvas() {
    const sceneClip = new Image();
    const sceneNum = 299;
    const sceneArray = [];
    let scenePos = {x: 0};
    let sceneSize;
    let sceneEl;
    let currentScene;
    let progress;
    let frame;
    let resizeTimer;

    sceneClip.src = './../assets/images/frame/A_00000_alpha.png';

    for (let i = 0; i <= sceneNum; i++) {
      let index = i + '';
      sceneEl = new Image();
      sceneEl.src = `./../assets/images/frame/A_${index.padStart(5, '0')}.webp`;
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
        {x: () => 0.35 * canvas.offsetWidth},
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
        },
      );
    });

    function drawScene() {
      ctx.save();
      ctx.drawImage(sceneClip, canvas.width / 2 - sceneSize / 2 + scenePos.x, canvas.height / 2 - sceneSize / 2, sceneSize, sceneSize);
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(sceneArray[currentScene], canvas.width / 2 - sceneSize / 2 + scenePos.x, canvas.height / 2 - sceneSize / 2, sceneSize, sceneSize);

      ctx.restore();
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      progress = Math.min(scrollTop / (footerTop / 4), 4) || 0;
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
        const posTop = scrollTop > footerTop - window.innerHeight ? footerTop : scrollTop;

        canvas.width = canvasWrap.offsetWidth;
        canvas.height = canvasWrap.offsetHeight;

        footerTop = document.querySelector('.footer').offsetTop - window.innerHeight;
        sceneSize = (580 / 1280) * canvas.offsetWidth;

        canvasWrap.style.top = posTop + 'px';

        update();
      }, 300);
    }
  }

  /* 마우스 커서 */
  const cursorPos = {};
  let cursorTarget;

  const cursorTimeline = gsap
    .timeline({repeat: -1, repeatDelay: 1, paused: true})
    .fromTo('#cursor-content .stop-1', {stopColor: '#78abcf'}, {duration: 0.2, stopColor: '#78abcf'})
    .fromTo('#cursor-content .stop-2', {stopColor: '#5c79e5'}, {duration: 0.2, stopColor: '#5c79e5'}, '<')
    .to('#cursor-content .stop-1', {duration: 0.4, stopColor: '#ff4dd8'})
    .to('#cursor-content .stop-2', {duration: 0.4, stopColor: '#6800fe'}, '<')
    .to('#cursor-content .stop-1', {duration: 0.4, stopColor: '#78abcf'}, '>1')
    .to('#cursor-content .stop-2', {duration: 0.4, stopColor: '#5c79e5'}, '<');

  function mouseMove(e) {
    cursorPos.x = e.clientX;
    cursorPos.y = e.clientY;

    drawCursor(e);
  }
  function drawCursor(e) {
    gsap.set('#cursor-content circle', {cx: cursorPos.x, cy: cursorPos.y});

    if (e.target === cursorTarget) return;
    cursorTarget = e.target;

    if (e.target.closest('a') || e.target.closest('button')) {
      gsap.to('#cursor-content circle', {duration: 0.2, r: 10, stroke: 'transparent', attr: {'fill-opacity': 1}});
      cursorTimeline.restart();
    } else {
      gsap.to('#cursor-content circle', {duration: 0.2, r: 12, stroke: '#333', attr: {'fill-opacity': 0}});
      cursorTimeline.pause();
    }
  }

  /* 푸터 로고 모션 */
  function enterBtnShop(e) {
    gsap
      .timeline()
      .fromTo(e.target, {rotate: 0, scale: 1}, {duration: 0.2, rotate: -30, scale: 1.1})
      .to(e.target, {duration: 0.5, ease: Back.easeOut.config(1.7), rotate: 360});
  }
  function leaveBtnShop(e) {
    gsap
      .timeline()
      .fromTo(e.target, {rotate: 0, scale: 1.1}, {duration: 0.2, rotate: 30, scale: 1})
      .to(e.target, {duration: 0.5, ease: Back.easeOut.config(1.7), rotate: -360});
  }

  /* 로고 인터렉션 */
  function animateLogo(e) {
    const logoMain = e.target.querySelectorAll('.logo-main');
    const logoSub = e.target.querySelector('.logo-sub');
    gsap
      .timeline()
      .to(logoMain, {
        duration: 0.2,
        stagger: 0.01,
        y: index => index * -1.5,
        opacity: index => 1 - index * 0.1,
        ease: Power2.easeOut,
      })
      .to(logoMain, {duration: 0.2, stagger: 0.01, y: 0, opacity: 1, ease: Back.easeOut});
    if (!logoSub) return;
    gsap.timeline().to(logoSub, {duration: 0.3, y: 40, opacity: 0.7, ease: Power2.easeOut}).to(logoSub, {duration: 0.2, y: 50, opacity: 1, ease: Back.easeOut});
  }

  /* 이벤트 초기화 */
  window.addEventListener('load', initCanvas);
  window.addEventListener('mousemove', mouseMove);
  footerShopIcon.addEventListener('mouseenter', enterBtnShop);
  footerShopIcon.addEventListener('mouseleave', leaveBtnShop);
  headerLogo.addEventListener('mouseenter', animateLogo);
  footerLogo.addEventListener('mouseenter', animateLogo);
})();
