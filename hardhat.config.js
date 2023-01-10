require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
const privateKey=process.env.privateKey;
module.exports = {
  solidity: "0.8.17",
  networks:{
    goerli:{
      url:'https://eth-goerli.g.alchemy.com/v2/PmGZXmyPZt_bnVX9epiMqh44k1IEJybf',
      accounts:[privateKey]
    }
  }
};
