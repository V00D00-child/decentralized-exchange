import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';
import { 
    web3Selector,
    exchangeSelector,
    tokenSelector,
    accountSelector,
    tokenBalanceSelector,
    etherBalanceSelector,
    exchangeEtherBalanceSelector,
    exchangeTokenBalanceSelector,
    balancesLoadingSelector,
    etherDepositAmountSelector,
    etherWithdrawAmountSelector,
    tokenDepositAmountSelector,
    tokenWithdrawAmountSelector
} from '../store/selectors';
import Spinner from './Spinner';
import { 
    loadBalances,
    depositEther,
    withdrawEther,
    withdrawToken,
    depositToken 
} from '../store/interaction';
import { 
    etherDepositAmountChanged, 
    etherWithdrawAmountChanged,
    tokenDepositAmountChanged,
    tokenWithdrawAmountChanged
} from '../store/actions'

const showForm = (props) => {
    const {
        etherBalance,
        tokenBalance,
        exchangeEtherBalance,
        exchangeTokenBalance,
        dispatch,
        etherDepositAmount,
        etherWithdrawAmount,
        tokenDepositAmount,
        tokenWithdrawAmount,
        exchange,
        account,
        web3,
        token
    } =  props;

    return (
        <Tabs defaultActiveKey="deposit" className="bg-dark text-white">

            <Tab eventKey="deposit" title="Deposit" className="bg-dark">
                <table className="table table-dark table-sm small">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th> 
                            <th>Exhange</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ETH</td>
                            <td>{etherBalance}</td>
                            <td>{exchangeEtherBalance}</td>
                        </tr>
                    </tbody>
                </table>
                {/* Deposit ether form */}
                <form className="row" onSubmit={(event) => {
                    event.preventDefault();
                    depositEther(dispatch, exchange, web3, token, etherDepositAmount, account);
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input
                            type="text"
                            placeholder= "ETH Amount"
                            onChange={(e) => dispatch(etherDepositAmountChanged(e.target.value))}
                            className="form-control form-control-sm bg-dark text-white"
                            required/>
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                    </div>
                </form>

                <table className="table table-dark table-sm small">                   
                    <tbody>
                        <tr>
                            <td>DOLL</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>
                {/* Deposit DollHair token form */}
                <form className="row" onSubmit={(event) => {
                    event.preventDefault();
                    depositToken(dispatch, exchange, web3, token, tokenDepositAmount, account);
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input
                            type="text"
                            placeholder= "DOLL Amount"
                            onChange={(e) => dispatch(tokenDepositAmountChanged(e.target.value))}
                            className="form-control form-control-sm bg-dark text-white"
                            required/>
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                    </div>
                </form>
            </Tab>

            <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">
                <table className="table table-dark table-sm small">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th> 
                            <th>Exhange</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ETH</td>
                            <td>{etherBalance}</td>
                            <td>{exchangeEtherBalance}</td>
                        </tr>
                    </tbody>
                </table>
                {/* Withdraw ether form */}
                <form className="row" onSubmit={(event) => {
                    event.preventDefault();
                    withdrawEther(dispatch, exchange, web3, etherWithdrawAmount, account);
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input
                            type="text"
                            placeholder= "ETH Amount"
                            onChange={(e) => dispatch(etherWithdrawAmountChanged(e.target.value))}
                            className="form-control form-control-sm bg-dark text-white"
                            required/>
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
                    </div>
                </form>

                <table className="table table-dark table-sm small">                   
                    <tbody>
                        <tr>
                            <td>DOLL</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>
                {/* Withdraw DollHair token form */}
                <form className="row" onSubmit={(event) => {
                    event.preventDefault();
                    withdrawToken(dispatch, exchange, web3, token, tokenWithdrawAmount, account);
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input
                            type="text"
                            placeholder= "DOLL Amount"
                            onChange={(e) => dispatch(tokenWithdrawAmountChanged(e.target.value))}
                            className="form-control form-control-sm bg-dark text-white"
                            required/>
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
                    </div>
                </form>
            </Tab>
        </Tabs>
    )
}

class Balance extends Component {
    componentDidMount() {
        const interval = setInterval(function() { 
            if(this.props.account) {
                this.loadBlockchainData(); 
                clearInterval(interval);
                return;
            }
        }.bind(this), 10);
    }

    async loadBlockchainData() {
        const { dispatch, web3, exchange, token, account} = this.props;
        try {
          await loadBalances(dispatch, web3, exchange, token, account);
        } catch(err) {
          console.log(err);
        }
    }

    render() {
        return (
            <div className="vertical">
                <div className="card bg-dark text-white">
                    <div className="card-header">
                        Balance
                    </div>
                    <div className="card-body">
                       { this.props.showForm ? showForm(this.props): <Spinner />}
                    </div>
                </div> 
            </div>
                  
        )
    }
}

function mapStateToProps(state) {
    const balancesLoading = balancesLoadingSelector(state);
    return {
        web3: web3Selector(state),
        exchange: exchangeSelector(state),
        token: tokenSelector(state),
        account: accountSelector(state),
        etherBalance: etherBalanceSelector(state),
        tokenBalance: tokenBalanceSelector(state),
        exchangeEtherBalance: exchangeEtherBalanceSelector(state),
        exchangeTokenBalance: exchangeTokenBalanceSelector(state),
        balancesLoading,
        showForm: !balancesLoading,
        etherDepositAmount: etherDepositAmountSelector(state),
        etherWithdrawAmount : etherWithdrawAmountSelector(state),
        tokenDepositAmount: tokenDepositAmountSelector(state),
        tokenWithdrawAmount : tokenWithdrawAmountSelector(state),
    }
}
  
export default connect(mapStateToProps)(Balance);
  