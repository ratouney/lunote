import mongoose from 'mongoose'

const url = "mongodb://localhost:27017/lunote"

async function connect() {
    const rt = await mongoose.connect(url, { useNewUrlParser: true}, function(err) {
        if (err) {
            throw err;
        } else {
            console.log("Database connection established.")
        }
    })

    return rt;
}
    
export default connect;