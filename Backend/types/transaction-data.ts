// file: ~/TraDefi/Backend/types/transaction-data.ts

export interface TransactionData {
    id: string;
    signature: string;
    memeCoinName: string;
    amount: number;
    type: 'buy' | 'sell';
    timestamp: number;
    sourceFundId?: string; // New field to store the fund ID from which the funds were taken
    destinationFundId?: string; // New field to store the fund ID to which the funds were added back
}