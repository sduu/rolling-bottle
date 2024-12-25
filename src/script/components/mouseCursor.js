export default class MouseCursor {
  constructor(cursorSelector) {
    this.cursorSelector = cursorSelector;
    this.cursorElement = document.querySelector(cursorSelector);
    this.cursorPos = {};
    this.cursorTarget = null;

    // 커서 애니메이션
    this.cursorTimeline = gsap
      .timeline({ repeat: -1, repeatDelay: 1, paused: true })
      .fromTo(`${cursorSelector} .stop-1`, { stopColor: '#78abcf' }, { duration: 0.2, stopColor: '#78abcf' })
      .fromTo(`${cursorSelector} .stop-2`, { stopColor: '#5c79e5' }, { duration: 0.2, stopColor: '#5c79e5' }, '<')
      .to(`${cursorSelector} .stop-1`, { duration: 0.4, stopColor: '#ff4dd8' })
      .to(`${cursorSelector} .stop-2`, { duration: 0.4, stopColor: '#6800fe' }, '<')
      .to(`${cursorSelector} .stop-1`, { duration: 0.4, stopColor: '#78abcf' }, '>1')
      .to(`${cursorSelector} .stop-2`, { duration: 0.4, stopColor: '#5c79e5' }, '<');
  }

  init() {
    window.addEventListener('mousemove', e => this.mouseMove(e));
  }

  mouseMove(e) {
    this.cursorPos.x = e.clientX;
    this.cursorPos.y = e.clientY;
    this.drawCursor(e);
  }

  drawCursor(e) {
    gsap.set(this.cursorSelector + ' circle', { cx: this.cursorPos.x, cy: this.cursorPos.y });

    if (e.target === this.cursorTarget) return;
    this.cursorTarget = e.target;

    if (e.target.closest('a') || e.target.closest('button')) {
      gsap.to(this.cursorSelector + ' circle', {
        duration: 0.2,
        r: 10,
        stroke: 'transparent',
        attr: { 'fill-opacity': 1 },
      });
      this.cursorTimeline.restart();
    } else {
      gsap.to(this.cursorSelector + ' circle', { duration: 0.2, r: 12, stroke: '#333', attr: { 'fill-opacity': 0 } });
      this.cursorTimeline.pause();
    }
  }
}
