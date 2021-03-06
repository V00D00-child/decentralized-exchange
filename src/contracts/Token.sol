// SPDX-License-Identifier: MIT
// ----------------------------------------------------------------------------
// 'FIXED' 'DollHair Token' token contract
//
// Symbol      : DOLL
// Name        : DollHair Token
// Total supply: 1,000,000.000000000000000000
// Decimals    : 18
//
// Enjoy.
//
// ---------------------------------------------------------------------------- 
// ----------------------------------------------------------------------------
// Updated     : To support Solidity version 0.5.0
// Programmer  : Idris Bowman (www.idrisbowman.com)
// Link        : https://idrisbowman.com
// Tested      : Locally with chai 15 July 2021
// ----------------------------------------------------------------------------

pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

// ----------------------------------------------------------------------------
// ERC20 Token, with the addition of symbol, name and decimals and a fixed supply
// https://en.bitcoinwiki.org/wiki/ERC20
// ----------------------------------------------------------------------------
contract Token {
    using SafeMath for uint;

    // State variables
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() public {
        name = "DollHair Token";
        symbol = "DOLL";
        decimals = 18;
        totalSupply = 1000000 * (10 ** uint(decimals));
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0));
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require( _value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender]= allowance[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }
}