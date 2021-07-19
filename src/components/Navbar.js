import React, { Component } from 'react'
import { connect } from 'react-redux'
import { accountSelector } from '../store/selectors'
import {FaCircle} from 'react-icons/fa';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#/">Auth Token Exchange</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item">

            <div className="nav-wallet-status-continaer">
              <FaCircle className={this.props.account ? "status-icon-connected" : "status-icon-not-connected"} />
              {this.props.account ? 
              <a
                className="nav-link small"
                href={`https://etherscan.io/address/${this.props.account}`}
                target="_blank"
                rel="noopener noreferrer"
              >
              {this.props.account}
              </a>
            : <p className="nav-link small">No wallet connected</p>
              }
            </div>
          
          </li>
        </ul>
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
