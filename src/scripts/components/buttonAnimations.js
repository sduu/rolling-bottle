import { gsap, Back } from 'gsap';

export const enterBtnShop = e => {
  gsap
    .timeline()
    .fromTo(e.target, { rotate: 0, scale: 1 }, { duration: 0.2, rotate: -30, scale: 1.1 })
    .to(e.target, { duration: 0.5, ease: Back.easeOut.config(1.7), rotate: 360 });
};

export const leaveBtnShop = e => {
  gsap
    .timeline()
    .fromTo(e.target, { rotate: 0, scale: 1.1 }, { duration: 0.2, rotate: 30, scale: 1 })
    .to(e.target, { duration: 0.5, ease: Back.easeOut.config(1.7), rotate: -360 });
};
