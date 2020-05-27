var RewardManager = artifacts.require("RewardManager");
var Prediction = artifacts.require("Prediction");
var Blocklock = artifacts.require("Blocklock");
var DrawManager = artifacts.require("DrawManager");
var FixidityLib = artifacts.require("FixidityLib");
var SortitionSumTreeFactory = artifacts.require("SortitionSumTreeFactory");

//@dev - Import from exported file
var contractAddressList = require('./contractAddress/contractAddress.js');
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

var _prediction = Prediction.address;

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
    await deployer.link(Blocklock, RewardManager);
    await deployer.link(DrawManager, RewardManager);
    await deployer.link(FixidityLib, RewardManager);

    await deployer.deploy(RewardManager, _prediction).then(async function(rewardManager) {
        if(ownerAddress && ownerAddress!="") {
            console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
            await rewardManager.transferOwnership(ownerAddress);
        }
    });
};
