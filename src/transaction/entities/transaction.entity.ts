export class Transaction {
    _id: string;
    senderAccountId: string;
    recieverAccountId: string;
    fromCurrency: string;
    toCurrency: string;
    sentAmount: number;
    recievedAmount: number;
    transferRate: number;
    note: string
    // we can add date here but mongodb takes care of the createdAt attribute
}
