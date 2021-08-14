import React, { Component } from 'react';
import { connect } from 'react-redux';
import { accountSelector } from '../store/selectors';
import Modal from 'react-modal';
import metamaskLogo from '../assets/images/metamask.png';
import { FaRegTimesCircle } from 'react-icons/fa';

Modal.setAppElement('#root');
class Connection extends Component {

    constructor(props) {
        super(props);
        this.state = {
           showConnectAccountModal: false,
           showWalletInfo: false,
        }
        this.doConnectWallet = this.doConnectWallet.bind(this);
      }

    async doConnectWallet(e) {
        e.preventDefault();
        await this.props.connectWallet();
    }
    
    doToggleConnectModal(e) {
        e.preventDefault();
    }

    doToggleWalletInfo(e) {
        e.preventDefault();
    }
    

  render() {
    return (
      <div className="connection-container">
            {/* connect wallet */}
            {!this.props.account &&
              <div>
                <button className="btn btn-primary wallet-button" onClick={(e) => this.doConnectWallet(e)}>Connect Wallet</button>
              </div>
            }

            {/* Connect modal */}
            <Modal id="modal-connect" 
                shouldCloseOnEsc={true}
                shouldCloseOnOverlayClick={true}
                onRequestClose={(e) => this.doToggleConnectModal(e)}
                isOpen={this.state.showConnectAccountModal}
            >
                <div className="modal-header">
                    <h5 className="modal-title">Select a Wallet</h5>
                    <FaRegTimesCircle type="button"  aria-label="Close" onClick={(e) => this.doToggleConnectModal(e)} />
                </div>

                <div className="modal-body">
                    <button type="button" className="btn btn-primary" onClick={(e) => this.doConnectWallet(e)}>Metamask</button>
                    <img src={metamaskLogo} className="mb-4 metamask-icon" alt=""/>
                </div>
                <div className="modal-footer">
                    <h5 id="info-tab" className="modal-title" onClick={(e) => this.doToggleWalletInfo(e)}>What is a wallet?</h5>
                    {this.state.showWalletInfo &&
                      <p>
                      Wallets are used to send, receive, and store digital assets like Ether.
                      Wallets come in many forms. They are either built into your browser, an extension 
                      added to your browser, a piece of hardware plugged into your computer or even an app 
                      on your phone. For more information about wallets, see this 
                      <a
                          href="https://docs.ethhub.io/using-ethereum/wallets/intro-to-ethereum-wallets/"
                          target="_blank"
                          rel="noopener noreferrer"> explanation
                      </a>.
                      </p>
                    }
                </div>
            </Modal>
      </div>
    );
  }
}


function mapStateToProps(state) {
    return {
      account: accountSelector(state)
    }
}
  
export default connect(mapStateToProps)(Connection)