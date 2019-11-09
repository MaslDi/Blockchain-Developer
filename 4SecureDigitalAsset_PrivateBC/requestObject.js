

class requestObject {

    constructor(walletAddress, requestWindowTimeout) {
        this.walletAddress = walletAddress;
        this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
        this.message = walletAddress + ":" + this.requestTimeStamp + ":starRegistry";
        this.validationWindow = requestWindowTimeout;
    }
}

module.exports.requestObject = requestObject;