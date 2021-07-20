import React, { Component } from 'react'
import { connect } from 'react-redux'
import { accountSelector } from '../store/selectors'
import {FaCircle} from 'react-icons/fa';
import Modal from 'react-modal';
import { FaCopy, FaCheckCircle } from 'react-icons/fa';
import { FaCog, FaRegTimesCircle } from 'react-icons/fa';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAccountInfoModal: false,
      isCopied: false,
    }
  }

  doToggleAccountInfoModal(e) {
    e.preventDefault();
    this.setState({ showAccountInfoModal: !this.state.showAccountInfoModal });
  }

  copyToClipboard(e) {
    e.preventDefault();
    navigator.clipboard.writeText(this.props.account);
    this.setState({isCopied: true});

    // remove success message after 2 seconds
    setTimeout(()=>{
      this.setState({isCopied: false});
    }, 500);
  }

  formatAddress() {
    if (this.props.account) {
        const chars = this.props.account.split('');
        return (this.props.account.slice(0, 6) + '...' + this.props.account.slice(chars.length - 4, chars.length)).toLowerCase();
    }
    return 'no account connected';
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#/">Auth Token Exchange</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item">

            <div className="nav-wallet-status-container">
              <FaCircle className={this.props.account ? "status-icon-connected" : "status-icon-not-connected"} />
              {this.props.account ? 
              <div className="nav-wallet-status-connected-container">
                <a
                  className="nav-link small account-display"
                  href={`https://etherscan.io/address/${this.props.account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                {this.props.account}
                </a>
                <FaCog  className="wallet-user-settings" onClick={(e) => this.doToggleAccountInfoModal(e)} />              
              </div>
            : 
              <div className="nav-wallet-status-connected-container">
                <p className="nav-link small">No wallet connected</p>
              </div>
            }
            </div>
          
          </li>
        </ul>
        {/* user account info modal */}
        <Modal id="modal-account" 
              shouldCloseOnEsc={true}
              shouldCloseOnOverlayClick={true}
              onRequestClose={(e) => this.doToggleAccountInfoModal(e)}
              isOpen={this.state.showAccountInfoModal}
              >
              <div className="modal-header">
                  <h5 className="modal-title">Account</h5>
                  <FaRegTimesCircle type="button"  aria-label="Close" onClick={(e) => this.doToggleAccountInfoModal(e)} />
              </div>

              <div className="modal-body">
                  <p>Connected with Metamask</p>
                  <div className="account-view">
                      <p>My public address: {this.formatAddress()}</p>
                      {!this.state.isCopied ? (
                          <p className="copy-to-clipboard small" onClick={(e) => this.copyToClipboard(e)} >
                          <span alt="copy address"><FaCopy className="icon-clip-board"/></span>
                          Copy Address
                          </p>
                      ):
                          <p>
                          <span alt="copied"><FaCheckCircle className="icon-clip-board"/></span>
                          Copied
                          </p>
                      }
                      <a
                        className="small"
                        href={`https://etherscan.io/address/${this.props.account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Explorer
                      </a>
                  </div>
                  <button className="btn btn-primary" onClick={(e) => this.doDisConnectWallet(e)}>Disconnect wallet</button>
              </div>
              <div className="modal-footer">
                  <h5 id="info-tab" className="modal-title">Recent Transactions</h5>
              </div>
          </Modal>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state)
  }
}

export default connect(mapStateToProps)(Navbar)
