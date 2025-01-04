export const animateLogo = e => {
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
    .to(logoMain, { duration: 0.2, stagger: 0.01, y: 0, opacity: 1, ease: Back.easeOut });

  if (!logoSub) return;

  gsap
    .timeline()
    .to(logoSub, { duration: 0.3, y: 40, opacity: 0.7, ease: Power2.easeOut })
    .to(logoSub, { duration: 0.2, y: 50, opacity: 1, ease: Back.easeOut });
};
