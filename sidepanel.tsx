import { useMessage } from "@plasmohq/messaging/hook";
import { Storage } from "@plasmohq/storage";
import { useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import "~style.css";


const storage = new Storage();
const storage_key = "place-data";

class PlaceData {
  id: String
  name: String
  addr: String
  phone: String
}

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

  var data_l = []
  if (data) {
    data_l = data.filter(d => d.phone !== '')
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
  const [data, setData] = useState<PlaceData>(new (PlaceData));
  const [storageData, setStorageData] = useState([]);

  useMessage<string, string>(async (req, res) => {
    var place_ss = await storage.get(storage_key);
    console.log(place_ss, "ffff");
    if (place_ss) {
      //var place: Array<any> = JSON.parse(place_ss);
      var place = [].concat(place_ss);
      place.push(req.data);
      var place_2 = place.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.name === item.name
        ))
      );
      var place_3 = place_2.filter(p => p.phone !== '');
      storage.set(storage_key, place_3);
      setStorageData(place_3)
    } else {
      var place = [req.data,].filter(p => p.phone !== '');
      storage.set(storage_key, place);
      setStorageData(place);
    }
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
    setStorageData([]);
  }

  return (
    <div className="container p-4 h-full text-base">
      <div className="container text-base h-72">
        {info}
      </div>
      <div className="border mt-10"></div>
      <div className="container mt-5 pt-1">
        <div className="grid grid-cols-3 gap-4">
          <span className="col-span-1">数量: {storageData.length}</span>
          <button onClick={copyTableToClipboard} className="border rounded-full w-full col-span-1">复制表格</button>
          <button onClick={clean_history} className="border rounded-full w-full col-span-1">清除历史</button>
        </div>
        <table className="mt-5 table-auto">
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
