const isKeyMissing = function(obj, keyname, res = null) {
    if (obj[keyname] == null) {
        if (res) {
            res.status(400).json({error: `Missing key [${keyname}]`});
        }
        return true;
    } else {
        return false;
    }
}

export default isKeyMissing;