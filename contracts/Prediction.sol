pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

/// Inherit from `usingBandProtocol` to get access to helper functions
import { usingBandProtocol, Oracle } from "./band/band-solidity/contracts/Band.sol";

/// Own contract
import "./pooltogether/PoolMock.sol";


/***
 * @notice - This contract is that users predicts sports game score
 **/
contract Prediction is usingBandProtocol, OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    IERC20 public dai;

    constructor(address _erc20) public {
        dai = IERC20(_erc20);
    }

    /***
     * @notice - Open next and new draw of game score prediction
     **/
    function openeNextGameScorePredictionDraw(uint _drawId) public returns (bool) {
        PredictionData storage predictionData = predictionDatas[_drawId];
    }
    

    /***
     * @notice - Game score prediction
     **/
    function gameScorePrediction(
        uint _userId, 
        uint _drawId, 
        string memory _query,  /// i.e). "MLB/20190819/HOU-DET/1"
        uint _gameScore1, 
        uint _gameScore2
    ) public returns (bool) {
        /// Take apart query
        //string memory eventType;        /// i.e). "MLB"
        //string memory gameDate;         /// i.e). "20190819"
        //string memory gameMatch;        /// i.e). "HOU-DET"
        //string memory gameMatchNumber;  /// i.e). "1"

        /// Choose game score
        /// Bundling user's prediction with deposited ticket
        PredictionData storage predictionData = predictionDatas[_drawId];
        predictionData.userId = _userId;
        predictionData.drawId = _drawId;
        predictionData.gameOverview = _query; 
        predictionData.gameScore1 = _gameScore1;
        predictionData.gameScore2 = _gameScore2;
        predictionData.timestamp = now;

        emit GameScorePrediction(predictionData.userId,
                                 predictionData.drawId,
                                 predictionData.gameOverview,
                                 predictionData.gameScore1,
                                 predictionData.gameScore2,
                                 predictionData.timestamp);
    }

    /***
     * @notice - Get result and identify winners and distribute reward 
     **/
    function getResultOfGameScore(address _poolMock, uint _drawId, bytes32 _secret, bytes32 _salt) public payable returns (uint8 _gameScore1, uint8 _gameScore2) {
        /// Call result of game score via Oracle
        uint8 _gameScore1;
        uint8 _gameScore2;
        (_gameScore1, _gameScore2) = oracleQueryScore();

        /// Count participants of specified drawId
        PoolMock poolMock = PoolMock(_poolMock);
        uint currentOpenDrawId = poolMock.getCurrentOpenDrawId();

        /// Identify winners in all participants of specified drawId
        for (uint i=1; i < currentOpenDrawId.add(1); i++) {
            PredictionData memory predictionData = predictionDatas[_drawId];
        }

        return (gameScore1, gameScore2);
    }

    /***
     * @notice - Oracle by using Band-Protocol
     **/
    function getQueryPrice() public view returns (uint256 queryPrice) {
        /// Get the price of querying for one data point (in Wei)
        uint256 queryPrice = SPORT.queryPrice();
        return queryPrice;
    }
    
    function oracleQuerySpotPrice() public payable {
        /// Get the most-up-to-date ETH/USD rate
        uint256 ethUsdPrice = FINANCIAL.querySpotPrice("ETH-USD");
        emit OracleQuerySpotPrice(ethUsdPrice);
    }

    function oracleQuerySpotPriceWithExpiry() public payable {
        /// Get the most-up-to-date ETH/USD rate. Must not be older than 10 mins.
        uint256 ethUsdPrice = FINANCIAL.querySpotPriceWithExpiry("ETH-USD", 10 minutes);
        emit OracleQuerySpotPriceWithExpiry(ethUsdPrice);
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
     * @dev - Get balance
     **/
    function balanceOfContract() public view returns (uint balanceOfContract_DAI, uint balanceOfContract_ETH) {
        return (dai.balanceOf(address(this)), address(this).balance);
    }

    /***
     * @dev - Getter functions
     **/
    function getCurrentOpenDrawIdPredictionContract(address _poolMock) public view returns (uint currentOpenDrawId_PredictionContract) {
        /// Count participants of specified drawId
        PoolMock poolMock = PoolMock(_poolMock);
        uint currentOpenDrawId = poolMock.getCurrentOpenDrawId();

        return currentOpenDrawId;
    }


}
