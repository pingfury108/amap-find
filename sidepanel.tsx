import { useState } from "react";

import { useMessage } from "@plasmohq/messaging/hook";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import "~style.css";


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
  const [data, setData] = useState("")

  useMessage<string, string>(async (req, res) => {
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
      <div style={{
        padding: 16
      }} className="text-base">这里没有电话数据哦</div>
    )
  }
}

export default IndexSidePanel
