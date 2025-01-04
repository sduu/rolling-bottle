import { gsap } from 'gsap';

export class Marquee {
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
        { x: direction === -1 ? 0 : -offsetWidth },
        {
          ...this.options,
          x: direction === -1 ? -offsetWidth : 0,
        },
        '<'
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
