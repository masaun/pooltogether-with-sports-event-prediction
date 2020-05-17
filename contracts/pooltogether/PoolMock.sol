pragma solidity ^0.5.12;

import "./pooltogether-contracts/contracts/MCDAwarePool.sol";


contract PoolMock is MCDAwarePool {
    using SafeMath for uint;

    IERC20 public dai;

    constructor(address _erc20) public {
        dai = IERC20(_erc20);
    }

    
    /***
     * @dev - Pool Logic for selecting winner 
     **/
    function poolLogic() public returns (bool) {
        // In progress
    }
    

    /**
     * @notice - Getter functions
     */

    
}
