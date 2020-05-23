pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

// Use original Ownable.sol
import "./lib/OwnableOriginal.sol";

// Storage
import "./storage/McStorage.sol";
import "./storage/McConstants.sol";

// Own contract
import "./pooltogether/PoolMock.sol";


/***
 * @notice - This contract is that ...
 **/
contract Prediction is OwnableOriginal(msg.sender), McStorage, McConstants {
    using SafeMath for uint;

    IERC20 public dai;
    PoolMock public poolMock;

    constructor(address _erc20, address _poolMock) public {
        dai = IERC20(_erc20);
        poolMock = PoolMock(_poolMock);
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
        Prediction storage prediction = predictions[_drawId];
        prediction.userId = _userId;
        prediction.drawId = _drawId;
        prediction.gameOverview = _query; 
        prediction.gameScore1 = _gameScore1;
        prediction.gameScore2 = _gameScore2;
        prediction.timestamp = now;

        emit GameScorePrediction(prediction.userId,
                                 prediction.drawId,
                                 prediction.gameOverview,
                                 prediction.gameScore1,
                                 prediction.gameScore2,
                                 prediction.timestamp);
    }

    /***
     * @notice - Get result and identify winners and distribute reward 
     **/
    function getResultOfGameScore(uint _drawId, bytes32 _secret, bytes32 _salt) public returns (bool) {
        /// Call result of game score via Oracle
        uint8 gameScore1;
        uint8 gameScore2;
        (gameScore1, gameScore2) = poolMock.oracleQueryScore();

        /// Identify winners in all participants of specified drawId
        for (uint i=1; i < 10; i++) {
            Prediction memory prediction = predictions[_drawId];
        }

        /// Distribute reward for winners
        poolMock._reward(_secret, _salt);
    }


    /***
     * @dev - Get balance
     **/
    function balanceOfContract() public view returns (uint balanceOfContract_DAI, uint balanceOfContract_ETH) {
        return (dai.balanceOf(address(this)), address(this).balance);
    }

}
