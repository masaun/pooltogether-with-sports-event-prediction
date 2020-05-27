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
