import type { PlasmoCSConfig } from "plasmo";
import u from "umbrellajs";

import { sendToBackground } from "@plasmohq/messaging";

export const config: PlasmoCSConfig = {
  matches: ["https://amap.com/*", "https://map.qq.com/*", "https://map.baidu.com/*"],
  all_frames: true
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

function parsePlaceQQmap() {
  const placebox = u(".iwContainer");
  const place_name = placebox.find(".iwHeaderContainer");
  var data = {
    id: placebox.attr("data-id"),
    name: place_name.find(".titleText").text(),
    addr: "",
    phone: ""
  }
  const place = placebox.find(".iwRichContainer");

  var text = place.text().trim().split(/\s+/)
  if (text.length == 1) {
    data.addr = text[0]
  }
  switch (true) {
    case text.length == 1:
      data.addr = text[0]
      break;
    case text.length == 2:
      data.phone = text[0];
      data.addr = text[text.length - 1]
      break;
    case text.length > 2:
      data.phone = text.slice(0, text.length - 1).join(" ");
      data.addr = text[text.length - 1]
      break;
  }

  return data
}

function parsePlaceBaidumap() {
  const placebox = u(".card")
  const data = {
    id: placebox.attr("data-id"),
    name: placebox.find(".generalHead-left-header-title").find("span").text(),
    addr: placebox.find(".generalInfo-address-text").text(),
    phone: placebox.find(".generalInfo-telnum-text").text(),
  }

  return data
}

function sendPlace() {
  switch (true) {
    case /^.*\amap.com$/.test(window.location.hostname):
      sendToBackground({
        action: "place", data: parsePlaceAmap()
      })
      break;
    case /^.*\map.qq.com$/.test(window.location.hostname):
      sendToBackground({
        action: "place", data: parsePlaceQQmap()
      })
      break;
    case /^.*\map.baidu.com$/.test(window.location.hostname):
      sendToBackground({
        action: "place", data: parsePlaceBaidumap()
      })
      break;
  }
}

window.addEventListener("load", () => {
  sendPlace();
  document.addEventListener("click", function (event) {
    setTimeout(() => {
      sendPlace()
    }, 1 * 1000);
  })
})
