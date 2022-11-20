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
    sentAmount : {
        type : Number,
    },
    recievedAmount : {
        type : Number,
    },
    conversionRate : {
        type : Number,
    },
    fromCurrency : {
        type : String,
    },
    toCurrency : {
        type : String,
    },
    note : {
        type: String
    }
},{
    timestamps: true                    
})