var PoolMock = artifacts.require("PoolMock");

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

    await deployer.deploy(PoolMock, _erc20, { from: deployerAddress });
    // await deployer.deploy(PoolTokenMock, _erc20).then(async function(poolTokenMock) {
    //     if(ownerAddress && ownerAddress!="") {
    //         console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
    //         await poolTokenMock.transferOwnership(ownerAddress);
    //     }
    // });
};
