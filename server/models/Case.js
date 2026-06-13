const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
{
    caseName: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    location: {
        type: String
    },

    status: {
        type: String,
        default: "Open"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Case", caseSchema);