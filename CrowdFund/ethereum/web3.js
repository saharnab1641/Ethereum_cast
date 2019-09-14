import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && window.web3 !== "undefined") {
  const getProvider = async () => {
    await window.web3.currentProvider.enable();
  };
  getProvider();

  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/559e91992e7049b899da8117d506297d"
  );
  web3 = new Web3(provider);
}

export default web3;
