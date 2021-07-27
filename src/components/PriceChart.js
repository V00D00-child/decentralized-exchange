import React, { Component } from 'react'
import { connect } from 'react-redux'
import Chart from 'react-apexcharts';
import { chartOptions } from './PriceChart.config';
import { priceChartLoadedSelector, priceChartSelector } from '../store/selectors'
import Spinner from './Spinner';

const priceSymbol = (lastPriceChange) => {
    let output;
    if (lastPriceChange === '+') {
        output = <span className="text-success">&#9650;</span>
    } else {
        output = <span className="text-danger">&#9660;</span>
    }
    return(output);
}

const showpriceChart = (priceChart) => {
    return(
        <div className="price-chart">
            <div className="price">
                <h4>DOLL/ETH &nbsp;{ priceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}</h4>
            </div>
            <Chart options={chartOptions} series={priceChart.series} type='candlestick' width='100%' height='100%' />
        </div>
    );
}

class PriceChart extends Component {
    render() {
        return (
            <div className="vertical">
                <div className="card bg-dark text-white">
                    <div className="card-header">
                        Price Chart
                    </div>
                    <div className="card-body">
                        { this.props.priceChartLoaded ? showpriceChart(this.props.priceChart) : <Spinner />}
                    </div>
                </div> 
            </div>
                  
        )
    }
}

function mapStateToProps(state) {
    return {
        priceChartLoaded: priceChartLoadedSelector(state),
        priceChart: priceChartSelector(state)
    }
}
  
export default connect(mapStateToProps)(PriceChart);
  