import "./style.scss";
import pic1 from "../pic1.svg";
import pic2 from "../pic2.svg";
import pic3 from "../pic3.svg";
import Wallpaper from "./Wallpaper";

const wallpaper = new Wallpaper(document.querySelector("#app"), 48, [pic1, pic2, pic3]);
const ms = 1000;
const CHANGE_TIME = 60;
let changetime = CHANGE_TIME * ms;

async function loop() {
  await new Promise((resolve) => setTimeout(resolve, changetime));
  await wallpaper.nextPic();
  loop();
}
loop();

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    console.log(properties);
    if (properties.changetime && parseInt(properties.changetime.value) !== changetime) {
      if (isNaN(parseInt(properties.changetime.value))) {
        changetime = CHANGE_TIME * ms;
      } else {
        changetime = parseInt(properties.changetime.value) * ms;
      }
    }
  },
  userDirectoryFilesAddedOrChanged: function (propertyName, changedFiles) {
    console.log(propertyName, changedFiles);
    wallpaper.pics = changedFiles.map((item) => `file:///${item}`);
    wallpaper.updatePic();
  },
};
