const dbLogin = require('../models/userLogin')

module.exports = (req, res) => {
    if (!req.body.oldPassword || !req.body.newPassword) {
        res.json({
            success: false,
            msg: "Please provide all details."
        })
    } else {
        dbLogin.findOne({ email: req.decoded.email }, (err, userData) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Something went wrong. Please try agian after some time."
                })
            } else if (!userData || userData == null) {
                res.json({
                    success: false,
                    msg: "User not found."
                })
            } else if (req.body.oldPassword != userData.password) {
                res.json({
                    success: false,
                    msg: "Old password mismatch"
                })
            } else {
                dbLogin.findOneAndUpdate({ email: req.decoded.email }, { $set: { password: req.body.newPassword } }, (err, updated) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Server Error. Please try again after some time."
                        })
                    } else {
                        res.json({
                            success: true,
                            msg: "Password updated."
                        })
                    }
                })
            }
        })
    }
}