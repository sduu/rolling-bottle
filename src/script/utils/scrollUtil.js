const ScrollbarPlugin = window.Scrollbar.ScrollbarPlugin;
let scrollTop = 0;
let bodyOffsetHeight;

export const initScrollListener = (scrollContent, callback) => {
  class DisableScrollPlugin extends ScrollbarPlugin {
    static pluginName = 'disableScroll';
    static defaultOptions = { direction: '' };

    transformDelta(delta) {
      if (this.options.direction) delta[this.options.direction] = 0;
      return { ...delta };
    }
  }
  Scrollbar.use(DisableScrollPlugin);

  const smoothScroll = window.Scrollbar.init(scrollContent, {
    thumbMinSize: 10,
    speed: 2,
    plugins: { disableScroll: { direction: 'x' } },
  });

  smoothScroll.addListener(({ offset, limit }) => {
    scrollTop = offset.y;
    bodyOffsetHeight = limit.y;
    if (callback) callback(scrollTop);
  });

  document.querySelector('.scrollbar-track-x').remove();

  return smoothScroll;
};

export const getScrollTop = () => {
  return scrollTop;
};
