import type { PlasmoCSConfig } from "plasmo";
import u from "umbrellajs";

import { sendToBackground } from "@plasmohq/messaging";

import { PlaceData, get_all_data, set_place, storage, storage_key } from '~storage';



export const config: PlasmoCSConfig = {
  matches: ["https://amap.com/*", "https://map.qq.com/*", "https://map.baidu.com/*", "https://www.qcc.com/*"],
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
  console.log(data)

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
  console.log(data)

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
  console.log(data)

  return data
}

function parsePlaceQcc() {
  const data = u(".maininfo");

  var place_data = [];
  data.each(function (el) {
    const name = u(el).find(".copy-title span").nodes[0].textContent;
    const pf = () => {
      var p = u(u(el).find(".relate-info").find(".over-rline").nodes[1]).find(".val");
      return p.text()
    }
    const phone = pf();
    const addr = u(el).find(".max-address").text();
    //const data = new PlaceData("", name, addr, phone)//
    const data = { name: name, phone: phone, addr: addr };
    place_data.push(data);
  });
  return place_data
}

async function sendPlace() {
  console.log(window.location.hostname);
  switch (true) {
    case /^.*\amap.com$/.test(window.location.hostname):
      console.log("amap")
      sendToBackground({
        action: "place", data: parsePlaceAmap()
      })
      break;
    case /^.*\map.qq.com$/.test(window.location.hostname):
      console.log("map qq")
      sendToBackground({
        action: "place", data: parsePlaceQQmap()
      })
      break;
    case /^.*\map.baidu.com$/.test(window.location.hostname):
      console.log("map baidu")
      sendToBackground({
        action: "place", data: parsePlaceBaidumap()
      })
      break;
    case /^.*\www.qcc.com$/.test(window.location.hostname):
      console.log("qcc")
      const p_data = parsePlaceQcc();
      //console.log(data)

      (async () => {
        var s_data = await get_all_data();
        if (s_data) {
        } else {
          s_data = [];
        }
        var data = [].concat(s_data).concat(p_data);
        data = data.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.name === item.name
          ))
        );
        data = data.filter(p => p.phone !== '');
        await storage.set(storage_key, data);
        var d = await get_all_data();
        console.log("ccc, alldata", d);
      })()
      /*
      data.forEach(function (d) {
        console.log("ccc", d);
      })*/
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
