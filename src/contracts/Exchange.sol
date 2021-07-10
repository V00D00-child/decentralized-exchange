// SPDX-License-Identifier: MIT
// ----------------------------------------------------------------------------
// 'FIXED' 'Auth Token' token contract
//
// Symbol      : AUTH
// Name        : Auth Token
// Total supply: 1,000,000.000000000000000000
// Decimals    : 18
//
// Enjoy.
//
// (c) BokkyPooBah / Bok Consulting Pty Ltd 2018. The MIT Licence.
// ---------------------------------------------------------------------------- 
// ----------------------------------------------------------------------------
// Updated     : To support Solidity version 0.5.0
// Programmer  : Idris Bowman (www.idrisbowman.com)
// Link        : https://github.com/
// Tested      : Remix IDE, 10 Nov 2020

// Desosit @ Withdraw Funds
// Manage Orders - Make or Cancel
// Handele Trade  - Charge fees

// TODO:
// [x] Set the fee account
// [x] Deposit Ether
// [x] Withdraw Ether
// [x] Deposit tokens
// [x] Withdraw tokens
// [x] Check blances
// [] Make order
// [] Cancel order
// [] Fill order
// [] Charge fees
// ----------------------------------------------------------------------------

pragma solidity ^0.5.0;
import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Exchange {
    using SafeMath for uint;

    address public feeAccount; // The account that receives echange fees
    uint256 public feePercent; 
    address constant ETHER = address(0); // store ether in tokens mapping with blank address
    mapping(address => mapping(address => uint256)) public tokens; // {tokenAddress -> userAddress-> amount}
    
    // Events
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint amount, uint balance);

    constructor(address _feeAcount, uint256 _feePercent) public{
        feeAccount = _feeAcount;
        feePercent = _feePercent;
    }

    // Fallback: revert if Ether is sent to this smart contract by mistake
    function() external {
        revert();
    }

    function depositEther() payable public {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function withdrawEther(uint _amount) payable public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        msg.sender.transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint _amount) public {
        // Don't allow Ether deposits
        require(_token != ETHER);

        // Which token? Send tokens to this contract
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        
        // Manage deposit - update balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        
        // Emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        require(Token(_token).transfer((msg.sender), _amount));
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user) public view returns (uint256) {
        return tokens[_token][_user];
    }
}