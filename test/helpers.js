export const EVM_REVERT = 'VM Exception while processing transaction: revert';
export const tokens = (n) => {
    // returns a 18 decimal place value
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(), 'ether')
    );
}