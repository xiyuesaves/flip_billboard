import "./style.scss";
import pic1 from "../pic1.jpg";
import pic2 from "../pic2.jpg";
import pic3 from "../pic3.jpg";
import Wallpaper from "./Wallpaper";

const wallpaper = new Wallpaper(document.querySelector("#app"), 48, [pic1, pic2, pic3]);

async function loop() {
  await wallpaper.nextPic();
  loop();
}
loop();
