import { relayMessage } from '@plasmohq/messaging';
import { useState } from "react";


function IndexSidePanel() {
    const [data, setData] = useState("")

    relayMessage('dataToDisplay', (d) => {
        const message = d.message;
        console.log(message);
        setData(message);
    });
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 16
            }}>
            这是侧边栏
            <span>
                {data}
            </span>
        </div>
    )
}

export default IndexSidePanel
