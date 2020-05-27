var PoolTokenMock = artifacts.require("PoolTokenMock");
var Blocklock = artifacts.require("Blocklock");
var DrawManager = artifacts.require("DrawManager");
var FixidityLib = artifacts.require("FixidityLib");
var SortitionSumTreeFactory = artifacts.require("SortitionSumTreeFactory");


//@dev - Import from exported file
var contractAddressList = require('./contractAddress/contractAddress.js');
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const _erc20 = tokenAddressList["Kovan"]["DAI"];     // DAI address on Kovan


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
    await deployer.link(Blocklock, PoolTokenMock);
    await deployer.link(DrawManager, PoolTokenMock);
    await deployer.link(FixidityLib, PoolTokenMock);

    await deployer.deploy(PoolTokenMock, _erc20, { from: deployerAddress });
    // await deployer.deploy(PoolTokenMock, _erc20).then(async function(poolTokenMock) {
    //     if(ownerAddress && ownerAddress!="") {
    //         console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
    //         await poolTokenMock.transferOwnership(ownerAddress);
    //     }
    // });
};
