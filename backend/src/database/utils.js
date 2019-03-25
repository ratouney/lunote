import mongoose from 'mongoose';

const { Types: { ObjectId }} = mongoose;

const getErrors = function(err) {
    const ers = Object.keys(err.errors).map(elem => {
        return err.errors[elem].message
    })

    if (ers.length > 1)
        return ers;
    else
        return ers[0];
}

const isObjectId = function(str) {
    const t = new ObjectId(str);

    return t == str;
}

export default {
    getErrors,
    isObjectId
}