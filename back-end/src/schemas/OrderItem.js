// OrderItem.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;

