import "./style.scss";
import pic1 from "../pic1.svg";
import pic2 from "../pic2.svg";
import pic3 from "../pic3.svg";
import Wallpaper from "./Wallpaper";

const wallpaper = new Wallpaper(document.querySelector("#app"), 48, [pic1, pic2, pic3]);

async function loop() {
  await wallpaper.nextPic();
  loop();
}
loop();

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    console.log(properties);
    if (properties.yourproperty) {
      // Do something with yourproperty
    }
    if (properties.anotherproperty) {
      // Do something with anotherproperty
    }
    // Add more properties here
  },
};
