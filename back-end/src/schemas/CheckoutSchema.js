import mongoose from 'mongoose';
const tableSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },
    seats: {
        type: Number,
        required: true
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    isReserved: {
        type: Boolean,
        default: false
    },
});
const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    tables: [tableSchema],

});

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rooms: [roomSchema],

});
export default mongoose.model('Restaurant', restaurantSchema);


