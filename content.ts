import type { PlasmoCSConfig } from "plasmo"
import u from "umbrellajs"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["https://amap.com/*"]
}

window.addEventListener("load", () => {
  document.addEventListener("click", function (event) {

    // 在控制台输出点击事件的信息
    console.log("鼠标点击位置：", event.clientX, event.clientY)
    setTimeout(() => {
      var placebox = u(".placebox")
      var place = u(".place-panel")
      var data = {
        id: placebox.attr("data-id"),
        name: place.find(".poiname").text(),
        addr: place.find(".feedaddr").text(),
        phone: place.find(".feedphone").text(),
      }
      console.log("place: ", data)
      sendToBackground({
        action: "place", data: data
      })
    }, 1 * 1000);
  })
})
