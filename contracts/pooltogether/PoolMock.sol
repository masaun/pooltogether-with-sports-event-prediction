pragma solidity ^0.5.12;

import "./pooltogether-contracts/contracts/MCDAwarePool.sol";

// Use original Ownable.sol
import "../lib/OwnableOriginal.sol";

/// Storage
import "../storage/McStorage.sol";
import "../storage/McConstants.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
import { usingBandProtocol, Oracle } from "../band/band-solidity/contracts/Band.sol";

/// Own contract
import "../Prediction.sol";
import "../RewardManager.sol";
import "../OracleManager.sol";


contract PoolMock is usingBandProtocol, MCDAwarePool, OwnableOriginal(msg.sender), McStorage, McConstants {  /// MCDAwarePool inherits BasePool.sol 
    using SafeMath for uint;

    IERC20 public dai;
    ICErc20 public cDai;
    Prediction public prediction;
    RewardManager public rewardManager;
    OracleManager public oracleManager;

    address payable PREDICTION;

    constructor(address _erc20, address _cErc20, address payable _prediction, address payable _rewardManager, address payable _oracleManager) public {
        dai = IERC20(_erc20);
        cDai = ICErc20(_cErc20);
        prediction = Prediction(_prediction);
        rewardManager = RewardManager(_rewardManager);
        oracleManager = OracleManager(_oracleManager);

        PREDICTION = _prediction;
    }

    function _openNextDraw(bytes32 _nextSecretHash) public {
        /// Open Pool
        openNextDraw(_nextSecretHash);

        /// Open next and new draw of game score prediction which is inherited from Prediction.sol
        uint _drawId = getCurrentOpenDrawId();
        prediction.openeNextGameScorePredictionDraw(_drawId);
    }

    /***
     * @notice - Deposit DAI into Pool(=this contract)
     **/
    function _depositPool(uint _depositAmount) public returns (bool) {
        depositPool(_depositAmount);  // Delegate call of depositPool() in BasePool.sol
    }
    
    /***
     * @notice - Distribute DAI into winner's wallet address
     * @notice - Extended contract of reward() in BasePool.sol
     * @param _secret The secret to reveal for the current committed Draw
     * @param _salt The salt that was used to conceal the secret
     **/
    function selectWinnerAndDistributeReward(bytes32 _secret, bytes32 _salt, uint8 _gameScore1, uint8 _gameScore2) public {
        /// Add a right of "Pool/Admin" to this contract(address(this))

        /// Call the extendedReward method instead of the reward method
        rewardManager.extendedReward(_secret, _salt, _gameScore1, _gameScore2);
    }


    /***
     * @notice - Extended contract of reward() in BasePool.sol
     * @param _secret The secret to reveal for the current committed Draw
     * @param _salt The salt that was used to conceal the secret
     **/
    function extendedReward(bytes32 _secret, bytes32 _salt, uint8 _gameScore1, uint8 _gameScore2) public {
        /// Check game score
        Prediction prediction = Prediction(PREDICTION);
        for (uint i=1; i < prediction.getCurrentPredictionId(); i++) {
            PredictionData memory predictionData = predictionDatas[i];
        }

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

    /**
     * @notice - Getter functions
     */
    function getCurrentOpenDrawId() public view returns (uint _currentOpenDrawId) {
        /// Inherited from BasePool.sol
        return currentOpenDrawId();
    }

    function getCurrentCommittedDrawId() public view returns (uint _currentCommittedDrawId) {
        /// Inherited from BasePool.sol
        return currentCommittedDrawId();        
    }
    

    function balanceOfPoolMockContract() public view returns (address poolMockContractAddress, uint balanceOfPoolMockContract_DAI, uint balanceOfPoolMockContract_cDAI, uint balanceOfPoolMockContract_ETH) {
        address _poolMockContractAddress = getContractAddress();
        return (_poolMockContractAddress, dai.balanceOf(address(this)), cDai.supplyRatePerBlock(), address(this).balance);
    }    

    function getContractAddress() public view returns (address poolMockContractAddess) {
        return address(this);
    }
    

    /***
     * @notice - Test method / Temporary account for deposit DAI temporarily
     **/
    function depositIntoTemporaryAccount(uint _depositAmount) public returns (bool) {
        /// All amount are deposited into contract temporarily
        dai.transferFrom(msg.sender, address(this), _depositAmount);

        /// Set expiration until the end of the gameday
    }
    
}
