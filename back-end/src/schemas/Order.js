// Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    status: {
        type: String,
        enum: ['placed', 'confirmed', 'prepared', 'served', 'cancelled'],
        default: 'placed'
    },
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

