import { useState } from "react"

import { useMessage } from "@plasmohq/messaging/hook"

function IndexSidePanel() {
  const [data, setData] = useState("")
  useMessage<string, string>(async (req, res) => {
    console.log("Received data in sidebar:", req.data)
    // 更新侧边栏UI或执行其他操作
    setData(req.data)
    console.log(req)
  })

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      这是侧边栏
      <span>{data}</span>
    </div>
  )
}

export default IndexSidePanel
