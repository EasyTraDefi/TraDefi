import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userAddress, traderAddress, copyPercentage, symbol } = await request.json();

  // Here you would typically save the data to a database
  console.log('Received trade data:', userAddress, traderAddress, copyPercentage, symbol);

  return NextResponse.json({ message: 'Trade data saved successfully' });
}

