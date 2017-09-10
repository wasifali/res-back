module.exports = function (app) {

  var send = function (code, res, message, data, error_code) {

    if (!code) {
      throw new Error('error_code is required.');
    }
    else if(code >= 400 && code < 600){
      app.log.error(code, message, data )
    }
    else {
      app.log.info(code, message, data )
    }

    res.send(
      code,
      {
        error_code: error_code,
        message: message,
        data: data
      }
    );
  }
  
  return {
    send: send
  }
}