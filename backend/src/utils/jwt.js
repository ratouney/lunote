import jwt from 'jsonwebtoken'

var secret = "ilovenightcore"

const getTokenData = async function(token) {
    return jwt.verify(token, secret, function(err, res) {
        if (err)
            return null;
        else
            return res;
    })
}

const createToken = async function(data) {
    return jwt.sign(data, secret);
}

export default {
    getTokenData,
    createToken
};