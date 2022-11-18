import * as mongoose from 'mongoose'

export const TransactionSchema = new mongoose.Schema({
    senderAccountId : {
        type : String,
        required : true
    },
    recieverAccountId : {
        type : String,
        required : true,
    },

    amount : {
        type : Number,
        required : true,
    },
    currency : {
        type : String,
        
    }
},{
    timestamps: true                    
})