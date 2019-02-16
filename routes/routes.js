const express = require('express')
const router = express.Router()
const verify = require('./tokenVerify')

/**
 * Register using email and phone
 */
const register = require('./registerLogin')
router.post('/register', register.register)


/**
 * Login using google or using email h
 */
router.post('/login', register.login)

/**
 * Add or update Monthly Limit
 */
const limit = require('./setOrUpdateMonthlyLimit')
router.post('/setLimit', verify, limit.setLimit)
router.post('/updateLimit', verify, limit.updateLimit)

/**
 * Months stats
 */
const stats = require('./stats')
router.get('/stats', verify, stats)

/**
 * Add expense
 */
const addExpense = require('./addExpense')
router.post('/addExpense', verify, addExpense)

/**
 * Edit Expense
 */
const editExpense = require('./editExpense')
router.post('/editExpense', verify, editExpense)

/**
 * Delete Expense
 */
const deleteExpense = require('./deleteExpense')
router.post('/deleteExpense', verify, deleteExpense)

/**
 * Get Expense
 */
const getExpense = require('./getExpense')
router.post('/getExpense', verify, getExpense)

/**
 * Change password
 */
const changePassword = require('./changePassword')
router.post('/changePassword', verify, changePassword)

module.exports = router;