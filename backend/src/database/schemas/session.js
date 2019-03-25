import mongoose from 'mongoose';
import mongb from 'mongoose-beautiful-unique-validation'

const { Schema: { Types: { ObjectId }}} = mongoose

const SessionSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User"
    },
    jwt: {
        type: String,
        required: [true, "Cannot create session without a token"],
        unique: [true, "This should never happen."]        
    },
    deviceName: {
        type: String
    }
})

SessionSchema.plugin(mongb)

SessionSchema.post('save', function(doc) {
    console.info(`User ${doc.user.username} has logged in`)
})

const Session = mongoose.model("Session", SessionSchema)

export default Session;