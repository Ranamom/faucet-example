import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'

function App() {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
  });
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()

      if (provider) {
        // @ts-ignore
        setWeb3Api({
          // @ts-ignore
          web3: new Web3(provider),
          // @ts-ignore
          provider
        })
      } else {
        console.error("Please, install Metamask.")
      }
    };
    loadProvider();
  }, []);

  const getAccount = useCallback(async() => {
    // @ts-ignore
    const accounts = await web3Api.web3.eth.getAccounts();
    setAccount(accounts[0]);
  }, [web3Api.web3])

  useEffect(() => {
    web3Api.web3 && getAccount()
  }, [web3Api.web3, getAccount])

  const handleConnectWallet = useCallback(async() => {
    // @ts-ignore
    await web3Api.provider.request({method: "eth_requestAccounts"});
    getAccount();
  }, [getAccount, web3Api.provider])

  return (
    <div 
      className="faucet-wrapper" 
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div className="faucet">
        <div>
          <span>
            <strong className="mr-2">Account: </strong>
          </span>
          {account ?
            <div>{account}</div> 
          :
            <button
              className="button is-small"
              onClick={() => {handleConnectWallet()}}
            >
              Connect Wallet
            </button>
          }
        </div>
        <div className="balance-view is-size-2 my-4">
          Current balance: <strong> 2 </strong> ETH
        </div>
        <button className="button is-link mr-2 is-light">
          Donate
        </button>
        <button className="button is-primary is-light">
          Withdraw
        </button>
      </div>
    </div>
  );
}

export default App;
