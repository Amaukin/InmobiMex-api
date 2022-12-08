var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PropertySchema = Schema({
    _id: mongoose.Types.ObjectId,
    address: {
        type: String,
        required: true,
    },
    bathroomQuantity: { type: Number },
    description: {
        type: String,
        required: true,
    },
    garageQuantity: { type: Number },
    images: {
        type: [String],
        required: true,
    },
    isFurnished: { type: Boolean, default: false },
    leaseType: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    roomQuantity: { type: Number },
    services: { type: String },
    surface: { type: String },
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
        default: '6385a4d9f8894db60a1b3353',
    }
})

module.exports = mongoose.model('Property', PropertySchema);