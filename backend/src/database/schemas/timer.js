import mongoose from 'mongoose';
import mongb from 'mongoose-beautiful-unique-validation'

const { Schema: { Types: { ObjectId, Mixed }}} = mongoose

const TimerSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: 'Timer names have to be unique, [{VALUE}] already exists'
    },
    lastStart: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    tracked: {
        type: Mixed,
    },
    active: {
        type: Boolean,
        default: false
    }
})

TimerSchema.plugin(mongb)

TimerSchema.post('save', function(doc) {
    console.info(`Timer ${doc.name} has been created`)
})

const Timer = mongoose.model("Timer", TimerSchema)

export default Timer;