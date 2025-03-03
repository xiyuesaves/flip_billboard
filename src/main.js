import "./style.scss";
import pic1 from "../pic1.svg";
import pic2 from "../pic2.svg";
import pic3 from "../pic3.svg";
import Wallpaper from "./Wallpaper";

const wallpaper = new Wallpaper(document.querySelector("#app"), 48, [pic1, pic2, pic3]);
const ms = 1000;
const CHANGE_TIME = 0;
let changetime = CHANGE_TIME * ms;
let timeout = null;
async function loop() {
  await wallpaper.nextPic();
  timeout = setTimeout(loop, changetime);
}
loop()

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    console.log(properties);
    if (properties.changetime && parseInt(properties.changetime.value) !== changetime) {
      if (isNaN(parseInt(properties.changetime.value))) {
        changetime = CHANGE_TIME * ms;
      } else {
        changetime = parseInt(properties.changetime.value) * ms;
      }
      clearTimeout(timeout);
      timeout = setTimeout(loop, changetime);
      console.log("更新间隔", changetime);
    }
  },
  userDirectoryFilesAddedOrChanged: function (propertyName, changedFiles) {
    console.log("更新图片列表", changedFiles);
    wallpaper.pics = changedFiles.map((item) => `file:///${item}`);
    wallpaper.index = 0;
    wallpaper.updatePic();
  },
};
