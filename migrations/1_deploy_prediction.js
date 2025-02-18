var Prediction = artifacts.require("Prediction");
//var PoolMock = artifacts.require("PoolMock");
var IERC20 = artifacts.require("IERC20");

//@dev - Import from exported file
var contractAddressList = require('./contractAddress/contractAddress.js');
var tokenAddressList = require('./tokenAddress/tokenAddress.js');
var walletAddressList = require('./walletAddress/walletAddress.js');

const _erc20 = tokenAddressList["Kovan"]["DAI"];     // DAI address on Kovan
//const _poolMock = PoolMock.address;

const depositedAmount = web3.utils.toWei("0.15");    // 0.15 DAI which is deposited in deployed contract. 

module.exports = async function(deployer, network, accounts) {
    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    await deployer.deploy(Prediction, _erc20).then(async function(prediction) {
        if(ownerAddress && ownerAddress!="") {
            console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
            await prediction.transferOwnership(ownerAddress);
        }
    });

    //@dev - Transfer 0.15 DAI from deployer's address to contract address in advance
    const prediction = await Prediction.deployed();
    const iERC20 = await IERC20.at(_erc20);
    await iERC20.transfer(prediction.address, depositedAmount);
};
