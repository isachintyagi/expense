var dbUserLogin = require('../models/userLogin')
var jwt = require('jsonwebtoken')

exports.register = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.json({
            success: false,
            msg: "Please send all details"
        })
    } else {
        dbUserLogin.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] }, (err, login) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Error. Please try again after some time"
                })
            } else if (!login || login == null) {
                new dbUserLogin({
                    email: req.body.email.toLowerCase(),
                    name: req.body.name,
                    password: req.body.password
                }).save((err, savedLogin) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Error in database. Please try again after some time."
                        })
                    } else {
                        res.json({
                            success: true,
                            msg: "Registered successful"
                        })
                    }
                })
            } else {
                dbUserLogin.findOneAndUpdate({ email: req.body.email }, { password: req.body.password, name: req.body.name }, (err, login) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Something went wrong."
                        })
                    } else {
                        res.json({
                            success: true,
                            msg: "Registeration done."
                        })
                    }
                })
            }
        })
    }
}


exports.login = (req, res) => {
    console.log(req.body)
    if (!req.body.option) {
        res.json({
            success: false,
            msg: "Please provide option"
        })
    } else {
        var option = req.body.option;
        switch (option) {
            case 'google':
                if (!req.body.google) {
                    res.json({
                        success: false,
                        msg: "Please provide all details"
                    })
                } else {
                    var google = req.body.google
                        /**
                         * email
                         * id
                         * idToken
                         * image
                         * name
                         * provider--
                         * token
                         */
                    dbUserLogin.findOne({ email: google.email }, (err, user) => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: "Please try again."
                            })
                        } else if (!user || user == null) {
                            var newUser = new dbUserLogin({
                                email: google.email,
                                name: google.name,
                                image: google.image,
                                lastLogin: [new Date()],
                                google: {
                                    id: google.id,
                                    name: google.name,
                                    email: google.email,
                                    token: google.token,
                                    login: true
                                }
                            });
                            newUser.save((err, savedUser) => {
                                if (err) {
                                    res.json({
                                        success: falsse,
                                        msg: "Please try again. Something went wrong."
                                    })
                                } else {
                                    var token = jwt.sign({
                                        name: savedUser.name,
                                        email: savedUser.email,
                                        id: savedUser._id
                                    }, req.app.get('secretKey'))
                                    crypto.encrypt(req.app.get('cryptKey'), token).then(newToken => {
                                        res.json({
                                            success: true,
                                            msg: "Login Successful",
                                            name: savedUser.name,
                                            photo: savedUser.image,
                                            test: { pending: false },
                                            token: newToken.data
                                        })
                                    }).catch(err => {
                                        res.json({
                                            success: false,
                                            msg: "Please try again"
                                        })
                                    })

                                }
                            })
                        } else {
                            dbUserLogin.findOneAndUpdate({ email: google.email }, {
                                $push: { lastLogin: new Date() },
                                $set: {
                                    email: google.email,
                                    image: google.image,
                                    'google.token': google.token,
                                    'google.email': google.email,
                                    'google.login': true,
                                }
                            }, (err, updated) => {
                                if (err) {
                                    res.json({
                                        success: false,
                                        msg: "Something went wrong. Please try again."
                                    })
                                } else {
                                    var token = jwt.sign({
                                        name: user.name,
                                        photo: user.image,
                                        email: user.email,
                                        id: user._id
                                    }, req.app.get('secretKey'))
                                    crypto.encrypt(req.app.get('cryptKey'), token).then(newToken => {
                                        res.json({
                                            success: true,
                                            msg: "Login Successful",
                                            name: google.name,
                                            photo: google.image,
                                            test: user.pendingTest,
                                            token: newToken.data
                                        })
                                    }).catch(err => {
                                        res.json({
                                            success: false,
                                            msg: "Please try again"
                                        })
                                    })

                                }
                            })
                        }
                    })
                }
                break;
                // case 'fb':
                //     if (!req.body.fb) {
                //         res.json({
                //             success: false,
                //             msg: "Please provide all details"
                //         })
                //     } else {
                //         var fb = req.body.fb
                //             /**
                //              * email
                //              * id
                //              * image
                //              * name
                //              * provider--
                //              * token
                //              */
                //         dbUserLogin.findOne({ email: fb.email }, (err, user) => {
                //             if (err) {
                //                 res.json({
                //                     success: false,
                //                     msg: "Please try again."
                //                 })
                //             } else if (!user || user == null) {
                //                 var newUser = new dbUserLogin({
                //                     email: fb.email,
                //                     name: fb.name,
                //                     image: fb.image,
                //                     lastLogin: [new Date()],
                //                     fb: {
                //                         id: fb.id,
                //                         name: fb.name,
                //                         email: fb.email,
                //                         token: fb.token,
                //                         login: true
                //                     }
                //                 })
                //                 newUser.save((err, savedUser) => {
                //                     if (err) {
                //                         res.json({
                //                             success: falsse,
                //                             msg: "Please try again. Something went wrong."
                //                         })
                //                     } else {
                //                         var token = jwt.sign({
                //                             name: savedUser.name,
                //                             email: savedUser.email,
                //                             id: savedUser._id
                //                         }, req.app.get('secretKey'))
                //                         crypto.encrypt(req.app.get('cryptKey'), token).then(newToken => {
                //                             res.json({
                //                                 success: true,
                //                                 msg: "Login Successful",
                //                                 name: savedUser.name,
                //                                 photo: savedUser.image,
                //                                 test: { pending: false },
                //                                 token: newToken.data
                //                             })
                //                         }).catch(err => {
                //                             res.json({
                //                                 success: false,
                //                                 msg: "Please try again"
                //                             })
                //                         })

                //                     }
                //                 })
                //             } else {
                //                 dbUserLogin.findOneAndUpdate({ email: fb.email }, {
                //                     $push: { lastLogin: new Date() },
                //                     $set: {
                //                         email: fb.email,
                //                         'fb.token': fb.token,
                //                         'fb.email': fb.email,
                //                         'fb.login': true,
                //                     }
                //                 }, (err, updated) => {
                //                     if (err) {
                //                         res.json({
                //                             success: false,
                //                             msg: "Something went wrong. Please try again."
                //                         })
                //                     } else {
                //                         var token = jwt.sign({
                //                             name: user.name,
                //                             photo: user.image,
                //                             email: user.email,
                //                             id: user._id
                //                         }, req.app.get('secretKey'))
                //                         crypto.encrypt(req.app.get('cryptKey'), token).then(newToken => {
                //                             res.json({
                //                                 success: true,
                //                                 msg: "Login Successful",
                //                                 name: user.name,
                //                                 photo: user.image,
                //                                 test: user.pendingTest,
                //                                 token: newToken.data
                //                             })
                //                         }).catch(err => {
                //                             res.json({
                //                                 success: false,
                //                                 msg: "Please try again"
                //                             })
                //                         })

                //                     }
                //                 })
                //             }
                //         })
                //     }
                //     break;
            case 'simple':
                if (!req.body.password || !req.body.email) {
                    res.json({
                        success: false,
                        msg: "Please enter all details"
                    })
                } else {
                    var em = req.body.email.toLowerCase()
                    dbUserLogin.findOne({ email: em }, (err, login) => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: "Database error. Please try again"
                            })
                        } else if (!login || login == null) {
                            res.json({
                                success: false,
                                msg: "Please register first."
                            })
                        } else if (req.body.password != login.password) {
                            res.json({
                                success: false,
                                msg: "Incorrect password"
                            })
                        } else {
                            var token = jwt.sign({
                                email: login.email,
                                name: login.name,
                                id: login._id
                            }, req.app.get('secretKey'))
                            res.json({
                                success: true,
                                msg: "Login successful",
                                token: token,
                                name: login.name
                            })

                        }
                    })
                }
                break;
            default:
                res.json({
                    success: false,
                    msg: "Invalid option provided"
                })
        }
    }

}