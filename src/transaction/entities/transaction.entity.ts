export class Transaction {
    id: string;
    senderAccountId: string;
    recieverAccountId: string;
    currency: string;
    amount: number;
    // we can add date here but mongodb takes care of the createdAt attribute
}
