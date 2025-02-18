pragma solidity ^0.5.12;

import "./pooltogether-contracts/contracts/RecipientWhitelistPoolToken.sol";


contract PoolTokenMock is RecipientWhitelistPoolToken {
    using SafeMath for uint;

    IERC20 public dai;

    constructor(address _erc20) public {
        dai = IERC20(_erc20);
    }


    function initPoolToken(
        string memory _name,
        string memory _symbol,
        address[] memory _defaultOperators,
        BasePool _pool  // Target Pool which publish PoolToken <= Contract address of PoolDAI（MCDAwarePool.sol）
    ) public returns (bool) {
        init(_name, _symbol, _defaultOperators, _pool);  // init() of PoolToken.sol
    }

  


    /**
     * @notice - Getter functions
     */
    function getBasePool() public view returns (BasePool) {
        pool();  // pool() of PoolToken.sol
    }
    
}
