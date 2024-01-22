import {Schema, model} from "mongoose";

const userSchema = new Schema({
    id: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
})

export default model('Users', userSchema);
