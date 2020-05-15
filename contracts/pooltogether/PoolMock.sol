pragma solidity ^0.5.0;

import "../../contracts_archive/pooltogether/pooltogether-contracts/contracts/MCDAwarePool.sol";
//import "@pooltogether/pooltogether-contracts/contracts/MCDAwarePool.sol";

contract PoolMock is MCDAwarePool {

    using SafeMath for uint;

    MCDAwarePool public pool;
    IERC20 public dai;

    constructor(address _erc20) public {
        dai = IERC20(_erc20);
    }
}
