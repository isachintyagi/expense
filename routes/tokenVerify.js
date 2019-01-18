var jwt = require('jsonwebtoken')


var tokenVerify = function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (token) {
        //   console.log(token)
        jwt.verify(token, req.app.get('secretKey'), function(err, decoded) {
            if (err) {
                // console.log(err)
                res.json({
                    success: false,
                    msg: 'Failed to authenticate token.'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.json({
            success: false,
            msg: "Token not found"
        });
    }
}


module.exports = tokenVerify;