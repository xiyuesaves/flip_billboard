import "./style.scss";
import pic1 from "../pic1.jpg";
import pic2 from "../pic2.jpg";
import pic3 from "../pic3.jpg";
import anime from "animejs/lib/anime.es.js";

// 分割数
const splitNum = 48;
const afterPic = document.querySelector(".after-pic");
const beforePic = document.querySelector(".before-pic");

let play = 0;
let page = 0;
let animation;
const pics = [pic1, pic2, pic3];

const style = document.createElement("style");

// 更新css变量值
style.innerHTML = `
:root {
  --prism-length: ${splitNum};
  --bgimg-1: url('${pic1}');
  --bgimg-2: url('${pic2}');
  --bgimg-3: url('${pic3}');
}
`;
document.head.appendChild(style);

const prismList = [];
const html = `<div class="triangular-prism-border">
        <div class="triangular-prism">
          <div class="face front"></div>
          <div class="face left"></div>
          <div class="face right"></div>
        </div>
      </div>`;

function initPrism() {
  const app = document.getElementById("app");
  for (let i = 0; i < splitNum; i++) {
    const domparser = new DOMParser();
    const dom = domparser.parseFromString(html, "text/html");
    const node = dom.querySelector(".triangular-prism-border");
    const prism = dom.querySelector(".triangular-prism");
    prism.style.setProperty("--count", i);
    prismList.push({
      prism,
      faces: dom.querySelectorAll(".face"),
      process: 0,
    });
    app.appendChild(node);
  }
}
initPrism();

function nextPage() {
  play = 1;
  afterPic.style.setProperty("--after-pic", `url('${pics[(page + 1) % 3]}')`);
  beforePic.style.setProperty("--before-pic", `url('${pics[page]}')`);

  afterPic.style.setProperty("--after-pic-offset", `-100%`);
  beforePic.style.setProperty("--before-pic-offset", `0%`);
  return new Promise((resolve) => {
    animation = anime({
      targets: prismList,
      process: 100,
      duration: 1000,
      easing: "easeInOutQuad",
      update: function () {
        let beforeIndex = splitNum;
        let afterIndex = 0;
        prismList.forEach((item, index) => {
          const { faces, prism, process } = item;
          if (beforeIndex === splitNum && process === 0) {
            beforeIndex = index;
          }
          if (process === 100) {
            afterIndex = index + 1;
          }
          prism.style.transform = `translateZ(calc(var(--center-height) * -1)) rotateY(${
            120 * page + 120 * (process / 100)
          }deg)`;
          prism.setAttribute("data-process", process);
          faces[page].style.setProperty(
            "--shadow",
            `linear-gradient(to right, transparent, rgba(0, 0, 0, ${0.8 * Math.sin((process / 100) * Math.PI)}))`
          );
          faces[(page + 1) % 3].style.setProperty(
            "--shadow",
            `linear-gradient(to left, transparent, rgba(0, 0, 0, ${0.8 * Math.sin((process / 100) * Math.PI)}))`
          );
        });
        afterPic.style.setProperty("--after-pic-offset", `${-100 + (afterIndex / splitNum) * 100}%`);
        beforePic.style.setProperty("--before-pic-offset", `${(beforeIndex / splitNum) * 100}%`);
      },
      delay: anime.stagger(100),
      complete: () => {
        page = (page + 1) % 3;
        prismList.forEach((item, index) => {
          item.process = 0;
        });
        play = 0;
        resolve();
      },
    });
  });
}

// 空格暂停
document.addEventListener("keydown", (e) => {
  if (e.key === " " && play) {
    if (animation.paused) {
      animation.play();
    } else {
      animation.pause();
    }
  }
});

async function loop() {
  await nextPage();
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  loop();
}
loop();
