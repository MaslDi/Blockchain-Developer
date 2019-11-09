

class validRequest {

    constructor(mempoolRequest, isValid, validationWindow) {
        this.registerStar = true;
        this.status = {
            address: mempoolRequest.walletAddress,
            requestTimeStamp: mempoolRequest.requestTimeStamp,
            message: mempoolRequest.message,
            validationWindow: validationWindow,
            messageSignature: isValid
        };
    }
}


module.exports.validRequest = validRequest;

