import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import FaucetABI from "./artifacts/contracts/Faucet.sol/Faucet.json";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
function App() {
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");
  const [account, setAccount] = useState();
  const [value, setValue] = useState();
  const address = "0x4FA487736683547d415Dceeb22A25c762A3cccA0";
  useEffect(() => {
    addWalletListener();
  }, []);
  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setAccount("");
      console.log("Please install MetaMask");
    }
  };
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    loadContract(signer);
  };
  const loadContract = async (signer) => {
    const Faucet = new ethers.Contract(address, FaucetABI.abi, signer);
    setFcContract(Faucet);
  };
  async function requestTokens() {
    if (fcContract) {
      try {
        const tx = await fcContract.requestTokens(value);
        tx.wait();
        setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
        setTransactionData(tx.hash);
      } catch (e) {
        if (
          e.message.search(
            "Insufficient time elapsed since last withdrawal - try again later."
          ) != -1
        )
          setWithdrawError(
            "Insufficient time elapsed since last withdrawal - try again later."
          );
        else if (
          e.message.search(
            "Insufficient balance in faucet for withdrawal request"
          )
        ) {
          setWithdrawError(
            "Insufficient balance in faucet for withdrawal request"
          );
        } else if (
          e.message.search("Request must not originate from a zero account")
        ) {
          setWithdrawError("Request must not originate from a zero account");
        }
      }
    } else {
      alert("Connect to wallet first");
    }
  }
  const style1 = {
    paddingLeft: "800px",
    display: "inline-block",
  };
  const style2 = {
    paddingLeft: "5px",
    display: "inline-block",
  };
  return (
    <div class="bg-img">
    <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/logo192.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />{" "}
            <h1 style={style2}>FAUCET</h1>
            <h3 style={style1}>
              {account ? (
                <button>
                  {account.slice(0, 5) + "....." + account.slice(38, 42)}
                </button>
              ) : (
                <button onClick={web3Handler}>Connect wallet</button>
              )}
            </h3>
            <br></br>
          </Navbar.Brand>
        </Container>
      </Navbar>
      {withdrawError && <div className="withdraw-error" style={{marginLeft:"545px"}}>{withdrawError}</div>}
      {withdrawSuccess && (
        <div className="withdraw-success" style={{marginLeft:"645px"}}>{withdrawSuccess}</div>
      )}{" "}
      <div className="box address-box">
        <div className="columns">
          <div className="column is-four-fifths">
            <input
              className="input is-medium"
              type="text"
              placeholder="Enter your wallet address (0x...)" style={{marginLeft:"600px"}}
            />
            <br></br>
            <br></br>
            <input
              className="input is-medium"
              onChange={(e) => setValue(e.target.value)}
              placeholder="Amount Needed" style={{marginLeft:"600px"}}
            />
          </div>
          <br></br>
          <div className="column">
            <Button
              className="button is-link is-medium"
              onClick={requestTokens} style={{marginLeft:"645px"}}
            >
              GET TOKENS
            </Button>
          </div>
        </div>
        <article className="panel is-grey-darker">
          <p className="panel-heading" style={{marginLeft:"645px"}}>Transaction Data</p>
          <div className="panel-block">
            <p style={{marginLeft:"435px"}}>
              {transactionData ? `Transaction hash: ${transactionData}`:"--------------------"}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default App;
