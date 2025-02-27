import anime from "animejs/lib/anime.es.js";

class Wallpaper {
  constructor(el, splitNum = 32, pics = []) {
    this.el = el;
    this.splitNum = splitNum;
    this.pics = pics;
    this.index = 0;
    this.resolve = null;
    if (!this.pics.length) {
      throw new Error("至少需要一张图片");
    }
    this.preloaded = new Map();
    this.pics.forEach((url) => this.preloadImage(url));
    this.initialize();
  }
  nextPic() {
    const { promise, resolve } = Promise.withResolvers();
    this.resolve = resolve;
    this.animation.play();
    return promise;
  }
  preloadImage(url) {
    if (!this.preloaded.has(url)) {
      const img = new Image();
      img.src = url;
      this.preloaded.set(url, img);
    }
  }
  initialize() {
    this.nodes = this.initDOM();
    this.prismList = this.initAnime();
    this.animation = this.initAnimation();
    this.initSize();
    this.updatePic();
  }
  updatePic() {
    if (!this.pics.length) {
      return;
    }
    const currentPic = this.getCurrentPic();
    const nextPic = this.getNextPic();
    this.nodes.root.style.setProperty("--before-pic", `url('${currentPic}')`);
    this.nodes.root.style.setProperty("--after-pic", `url('${nextPic}')`);
    this.nodes.root.style.setProperty("--bgimg-1", `url('${currentPic}')`);
    this.nodes.root.style.setProperty("--bgimg-2", `url('${nextPic}')`);
  }
  getCurrentPic() {
    return this.pics[this.index % this.pics.length];
  }
  getNextPic() {
    return this.pics[(this.index + 1) % this.pics.length];
  }
  initSize() {
    this.nodes.root.style.setProperty("--prism-length", this.splitNum);
    this.nodes.root.style.setProperty("--prism-width", this.el.offsetWidth + "px");
    this.nodes.root.style.setProperty("--prism-height", this.el.offsetHeight + "px");
    new ResizeObserver(() => {
      this.nodes.root.style.setProperty("--prism-width", this.el.offsetWidth + "px");
      this.nodes.root.style.setProperty("--prism-height", this.el.offsetHeight + "px");
    }).observe(this.el);
  }
  initDOM() {
    const rootNode = '<div class="prism"><div class="mask after-pic"></div><div class="mask before-pic"></div></div>';
    const borderNode =
      '<div class="triangular-prism-border"><div class="triangular-prism"><div class="face front"></div><div class="face left"></div><div class="face right"></div></div></div>';
    const domparser = new DOMParser();
    const prism = domparser.parseFromString(rootNode, "text/html").querySelector(".prism");
    prism.insertAdjacentHTML("beforeend", borderNode.repeat(this.splitNum));
    this.el.appendChild(prism);
    return {
      root: prism,
      prismBorder: prism.querySelectorAll(".triangular-prism-border"),
    };
  }
  initAnime() {
    const prismList = [];
    this.nodes.prismBorder.forEach((item, index) => {
      const triangularPrism = item.querySelector(".triangular-prism");
      triangularPrism.style.setProperty("--count", index);
      prismList.push({
        prism: triangularPrism,
        faces: triangularPrism.querySelectorAll(".face"),
        process: 0,
      });
    });
    return prismList;
  }
  initAnimation() {
    return anime({
      targets: this.prismList,
      process: 100,
      duration: 1000,
      autoplay: false,
      easing: "easeInOutQuad",
      delay: anime.stagger(100),
      update: () => {
        let beforeIndex = this.splitNum;
        let afterIndex = 0;
        this.prismList.forEach((item, index) => {
          const { faces, prism, process } = item;
          if (beforeIndex === this.splitNum && process === 0) {
            beforeIndex = index;
          }
          if (process === 100) {
            afterIndex = index + 1;
          }
          prism.style.transform = `translateZ(calc(var(--center-height) * -1)) rotateY(${120 * (process / 100)}deg)`;
          prism.setAttribute("data-process", process);
          faces[0].style.setProperty(
            "--shadow",
            `linear-gradient(to right, transparent, rgba(0, 0, 0, ${0.8 * Math.sin((process / 100) * Math.PI)}))`
          );
          faces[1].style.setProperty(
            "--shadow",
            `linear-gradient(to left, transparent, rgba(0, 0, 0, ${0.8 * Math.sin((process / 100) * Math.PI)}))`
          );
        });
        this.nodes.root.style.setProperty("--after-pic-offset", `${-100 + (afterIndex / this.splitNum) * 100}%`);
        this.nodes.root.style.setProperty("--before-pic-offset", `${(beforeIndex / this.splitNum) * 100}%`);
      },
      complete: () => {
        this.prismList.forEach((item) => {
          item.process = 0;
        });
        this.index++;
        this.updatePic();
        this.nodes.root.style.setProperty("--after-pic-offset", `-100%`);
        this.nodes.root.style.setProperty("--before-pic-offset", `0%`);
        this.resolve();
      },
    });
  }
}
export default Wallpaper;
