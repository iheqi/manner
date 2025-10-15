import { useRef, useEffect } from "react";
import mannerLogo from "./assets/manner.png";
import "./App.css";
import { ethers } from "ethers";
import { message } from "antd";

import { ABI } from "./contants.ts";
const rpcUrl = "http://121.37.42.90:8578/";
const contractAddress = "0xa6cdc4fed96bbf8c9c013cc19200b3c8ba95c93e";

const targetAddress = new URLSearchParams(window.location.search).get(
  "address"
) as string;
function App() {
  const request = new ethers.FetchRequest(rpcUrl);
  request.setHeader("User-Agent", "*/*");
  const web3Provider = new ethers.JsonRpcProvider(request, undefined, {
    batchMaxCount: 1,
  });
  const contract = new ethers.Contract(contractAddress, ABI, web3Provider);

  let lastBlock = 0;
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  async function pollTransfers() {
    const currentBlock = await web3Provider.getBlockNumber();
    console.log("currentBlock", currentBlock);

    if (currentBlock < lastBlock + 1) {
      return;
    }

    if (lastBlock === 0) {
      lastBlock = currentBlock;
      return;
    }

    const events = await contract.queryFilter(
      "Transfer",
      lastBlock + 1,
      currentBlock
    );

    console.log("events", events);
    for (const e of events) {
      if ("args" in e && e.args) {
        const { from, to, value } = e.args;
        if (to.toLowerCase() === targetAddress.toLowerCase()) {
          console.log(`💰 收到转账: 来自 ${from}, 数量: ${Number(value)}`);
          message.success(
            `💰 收到转账: 来自 ${from}, 数量: ${Number(value)} 元豆`
          );
        }
      }
    }

    lastBlock = currentBlock;
  }

  useEffect(() => {
    intervalRef.current = setInterval(pollTransfers, 1000);

    return () => {
      console.log("intervalRef.current", intervalRef.current);
      clearInterval(Number(intervalRef.current));
    };
  }, []);

  return (
    <>
      <div>
        <h2>Manner coffee</h2>
        <img
          style={{
            width: "240px",
            height: "240px",
          }}
          src={mannerLogo}
          className="logo"
          alt="Vite logo"
        />
      </div>
    </>
  );
}

export default App;
