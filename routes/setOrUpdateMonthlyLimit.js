const dbLimits = require('../models/monthlyLimit')
const val = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

exports.setLimit = (req, res) => {
    if (!req.body.year || !req.body.month || !req.body.amount) {
        res.json({
            success: false,
            msg: "Please provide all details."
        })
    } else {
        let todayDate = new Date(),
            currentMonth = todayDate.getMonth(),
            currentYear = todayDate.getFullYear()
        dbLimits.findOne({ email: req.decoded.email }, (err, limits) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Server Error. Please try agian after some time."
                })
            } else if (val.indexOf(parseInt(req.body.month)) == -1) {
                res.json({
                    success: false,
                    msg: "Invalid month provided."
                })
            } else if (req.body.year < currentYear || req.body.month < currentMonth) {
                res.json({
                    success: false,
                    msg: "You can't set limit for previous months."
                })
            } else if (!limits || limits == null) {
                new dbLimits({
                    email: req.decoded.email,
                    limits: [{
                        month: req.body.month,
                        year: req.body.year,
                        amount: req.body.amount
                    }]
                }).save((err, saved) => {
                    if (err) {
                        res.json({
                            success: false,
                            msg: "Please try again after some time. Server Error."
                        })
                    } else {
                        res.json({
                            success: true,
                            msg: "Limit set for the given month."
                        })
                    }
                })
            } else {
                let exists = false;
                limits.limits.length == 0 ? console.log("Not exists") : limits.limits.forEach(element => {
                    if (element.year == req.body.year && element.month == req.body.month)
                        exists = true
                });
                if (exists) {
                    res.json({
                        success: false,
                        msg: "Limit for the given month already exists. Please update the limit."
                    })
                } else {
                    let lim = {
                        month: req.body.month,
                        year: req.body.year,
                        amount: req.body.amount
                    }
                    dbLimits.findOneAndUpdate({ email: req.decoded.email }, { $push: { limits: lim } }, (err, updated) => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: "Please try again after some time. "
                            })
                        } else {
                            res.json({
                                success: true,
                                msg: "Limit set for the given month."
                            })
                        }
                    })
                }
            }
        })
    }
}

exports.updateLimit = (req, res) => {
    let todayDate = new Date(),
        currentMonth = todayDate.getMonth(),
        currentYear = todayDate.getFullYear()
    if (!req.body.year || !req.body.month || !req.body.amount) {
        res.json({
            success: false,
            msg: "Please provide all details."
        })
    } else if (val.indexOf(parseInt(req.body.month)) == -1) {
        res.json({
            success: false,
            msg: "Invalid month provided."
        })
    } else if (req.body.year < currentYear || req.body.month < currentMonth) {
        res.json({
            success: false,
            msg: "You can't set limit for previous months."
        })
    } else {
        dbLimits.findOneAndUpdate({ email: req.body.email, 'limits.year': req.body.year, 'limits.month': req.body.month }, { $set: { 'limits.$.amount': req.body.amount } }, (err, updated) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "Please try again after some time. "
                })
            } else {
                res.json({
                    success: true,
                    msg: "Limit set for the given month."
                })
            }
        })
    }
}