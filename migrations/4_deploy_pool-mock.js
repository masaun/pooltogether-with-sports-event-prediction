var PoolMock = artifacts.require("PoolMock");
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

const _erc20 = tokenAddressList["Kovan"]["DAI"];     // DAI address on Kovan
const _cErc20 = tokenAddressList["Kovan"]["cDAI"];     // DAI address on Kovan
const _prediction = Prediction.address;
const _rewardManager = RewardManager.address;

module.exports = async function(deployer, network, accounts) {
    // Deployer address
    let deployerAddress = accounts[0];

    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    // Deploy library and then link library with another library
    await deployer.deploy(SortitionSumTreeFactory);
    await deployer.link(SortitionSumTreeFactory, DrawManager);

    // Deploy library and then link library with contract    
    await deployer.deploy(Blocklock);
    await deployer.deploy(DrawManager);
    await deployer.deploy(FixidityLib);
    await deployer.link(Blocklock, PoolMock);
    await deployer.link(DrawManager, PoolMock);
    await deployer.link(FixidityLib, PoolMock);

    //await deployer.deploy(PoolMock, _erc20, _cErc20, _prediction, _rewardManager, { from: deployerAddress });
    await deployer.deploy(PoolMock, _erc20, _cErc20, _prediction, _rewardManager).then(async function(poolMock) {
        if(ownerAddress && ownerAddress!="") {
            console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
            await poolMock.transferOwnership(ownerAddress);
        }
    });
};
