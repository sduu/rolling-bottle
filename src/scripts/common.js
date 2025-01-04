import { enterBtnShop, leaveBtnShop } from './components/buttonAnimations';
import { animateLogo } from './components/logoAnimations';
import { Marquee } from './components/marquee';

const footerShopIcon = document.querySelector('.footer .btn-shop i');
const headerLogo = document.querySelector('.header .logo');
const footerLogo = document.querySelector('.footer .logo');

footerShopIcon.addEventListener('mouseenter', enterBtnShop);
footerShopIcon.addEventListener('mouseleave', leaveBtnShop);
headerLogo.addEventListener('mouseenter', animateLogo);
footerLogo.addEventListener('mouseenter', animateLogo);

const marquee = new Marquee(document.querySelector('.section-marquee'), {
  duration: 30,
  repeat: -1,
  ease: 'none',
});

export { marquee };
