const mongoose = require('mongoose');

const { Schema } = mongoose;

const AccessoriesSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    price: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1, max: 1000 },
    availableConsoles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Consoles',
            required: true,
        },
    ],
    imageName: { type: String },
});

AccessoriesSchema.virtual('url').get(function () {
    return `/accessories/${this._id}`;
});

module.exports = mongoose.model('Accessories', AccessoriesSchema);
