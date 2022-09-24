import { useEffect, useState } from "react";
import { getBalance, withdrawFunds } from "../utils/Contract";
function Balance(props) {
  const {
    walletProvider,
    walletAddress,
    transactionCount,
    setTransactionCount,
  } = props;
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getMyBalance = async () => {
      const balance = await getBalance(walletProvider, walletAddress);
      setBalance(balance);
    };

    getMyBalance();
  }, [walletProvider, walletAddress, transactionCount]);

  const sendToWallet = async () => {
    await withdrawFunds(walletProvider, balance);
    setTransactionCount(transactionCount + 1);
  };

  return (
    <div className="pt-12">
      <div className="px-6 py-6 rounded-lg bg-white flex mx-auto max-w-lg border border-slate-100 justify-center">
        <div className="p-6 ">
          <p className="font-bold text-lg py-1">Balance</p>
          <div className="space-y-4 py-1">
            <p className="">
              Available to claim:
              <span className="font-medium"> {balance} Eth</span>
            </p>
            <button
              className="font-semibold rounded-xl drop-shadow-md uppercase px-8 py-2 bg-violet-700 text-gray-100 text-bold"
              onClick={sendToWallet}
              disabled={balance <= 0 ? true : false}
            >
              Send to wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Balance;
