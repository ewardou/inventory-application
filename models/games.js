const mongoose = require('mongoose');

const { Schema } = mongoose;

const GameSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    price: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1, max: 1000 },
    synopsis: { type: String, maxLength: 1000 },
    availableConsoles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Consoles',
        },
    ],
});

GameSchema.virtual('url').get(function () {
    return `/games/${this._id}`;
});

module.exports = mongoose.model('Games', GameSchema);
