import {Schema, model} from 'mongoose'

const PlayerSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        required: true
    },
    potsJoined: {
        type: [],
    },
    currentPot: {
        type: {},
    },
    nairaBalance: {
        type: Number,
        default: 0,
    },
    cowryBalance: {
        type: Number,
        default: 0,
    }
})

export default model('Player', PlayerSchema)