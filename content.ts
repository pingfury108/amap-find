import type { PlasmoCSConfig } from "plasmo"
import u from "umbrellajs"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["https://amap.com/*"]
}

function parsePlaceAmap() {
  const placebox = u(".placebox")
  const place = u(".place-panel")
  const data = {
    id: placebox.attr("data-id"),
    name: place.find(".poiname").text(),
    addr: place.find(".feedaddr").text(),
    phone: place.find(".feedphone").text(),
  }

  return data
}

window.addEventListener("load", () => {
  document.addEventListener("click", function (event) {
    setTimeout(() => {
      sendToBackground({
        action: "place", data: parsePlaceAmap()
      })
    }, 1 * 1000);
  })
  sendToBackground({
    action: "place", data: parsePlaceAmap()
  })
})
