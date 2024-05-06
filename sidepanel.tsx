import { useState } from "react";

import { useMessage } from "@plasmohq/messaging/hook";
import { CopyToClipboard } from 'react-copy-to-clipboard';


function PhoneItem({ phone }) {
  const handleCopy = () => {
  };
  const phones = phone.trim().split(/\s+/);
  console.log(phones);

  if (phones.length > 0) {
    return phones.map(p => <p>
      <span>{p}</span>
      <span></span>
      <CopyToClipboard text={p}>
        <button onClick={handleCopy}>点击复制电话</button>
      </CopyToClipboard>
    </p>);
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
      <div>
        <div>
          <span>{data.name}</span> |
          <span>{data.addr}</span>
        </div>
        <PhoneItem phone={data.phone} />
      </div>
    )
  } else {
    return (
      <div>这里没有电话数据哦</div>
    )
  }
}

export default IndexSidePanel
