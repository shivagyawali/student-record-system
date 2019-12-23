const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    work_Experience: {
        type: Number
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Student = mongoose.model("myStudent", StudentSchema);

