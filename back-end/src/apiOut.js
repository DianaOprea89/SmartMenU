export default class apiOut {

    expressResObj = {};
    replies = {};
    errors = [];
    fatalErrorSent = false;

    /**
     *
     * @param res ServerResponse - from express
     */
    constructor (res) {
        this.expressResObj = res;
    }

    // the reply is an object
    addReply(slug, payloadObj) {
        if (this.hasErrors()) {
            this.sendFatalError('apiOut', 'You tried to addReply(' + slug + ') and there is already an error in apiOutObj. Forgot a return statement?')
        }

        if (slug in this.replies) {
            this.sendFatalError('apiOut', 'Called addReply(' + slug + ') but the slug is already added. Slugs for addReply must be unique')
        }
        this.replies[slug] = payloadObj;
    }


    // the errors are an array
    addError(slug, message) {
        let errorObj = {};
        errorObj[slug] = message;
        this.errors.push(errorObj);
    }

    hasErrors() {
        if (this.errors.length > 0) {
            return true;
        }
        return false;
    }

    sendFatalError(source, message) {
        this.fatalErrorSent = true;
        this.expressResObj.status(200).json({
            apiFatalError: {
                source: source,
                message: message
            }
        });
    }


    sendReply() {
        //console.log(this.errors);

        if (this.hasErrors()) {
            this.expressResObj.status(200).json({
                apiErrors: this.errors
            });
        } else {
            this.expressResObj.status(200).json({
                apiReplies: this.replies
            });
        }



    }

}