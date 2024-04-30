import { sendToBackground } from '@plasmohq/messaging';
import type { PlasmoCSConfig } from "plasmo";
import u from 'umbrellajs';

export const config: PlasmoCSConfig = {
  matches: ["https://amap.com/*"]
}

window.addEventListener("load", () => {
  console.log("你说神马");
  //console.log(u('#renderArrowLayer'));
  document.addEventListener("click", function (event) {
    // 在控制台输出点击事件的信息
    console.log("鼠标点击位置：", event.clientX, event.clientY);
    //console.log(u('#renderArrowLayer').html());
    var placebox = u('.placebox');
    console.log("place-id: ", placebox.attr("data-id"));
    var place = u(".place-panel");
    var name = place.find(".poiname").text();
    var addr = place.find(".feedaddr").text();
    var phone = place.find(".feedphone").text();
    console.log("name: ", name);
    console.log("addr: ", addr);
    console.log("phone: ", phone);
    sendToBackground('dataToDisplay', { message: 'Hello from content scripts!' + name + addr + phone });
  });
})
