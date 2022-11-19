import * as mongoose from 'mongoose'

export const BankAccountSchema = new mongoose.Schema({
    ownerId : {
        type : String,
        required : true,
        immutable : true
    },
    currency : {
        type : String,
        required : true
    },
    name : {
        type : String,
        default : 'New Account'
    },
    balance :{
        type : Number,
        default : 0
    }
},{
    timestamps: true                    
})