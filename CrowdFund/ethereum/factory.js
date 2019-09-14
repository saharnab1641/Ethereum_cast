import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x1C6f324Da0E6000e1E7b09F4c7e33516477C5c2e"
);

export default instance;
