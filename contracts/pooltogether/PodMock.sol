pragma solidity ^0.5.0;

import "./pods/contracts/Pod.sol";

contract PodMock is Pod {

    using SafeMath for uint;

    IERC20 public dai;

    constructor(address _erc20) public {
        dai = IERC20(_erc20);
    }

    function _balanceOfUnderlying(address _user) public returns (uint256) {
        return balanceOfUnderlying(_user);  // Inherited from Pod.sol
    }

    function _balanceOf(address _tokenHolder) public view returns (uint256) {
        return balanceOf(_tokenHolder);
    }
    
}
