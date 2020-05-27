var OracleManager = artifacts.require("OracleManager");
var Prediction = artifacts.require("Prediction");
var Blocklock = artifacts.require("Blocklock");
var DrawManager = artifacts.require("DrawManager");
var FixidityLib = artifacts.require("FixidityLib");
var SortitionSumTreeFactory = artifacts.require("SortitionSumTreeFactory");
var Prediction = artifacts.require("Prediction");
var RewardManager = artifacts.require("RewardManager");

//@dev - Import from exported file
var contractAddressList = require('./contractAddress/contractAddress.js');
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const _prediction = Prediction.address;

module.exports = async function(deployer, network, accounts) {
    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    // Deploy library and then link library with another library
    await deployer.deploy(SortitionSumTreeFactory);
    await deployer.link(SortitionSumTreeFactory, DrawManager);

    // Deploy library and then link library with contract    
    await deployer.deploy(Blocklock);
    await deployer.deploy(DrawManager);
    await deployer.deploy(FixidityLib);
    await deployer.link(Blocklock, OracleManager);
    await deployer.link(DrawManager, OracleManager);
    await deployer.link(FixidityLib, OracleManager);

    await deployer.deploy(OracleManager, _prediction).then(async function(oracleManager) {
        if(ownerAddress && ownerAddress!="") {
            console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
            await oracleManager.transferOwnership(ownerAddress);
        }
    });
};
