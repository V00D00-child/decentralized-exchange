import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    etherWithdrawAmountSelector
} from '../store/selectors';
import Spinner from './Spinner';
import { loadBalances, depositEther, withdrawEther } from '../store/interaction';
import { Tab, Tabs } from 'react-bootstrap';
import { etherDepositAmountChanged, etherWithdrawAmountChanged } from '../store/actions'

const showForm = (props) => {
    const {
        etherBalance,
        tokenBalance,
        exchangeEtherBalance,
        exchangeTokenBalance,
        dispatch,
        etherDepositAmount,
        etherWithdrawAmount,
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

                {/* Deposit form */}
                <form className="row" onSubmit={(event) => {
                event.preventDefault();
                depositEther(dispatch, exchange, web3, etherDepositAmount, account);
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

                {/* Withdraw form */}
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
            </Tab>

        </Tabs>
    )
}

class Balance extends Component {
    componentDidMount() {
        console.log('balance props init:', this.props.account);
        const interval = setInterval(function() { 
            console.log('balance props check:', this.props.account);
            if(this.props.account) {
                this.loadBlockchainData(); 
                console.log('balance props ready:', this.props.account);
                console.log('ready to clear interval')
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
    }
}
  
export default connect(mapStateToProps)(Balance);
  