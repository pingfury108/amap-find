import { useMessage } from "@plasmohq/messaging/hook";
import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import "~style.css";

import { PlaceData, get_all_data, set_place, storage, storage_key } from '~storage';


function ParsePhone(phone: String) {
  if (phone) {
    return phone.replace(/\(/g, "").replace(/\)/g, "-").replace(/\;/g, " ").replace(/\,/g, " ").trim().split(/\s+/)
  } else {
    return []
  }
}

function PhoneItem({ phone }) {
  const handleCopy = () => {
  };
  var phones = ParsePhone(phone);

  if (phones.length > 0) {
    return phones.map((p: string, index: number) => (
      <div key={index} className="d-phone grid grid-cols-10">
        <div className="text-lg phone col-span-8">{p}</div>
        <div className="col-span-2 col-start-9 col-end-11 text-base">
          <CopyToClipboard text={p}>
            <button onClick={handleCopy} className="border rounded-full text-blue-500 w-full">复制</button>
          </CopyToClipboard>
        </div>
      </div>
    ));
  } else {
    return (<></>)
  }
}

function History({ data }) {

  const p = (s: String) => {
    let pp = ParsePhone(s);
    if (pp.length > 0) {
      return pp[0]
    } else {
      return s
    }
  }

  var data_l: Array<PlaceData> = []
  if (data) {
    data_l = data.filter(d => d !== null && d.phone !== '')
  }

  return data_l.map((d, index: number) => (
    <tr key={index}>
      <td className="border">
        <p className="truncate text-left">{d.name}</p>
      </td>
      <td className="border">
        <p className="truncate text-left">{p(d.phone)}</p>
      </td>
    </tr>
  ))
}

function IndexSidePanel() {
  const [data, setData] = useState({});
  const [storageData] = useStorage({
    key: storage_key,
    instance: storage,
  });

  /*
    (async () => {
      const t = await get_all_data();
      setStorageData(t);
    })()
   */

  useMessage<string, string>(async (req, res) => {
    await set_place(req.data);
    //const place = await get_all_data();
    //setStorageData(place)
    setData(req.data);
  })

  const copyTableToClipboard = () => {
    // Convert table data to a formatted text
    const textToCopy = storageData.map(row => [row.name, ...ParsePhone(row.phone)].join('\t')).join('\n');

    // Copy the formatted text to clipboard
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('Table data copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  var info = <div>这里没有电话数据哦</div>;
  if (data.phone) {
    info = (
      <div>
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            {data.name}
          </div>
          <div className="col-span-2 col-start-9 col-end-11">
            <CopyToClipboard text={data.name}>
              <button className="border rounded-full text-blue-500 w-full">复制</button>
            </CopyToClipboard>
          </div>
        </div>
        <div className="container mt-5">
          <PhoneItem phone={data.phone} />
        </div>
      </div>
    )
  }

  const clean_history = () => {
    storage.clear();
    //setStorageData([]);
  }


  return (
    <div className="container p-4 h-full text-base">
      <div className="container text-base h-72">
        {info}
      </div>
      <div className="border mt-10"></div>
      <div className="container mt-5 pt-1">
        <div className="grid grid-cols-3 gap-4">
          <span className="col-span-1">数量: {[].concat(storageData).length}</span>
          <button onClick={copyTableToClipboard} className="border rounded-full w-full col-span-1">复制表格</button>
          <button onClick={clean_history} className="border rounded-full w-full col-span-1">清除历史</button>
        </div>
        <table className="mt-5 table-auto w-full">
          <thead>
            <tr>
              <th className="border">名称</th>
              <th className="border">电话</th>
            </tr>
          </thead>
          <tbody>
            <History data={storageData} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default IndexSidePanel
