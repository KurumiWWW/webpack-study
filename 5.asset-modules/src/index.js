import imgsrc from "./assets/png.png";
import imgsrc2 from "./assets/svg.svg";
import txt from "./assets/text.txt";
import jpg from "./assets/jpg.jpg";

console.log("123456!!!");

const png = document.createElement("img");
png.src = imgsrc;
document.body.appendChild(png);

const svg = document.createElement("img");
svg.src = imgsrc2;
document.body.appendChild(svg);

const block = document.createElement("div");
block.innerHTML = txt;
document.body.appendChild(block);
block.style.cssText = "color:#ccc";

const jpgmap = document.createElement("img");
jpgmap.src = jpg;
document.body.appendChild(jpgmap);
