import React from 'react';
import './App.css';

function App() {
  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Current balance: <strong> 2 </strong> ETH
        </div>
        <button className="btn mr-2" type="button">
          Donate
        </button>
        <button className="btn" type="button">
          Withdraw
        </button>
      </div>
    </div>
  );
}

export default App;
