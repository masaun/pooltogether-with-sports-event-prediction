var RewardManager = artifacts.require("RewardManager");

module.exports = async function(deployer, network, accounts) {
    // Initialize owner address if you want to transfer ownership of contract to some other address
    let ownerAddress = walletAddressList["WalletAddress1"];

    await deployer.deploy(RewardManager, _erc20).then(async function(rewardManager) {
        if(ownerAddress && ownerAddress!="") {
            console.log(`=== Transfering ownerhip to address ${ownerAddress} ===`)
            await rewardManager.transferOwnership(ownerAddress);
        }
    });
};
