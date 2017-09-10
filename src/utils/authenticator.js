/**
 * Created by macbookpro on 2/17/16.
 */

var jwt = require('jwt-simple');
module.exports  = function(app){
    var exceptions = ['/api/web/sign-in','/api/mobile/sign-in','/api/user/sign-up','/api/photographer/sign-up','/api/user/confirm-signup','/api/photographer/confirm-signup', '/api/forgot-password',
        '/api/auth/facebook','/api/auth/facebook/callback','/api/social/user/create','/api/social/photographer/create','api/signed-in','api/photographers','/photographers/categories','/api/photographers/filter-photographers',
            'public/photographers','public/photographers/photographer-reviews','/image/permission','/user/escrow-webhook','api/google-analytics','api/snappyClicks/user/contact/us','/public/csrf/validation/token'],

        userUrls=[ '/user/sign-up',
            '/user/confirm-signup/:token',
            '/user/reset',
            '/user/profile',
            '/users/profile',
            '/user/:id/profile',
            '/user/profile',
            '/user/booked-packages',
            '/user/:id/rejected-packages',
            '/user/booked-packages',
            '/user/booked-packages-gallery/get/:id/photographer/:photographer',
            '/user/booked-packages/:id/photographer/:photographer',
            '/user/photoShoots-reviews',
            '/user/create-payment-account',
            '/user/create-payment-account/transfer',
            '/user/create-payment-account/order',
            '/user/verify-account',
            '/user/create-review',
            '/user/escrow-webhook',
            '/user/release-payment'

        ],
        exceptionFound,
        role,
        url,
        secret;




    function checkRole(req)
    {
        for (var i = 0; i < userUrls.length; i++) {

            if (req.url.match(userUrls[i])) {

                //console.log("found exception",exceptions[i],"==url=",url);

                role = 'user';
                break;
            }
        }
    }

    secret = app.jwtSecret;
    var Authenticate = {
        authenticate : function(req, res, next) {
            //app.log.info("In Authentication");
            url = req.url;
            role='photographer';
            exceptionFound = false;


            var userAgent = req.headers['user-agent'];
            //console.log(p.parseUA(userAgent).toString());
            //console.log(p.parseOS(userAgent).toString());
            //// -> "iOS 5.1"
            //console.log(p.parseDevice(userAgent).toString());
            //
            //
            //// check if url does not require authentication
            //console.log(url);
            for (var i = 0; i < exceptions.length; i++) {

                if (url.match(exceptions[i])) {

                    //console.log("found exception",exceptions[i],"==url=",url);

                    exceptionFound = true;
                    break;
                }
            }
            //app.log.info("Is User Logged In???");
            if (exceptionFound)
            {
                //app.log.info("User is Authorized");
                console.log("exception found....");

                next();
            }
            else {
                try
                {
                    if(!req.headers.token) {
                        res.json({"status": "error", "message": "token is empty", "response": ""});
                    }
                    else
                    {
                        var decodedObj = jwt.decode(req.headers.token, secret);



                        if (decodedObj.exp <= Date.now()) {
                            res.json({"status": "error", "message": "error token validation", "response": ""});
                            return;
                        }
                        else {
                            //checkRole(req);
                            req.userID = decodedObj.userID;
                            req.type   =   decodedObj.type;

                            next();
                            //if(req.url === '/photographer/photoShoots/requests'){
                            //    next();
                            //}
                            //else
                            //{
                            //    decodedObj.type === role ? next() : res.json({"status": "error", "message": "You don't have permissions to perform this action", "response": ""});
                            //}


                        }
                    }
                }
                catch (err) {

                    //console.log(err)

                    res.json({"status": "error", "message": "error token validation", "response": ""});
                }
            }
        }
    };
    return Authenticate;
};
