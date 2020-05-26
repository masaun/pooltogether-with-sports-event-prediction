pragma solidity ^0.5.12;

import "./pooltogether/pooltogether-contracts/contracts/MCDAwarePool.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";

/// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
import { usingBandProtocol, Oracle } from "./band/band-solidity/contracts/Band.sol";

/// Own contract
import "./pooltogether/PoolMock.sol";


contract RewardManager is usingBandProtocol, MCDAwarePool, OwnableOriginal(msg.sender), McStorage, McConstants {  /// MCDAwarePool inherits BasePool.sol 

    constructor() public {}

    /***
     * @notice - Oracle by using Band-Protocol
     **/
    function getQueryPrice() public view returns (uint256 queryPrice) {
        /// Get the price of querying for one data point (in Wei)
        uint256 queryPrice = SPORT.queryPrice();
        return queryPrice;
    }

    function oracleQueryScore() public payable returns (uint8 gameScore1, uint8 gameScore2) {
        /// 1st MLB match of the Astros vs the Tigers on August 19, 2019
        uint8 res1;
        uint8 res2;
        (res1, res2) = SPORT.queryScore("MLB/20190819/HOU-DET/1");
        emit OracleQueryScore(res1, res2);
        return (res1, res2);
    }



    /***
     * @notice - Extended contract of reward() in BasePool.sol
     **/
    function extendedReward(bytes32 _secret, bytes32 _salt) public {        
        /// Lock tokens
        lockTokens();

        /// Copy
        blocklock.unlock(block.number);

        // require that there is a committed draw
        // require that the committed draw has not been rewarded
        uint256 drawId = currentCommittedDrawId();

        Draw storage draw = draws[drawId];

        require(draw.secretHash == keccak256(abi.encodePacked(_secret, _salt)), "Pool/bad-secret");

        // derive entropy from the revealed secret
        bytes32 entropy = keccak256(abi.encodePacked(_secret));

        // Select the winner using the hash as entropy
        address winningAddress;
        //address winningAddress = calculateWinner(entropy);
        if (calculateWinner(entropy) != address(0)) {  /// Need to change this condition. Now it just define that condition so far.
            winningAddress = calculateWinner(entropy);
        } else {
            entropy = keccak256(abi.encodePacked(_secret));
        }


        // Calculate the gross winnings
        uint256 underlyingBalance = balance();

        uint256 grossWinnings;

        // It's possible when the APR is zero that the underlying balance will be slightly lower than the accountedBalance
        // due to rounding errors in the Compound contract.
        if (underlyingBalance > accountedBalance) {
          grossWinnings = capWinnings(underlyingBalance.sub(accountedBalance));
        }

        // Calculate the beneficiary fee
        uint256 fee = calculateFee(draw.feeFraction, grossWinnings);

        // Update balance of the beneficiary
        balances[draw.feeBeneficiary] = balances[draw.feeBeneficiary].add(fee);

        // Calculate the net winnings
        uint256 netWinnings = grossWinnings.sub(fee);

        draw.winner = winningAddress;
        draw.netWinnings = netWinnings;
        draw.fee = fee;
        draw.entropy = entropy;

        // If there is a winner who is to receive non-zero winnings
        if (winningAddress != address(0) && netWinnings != 0) {
          // Updated the accounted total
          accountedBalance = underlyingBalance;

          // Update balance of the winner
          balances[winningAddress] = balances[winningAddress].add(netWinnings);

          // Enter their winnings into the open draw
          drawState.deposit(winningAddress, netWinnings);

          callRewarded(winningAddress, netWinnings, drawId);
        } else {
          // Only account for the fee
          accountedBalance = accountedBalance.add(fee);
        }

        emit Rewarded(
          drawId,
          winningAddress,
          entropy,
          netWinnings,
          fee
        );
        emit FeeCollected(draw.feeBeneficiary, fee, drawId);
    }
    
}
