import mongoose from 'mongoose';
import mongb from 'mongoose-beautiful-unique-validation'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is missing"],
        unique: 'Usernames have to be unique, [{VALUE}] already exists'
    },
    password: {
        type: String,
        required: [true, "Missing password"],
    },
    email: {
        type: String,
        required: [true, "Email is missing"],
        unique: 'Emails have to be unique, [{VALUE}] already exists'
    },
    role: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    }
})

UserSchema.plugin(mongb)

UserSchema.post('save', function(doc) {
        console.info(`User ${doc.username} has been created.`)
})

const User = mongoose.model("User", UserSchema);

export default User;