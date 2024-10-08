'use client';
import { PublicKey } from '@solana/web3.js';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnchorProvider } from '../solana/solana-provider';
import { AccountBalance } from '../account/account-ui';
import { useWallet } from '@solana/wallet-adapter-react';

interface DashboardProps { }

export function Dashboard({ }: DashboardProps) {
    const [traderAddress, setTraderAddress] = useState('');
    const [copiedTrade, setCopiedTrade] = useState<null | { user: string; trader: string; percentage: number; symbol: string }>(null);
    // const [balance, setBalance] = useState('');
    const [copyPercentage, setCopyPercentage] = useState(50);
    const router = useRouter();

    const provider = useAnchorProvider();
    const { publicKey } = useWallet();

    const { wallet } = useWallet();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!provider.wallet?.publicKey) {
            console.error('No Solana wallet connected');
            return;
        }

        const dataToSend = {
            traderAddress,
            copyPercentage,
            symbol: 'SOL',
            userAddress: provider.wallet.publicKey.toString(),
        };

        try {
            const response = await fetch('http://localhost:3008/userData/traders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Data saved successfully:', result);
            // alert('Trade data saved successfully!');

            console.log("here's the data : ", dataToSend);

            setCopiedTrade({
                user: dataToSend.userAddress,
                trader: dataToSend.traderAddress,
                percentage: copyPercentage,
                symbol: 'SOL'
            });



        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save trade data. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-skyblue-200 via-cyan-100 to-lightblue-200 flex items-center justify-center">
            <div className="max-w-4xl w-full p-8 bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                {wallet ? (
                    <div className="flex flex-col lg:flex-row gap-8 items-center px-6">
                        <div className="lg:w-1/2">
                            <h1 className="text-6xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
                                Welcome to Your Copy Trade Dashboard
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 shadow-lg">
                                <div>
                                    <label htmlFor="traderAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter Trader's Address
                                    </label>
                                    <input
                                        type="text"
                                        id="traderAddress"
                                        value={traderAddress}
                                        onChange={(e) => setTraderAddress(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className='flex items-center justify-between'>
                                        <label htmlFor="copyPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                                            Copy Percentage
                                        </label>
                                        <span className="text-sm">{copyPercentage}%</span>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        id="copyPercentage"
                                        value={copyPercentage}
                                        onChange={(e) => setCopyPercentage(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <progress id="copyPercentage" max="100" value={copyPercentage} className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer "></progress>

                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 text-white bg-gradient-to-r from-green-400 to-blue-600 hover:bg-gradient-to-r from-green-500 to-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                        <div className="lg:w-1/2 space-y-6">

                            {copiedTrade && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-3xl font-semibold text-gray-700 mb-4">Trade Copied Successfully</h2>
                                    <p className="mb-4">The trade has been copied from the trader's address.</p>
                                    <ul className="list-disc list-inside space-y-2 mb-4">
                                        <li className="truncate pr-4">
                                            You: <span className="cursor-text select-all">{copiedTrade.user || ''}</span>
                                        </li>
                                        <li className="truncate pr-4">
                                            Trader: <span className="cursor-text select-all">{copiedTrade.trader || ''}</span>
                                        </li>
                                        <li>Percentage: {copiedTrade.percentage}%</li>
                                        <li>Symbol: {copiedTrade.symbol || ''}</li>
                                    </ul>
                                    <p >Current balance:
                                        {copiedTrade.user && (
                                            <div className='text-sm font-small text-gray-700 '>
                                                <AccountBalance address={new PublicKey(copiedTrade.user)} />

                                            </div>
                                        )}
                                    </p>
                                    <button
                                        onClick={() => router.push('/portfolio')}
                                        className="w-full px-6 py-3 text-white bg-gradient-to-r from-green-400 to-blue-600 hover:bg-gradient-to-r from-green-500 to-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                                    >
                                        View Portfolio
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>) :
                    <h1 className="text-6xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
                        You Are not Connected!
                    </h1>}
            </div>
        </div>
    );
}