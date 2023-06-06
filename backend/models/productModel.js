const mongoose = require('mongoose');

const productSchema = new mongoose.Schema ({
    id: {
        type: String,
        default: function() {
          return new mongoose.Types.ObjectId().toString();
        },
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: Object,
        required: true
    }
}, {timestamps: true}
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;