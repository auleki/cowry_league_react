import {model, Schema} from 'mongoose'

const PotSchema = new Schema({
    potFee: {
        type: Number,
        required: true
    },
    potSize: {
        type: [],
    },
    potOpen: {
        type: Date,
        required: true
    },
    potClose: {
        type: Date,
        required: true
    }
})

export default model('Pot', PotSchema)