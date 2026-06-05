const moongoose = require('mongoose');

const userSchema = new moongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },      
    password: {
        type: String,
        required: true,
    },
    role: {
         type: String,
        enum: ["platform_admin", "society_admin", "resident"],
        default: "resident",
    },

    flatNumber: {
        type: String,
        default: "",
    },

    societyId: {
        type: moongoose.Schema.Types.ObjectId,
        ref: "Society",
        default: null,
    },
}, 
{ 
    timestamps: true 
}
);
module.exports = moongoose.model('User', userSchema);