import { useState } from "react"

function IndexSidePanel() {
  const [data, setData] = useState("")
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      这是侧边栏
    </div>
  )
}

export default IndexSidePanel
