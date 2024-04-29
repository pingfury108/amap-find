import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://amap.com/*"]
}

window.addEventListener("load", () => {
  console.log("你说神马")
  //console.log(jq.$('#renderArrowLayer'))
})
