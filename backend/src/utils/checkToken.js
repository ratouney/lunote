import extractToken from './extractToken'

function checkToken(req, res, required = true) {
    const token = extractToken(req);

    if (required) {
        if (token == null) {
            res.status(403).json({error: "Missing token"})
            return false;
        } else {
            return true;
        }
    }
    
    return token == null;
}

export default checkToken;