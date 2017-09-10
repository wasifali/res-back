/**
 * Created by macbookpro on 2/17/16.
 */

module.exports  = function(app){
    var exceptions = ['/api/user/escrow-webhook','/user/escrow-webhook','/api/auth/facebook','/api/auth/facebook/callback'],exceptionFound,url;
    var CSRFVALIDATORS = {
        csrfvalidator : function(err, req, res, next) {
            url = req.url;
            exceptionFound = false;
            for (var i = 0; i < exceptions.length; i++) {

                if (url.match(exceptions[i])) {

                    console.log("found excecption",exceptions[i],"==url=",url);
                    exceptionFound = true;
                    break;
                }
            }
            if (exceptionFound)
            {
                //app.log.info("User is Authorized");
                console.log("exception found....");
                next();
            }
            else {
                if (err.code !== 'EBADCSRFTOKEN') return next(err)

                // handle CSRF token errors here
                res.json({
                    "status": "403",
                    "message": "Browse snappyClicks.com",
                    "response": "Error in token Validation!"
                });
            }
        }
    };
    return CSRFVALIDATORS;
};
