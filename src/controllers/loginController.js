const AuthorModel = require("../models/authorModel")
const jwt = require('jsonwebtoken')

const login = async function (req, res) {
    try {
        if (req.body.email && req.body.password) {
            const check = await AuthorModel.findOne({ email: req.body.email, password: req.body.password, isDeleted: false });
            //console.log(check)
            if (!check) {
                return res.status(400).send({ status: true, msg: "user email or password is incorrect" })
            }

            let payload = { _id: check._id }
            let token = jwt.sign(payload, 'projectOne')
            res.header['x-api-key'] = token
            res.status(200).send({ status: true, data: check, token: token })
        }
        else {

            res.status(400).send({ status: false, msg: "must contain email and password" })
        }
    } catch (error) {

        res.status(500).send({ status: false, error: error })
    }
}
module.exports.login = login;