pragma solidity ^0.5.12;

import "./pooltogether-contracts/contracts/MCDAwarePool.sol";

/// Storage
import "../storage/McStorage.sol";
import "../storage/McConstants.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
import { usingBandProtocol, Oracle } from "../band/band-solidity/contracts/Band.sol";

/// Own contract
import "../Prediction.sol";


contract PoolMock is usingBandProtocol, MCDAwarePool, McStorage, McConstants {  /// MCDAwarePool inherits BasePool.sol 
    using SafeMath for uint;

    IERC20 public dai;
    ICErc20 public cDai;
    Prediction public prediction;    

    address payable PREDICTION;

    constructor(address _erc20, address _cErc20, address payable _prediction) public {
        dai = IERC20(_erc20);
        cDai = ICErc20(_cErc20);
        prediction = Prediction(_prediction);

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
     * @notice - Temporary account for deposit DAI temporarily
     **/
    function depositIntoTemporaryAccount(uint _depositAmount) public returns (bool) {
        /// All amount are deposited into contract temporarily
        dai.transferFrom(msg.sender, address(this), _depositAmount);

        /// Set expiration until the end of the gameday
    }

    /***
     * @notice - Deposit DAI into Pool(=this contract)
     **/
    function _depositPool(uint _depositAmount) public returns (bool) {
        depositPool(_depositAmount);  // Delegate call of depositPool() in BasePool.sol
    }
    
    /***
     * @notice - Distribute DAI into winner's wallet address
     * @param _secret The secret to reveal for the current committed Draw
     * @param _salt The salt that was used to conceal the secret
     **/
    function _reward(bytes32 _secret, bytes32 _salt) public payable {
        /// Get result and identify winners and distribute reward which is inherited from Prediction.sol
        uint8 gameScore1;
        uint8 gameScore2;
        address _poolMock = address(this);
        uint _drawId = getCurrentCommittedDrawId();
        (gameScore1, gameScore2) = getResultOfGameScore(_poolMock, _drawId, _secret, _salt);
        //(gameScore1, gameScore2) = prediction.getResultOfGameScore(_poolMock, _drawId, _secret, _salt);

        /// Lock tokens
        lockTokens();

        /// Delegate call of reward() in BasePool.sol
        reward(_secret, _salt);        
    }

    /***
     * @notice - Get result and identify winners and distribute reward 
     **/
    function getResultOfGameScore(
        address _poolMock, 
        uint _drawId, 
        bytes32 _secret, 
        bytes32 _salt
    ) public payable returns (uint8 _gameScore1, uint8 _gameScore2) {
        /// Call result of game score via Oracle
        uint8 _gameScore1;
        uint8 _gameScore2;
        (_gameScore1, _gameScore2) = oracleQueryScore();

        /// Count participants of specified drawId
        uint currentCommittedDrawId = getCurrentCommittedDrawId();

        /// Identify winners in all participants of specified drawId
        require (currentCommittedDrawId >= 1, "currentCommittedDrawId must be more than 1");
        for (uint i=1; i <= prediction.getCountOfPredictionData(currentCommittedDrawId); i++) {
            PredictionData memory predictionData = predictionDatas[i];
        }

        return (_gameScore1, _gameScore2);
    }

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
    
    
}
