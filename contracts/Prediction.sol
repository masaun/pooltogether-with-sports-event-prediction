pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

/// Own contract
import "./pooltogether/PoolMock.sol";


/***
 * @notice - This contract is that users predicts sports game score
 **/
contract Prediction is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    uint currentPredictionId = 1;  /// Current prediction ID start from 1

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
        address _poolMock,
        address _userAddress, 
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

        /// Count participants of specified drawId
        PoolMock poolMock = PoolMock(_poolMock);
        uint _drawId = poolMock.getCurrentCommittedDrawId();

        /// Create userId
        bytes32 _userId = bytes32(uint256(_userAddress));

        /// Choose game score
        /// Bundling user's prediction with deposited ticket
        PredictionData storage predictionData = predictionDatas[currentPredictionId];
        predictionData.predictionId = currentPredictionId;
        predictionData.userId = _userId;
        predictionData.drawId = _drawId;   /// assign currentOpenDrawId
        predictionData.gameOverview = _query; 
        predictionData.gameScore1 = _gameScore1;
        predictionData.gameScore2 = _gameScore2;
        predictionData.timestamp = now;

        emit GameScorePrediction(predictionData.predictionId,
                                 predictionData.userId,
                                 predictionData.drawId,
                                 predictionData.gameOverview,
                                 predictionData.gameScore1,
                                 predictionData.gameScore2,
                                 predictionData.timestamp);
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
    function getCountOfPredictionData(uint _drawId) public view returns (uint _countOfPredictionData) {
        uint countOfPredictionData;
        for (uint i=1; i <= currentPredictionId; i++) {
            PredictionData memory predictionData = predictionDatas[i];
            if (predictionData.drawId == _drawId) {
                countOfPredictionData++;
            }
        }
        return countOfPredictionData;
    }

    function getCurrentDrawId(address _poolMock) public view returns (uint currentOpenDrawId, uint currentCommittedDrawId) {
        /// Count participants of specified drawId
        PoolMock poolMock = PoolMock(_poolMock);
        uint currentOpenDrawId = poolMock.getCurrentOpenDrawId();
        uint currentCommittedDrawId = poolMock.getCurrentCommittedDrawId();

        return (currentOpenDrawId, currentCommittedDrawId);
    }


}
