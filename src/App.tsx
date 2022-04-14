import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState<any>({
    web3: null,
    provider: null,
    isProviderLoaded: false,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false)

  //const reloadEffect = () => reload(!shouldReload);
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);
  const setAccountListener = (provider: any) => {
    provider.on("accountsChanged", (accounts: any) => setAccount(accounts[0]));
    provider.on("chainChanged", (_: any) => window.location.reload());
  }
  const canConnectToContract = account && web3Api.contract;

  useEffect(() => {
    const loadProvider = async () => {
      const provider: any = await detectEthereumProvider();

      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      } else {
        setWeb3Api({isProviderLoaded: true});
        console.error("Please, install Metamask.");
      }
    };
    loadProvider();
  }, []);

  const getAccount = useCallback(async() => {
    const accounts = await web3Api.web3.eth.getAccounts();
    setAccount(accounts[0]);
  }, [web3Api.web3])

  useEffect(() => {
    web3Api.web3 && getAccount()
  }, [web3Api.web3, getAccount])

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }

    web3Api.contract && loadBalance()
    reload(false);
  }, [web3Api, shouldReload])

  const handleConnectWallet = useCallback(async() => {
    await web3Api.provider.request({method: "eth_requestAccounts"});
    //getAccount();
  }, [web3Api.provider])

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })
    reloadEffect()
  }, [web3Api, account, reloadEffect]);

  const withdrawFunds = async () => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3.utils.toWei("0.1", "ether")
    await contract.withdraw(withdrawAmount, {
      from: account
    })
    reloadEffect()
  };

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
        {web3Api.isProviderLoaded ?
          <div>
            <span>
              <strong className="mr-2">Account: </strong>
            </span>
            {account ?
              <div>{account}</div> 
            :
            !web3Api.provider ?
              <>
                <div className="notification is-warning is-size-6 is-rounded">
                  Wallet is not detected!{` `}
                  <a target="_blank" href="https://docs.metamask.io" rel="noreferrer">
                    Install Metamask
                  </a>
                </div>
              </>
            :
              <button
                className="button is-small"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </button>
            }
          </div>
        :
          <span>Looking for Web3...</span>
        }
        <div className="balance-view is-size-2 my-4">
          Current balance: <strong> {balance} </strong> ETH
        </div>
        {!canConnectToContract &&
          <i className="is-block mb-2">
            Connect to Ganache
          </i>
        }
        <button
          className="button is-link mr-2 is-light"
          disabled={!canConnectToContract}
          onClick={addFunds}
        >
          Donate 1 ETH
        </button>
        <button
          className="button is-primary is-light"
          disabled={!canConnectToContract}
          onClick={withdrawFunds}
        >
          Withdraw 0.1 ETH
        </button>
      </div>
    </div>
  );
}

export default App;
