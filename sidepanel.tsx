import { useMessage } from "@plasmohq/messaging/hook";
import { Storage } from "@plasmohq/storage";
import { useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import "~style.css";


const storage = new Storage();
const storage_key = "place-data";

function PhoneItem({ phone }) {
  const handleCopy = () => {
  };
  const phones = phone.trim().split(/\s+/);

  if (phones.length > 0) {
    return phones.map(p => <div className="grid grid-cols-2 gap-3">
      <div className="text-lg phone">{p}</div>
      <CopyToClipboard text={p}>
        <button onClick={handleCopy} className="border text-lg rounded-full text-blue-500">点击复制电话</button>
      </CopyToClipboard>
    </div>);
  } else {
    return (<></>)
  }
}

function IndexSidePanel() {
  const [data, setData] = useState("");

  useMessage<string, string>(async (req, res) => {
    var place_ss = await storage.get(storage_key);
    console.log(place_ss, "ffff");
    if (place_ss) {
      //var place: Array<any> = JSON.parse(place_ss);
      var place: Array<any> = place_ss;
      place.push(req.data);
      var place_2 = place.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.id === item.id
        ))
      );
      storage.set(storage_key, place_2);
    } else {
      storage.set(storage_key, JSON.stringify([req.data,]));
    }
    setData(req.data);
  })

  if (data.phone) {
    return (
      <div className="container"
        style={{
          padding: 16
        }}>
        <div className="nd text-base">
          <div mt-4>{data.name}</div>
          <div mt-4>{data.addr}</div>
        </div>
        <div className="container mt-5">
          <PhoneItem phone={data.phone} />
        </div>
      </div>
    )
  } else {
    return (
      <div style={{ padding: 16 }} className="text-base">这里没有电话数据哦</div>)
  }
}

export default IndexSidePanel
