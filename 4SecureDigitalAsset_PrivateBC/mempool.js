
const bitcoinMessage = require('bitcoinjs-message');
const TimeoutMempoolValidWindowTime = 30*60*1000;
const requestObject = require('./requestObject');
const validRequest = require('./validRequest');
const TimeoutRequestsWindowTime = 5*60*1000;


class Mempool{

	constructor(){
    this.mempool = [];
    this.mempoolValid = [];
		this.timeoutRequests = [];
		this.timeoutMempoolValid = [];
	}
	
// method to add a new validation request or to retrieve an existing one
addRequestValidation(address) {

    if (address in this.mempool) {
      const req = this.mempool[address];
      let timeElapse = (new Date().getTime().toString().slice(0,-3)) - req.requestTimeStamp;
      let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
      req.validationWindow = timeLeft;
      return req;
    } else {
      let timeStamp = (new Date().getTime().toString().slice(0,-3));
      const req = {
        address: address,
        requestTimeStamp: timeStamp,
        message:`${address}:${timeStamp}:starRegistry`,
        validationWindow: TimeoutRequestsWindowTime/1000
      }

      // add request to mempool
      this.mempool[address] = req;
      // set timout to remove entry from mempool
      this.timeoutRequests[req.address] = 
        setTimeout(() => this.removeRequestValidation(req.address),
                    TimeoutRequestsWindowTime)
      return req;
    }
  }

  // method to remove validationrequest on timeout
  removeRequestValidation(address) {
    //filterout existing entry with address from mempool
    this.mempool = this.mempool.filter(elem => elem.address !== address);
  }


  //method to validates request by address
  validateRequestByWallet(address, signature) {

    if (address in this.mempoolValid) {
      if (bitcoinMessage.verify(this.mempoolValid[address].status.message, address, signature)) {
        const req = this.mempoolValid[address];
        console.log(req);
        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - req.status.requestTimeStamp;
        let timeLeft = (TimeoutMempoolValidWindowTime/1000) - timeElapse;
        req.status.validationWindow = timeLeft;
        return req;
      } else {
        return {message:'Signature invalid1. Please try again.'};
      }
    }

    if (address in this.mempool) {
      if (bitcoinMessage.verify(this.mempool[address].message, address, signature)) {
        const req = {
          registerStar: true,
          status: Object.assign({}, 
                      this.mempool[address], 
                      { validationWindow: TimeoutMempoolValidWindowTime/1000,
                        messageSignature: 'valid',
                      })
          }

        clearTimeout(this.timeoutRequests[address]); //clear timout
        this.removeRequestValidation(address); // remove request from mempool
        // add request to valid request mempool
        this.mempoolValid[address] = req;
        // set timout to remove entry from valid rquest mempool
        this.timeoutMempoolValid[address] = 
          setTimeout( () => this.removeRequestByWallet(address),
                      TimeoutMempoolValidWindowTime)
        return req;
      } else {
        return {message:'Signature invalid2. Please try again.'};
      }
    } 
    else {
      return { message: "Validation request expired or not created." };
    }
  }

  // method to remove validation request on timeout
  removeRequestByWallet(address) {
    //filterout existing entry with address from mempool
    this.mempoolValid = this.mempoolValid.filter(elem => elem.address !== address);
  }

  // verify if there is a valid request in mempoolValid
  verifyAddressRequest(address) {
    return address in this.mempoolValid;
  }

  // remove request and clear SetTimeout
  removeAddressRequest(address) {
    clearTimeout(this.timeoutMempoolValid[address]); //clear timout
    this.removeRequestByWallet(address); // remove request from mempool
  }


}

module.exports = Mempool;
