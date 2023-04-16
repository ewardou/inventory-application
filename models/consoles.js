const mongoose = require('mongoose');

const { Schema } = mongoose;

const ConsoleSchema = new Schema({
    manufacturer: { type: String, maxLength: 100, required: true },
    name: { type: String, maxLength: 100, required: true },
    price: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1 },
});

ConsoleSchema.virtual('url').get(function () {
    return `/consoles/${this._id}`;
});

module.exports = mongoose.model('Consoles', ConsoleSchema);
