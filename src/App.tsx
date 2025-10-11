import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ethers } from "ethers";

import { ABI } from "./contants.ts";
const rpcUrl = "https://rpc-testnet.potos.hk/";
const contractAddress = "0xBDb9b0aBa1B38117a3B6E0AF93D810e2728a7469";
function App() {
  const [count, setCount] = useState(0);

  async function test() {
    const request = new ethers.FetchRequest(rpcUrl);
    request.setHeader("User-Agent", "*/*");
    const web3Provider = new ethers.JsonRpcProvider(request, undefined, {
      batchMaxCount: 1,
    });
    const contract = new ethers.Contract(contractAddress, ABI, web3Provider);
    const uri = await contract.tokenURI(1);
    console.log(uri);
  }

  test();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
