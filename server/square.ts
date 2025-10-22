import { SquareClient } from 'square';

// Square Client初期化  
const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
});

export const { payments, orders, customers } = squareClient;

// 決済処理
export async function createPayment(params: {
  sourceId: string;
  amount: number;
  currency: 'JPY' | 'USD';
  customerId?: string;
  note?: string;
}) {
  try {
    const response = await payments.create({
      sourceId: params.sourceId,
      idempotencyKey: `${Date.now()}-${Math.random()}`,
      amountMoney: {
        amount: BigInt(Math.round(params.amount * 100)), // 円→銭に変換
        currency: params.currency as any
      },
      customerId: params.customerId,
      note: params.note,
      locationId: process.env.SQUARE_LOCATION_ID
    });

    return {
      success: true,
      payment: (response as any).result?.payment || response
    };
  } catch (error: any) {
    console.error('Square payment error:', error);
    return {
      success: false,
      error: error.message || '決済処理に失敗しました'
    };
  }
}

// 顧客作成
export async function createCustomer(params: {
  emailAddress: string;
  givenName?: string;
  familyName?: string;
}) {
  try {
    const response = await customers.create({
      emailAddress: params.emailAddress,
      givenName: params.givenName,
      familyName: params.familyName
    });

    return {
      success: true,
      customer: (response as any).result?.customer || response
    };
  } catch (error: any) {
    console.error('Square customer creation error:', error);
    return {
      success: false,
      error: error.message || '顧客登録に失敗しました'
    };
  }
}

// 注文作成
export async function createOrder(params: {
  lineItems: Array<{
    name: string;
    quantity: string;
    basePriceMoney: {
      amount: bigint;
      currency: 'JPY' | 'USD';
    };
  }>;
  customerId?: string;
}) {
  try {
    const response = await orders.create({
      order: {
        locationId: process.env.SQUARE_LOCATION_ID || '',
        lineItems: params.lineItems as any,
        customerId: params.customerId
      },
      idempotencyKey: `order-${Date.now()}-${Math.random()}`
    });

    return {
      success: true,
      order: (response as any).result?.order || response
    };
  } catch (error: any) {
    console.error('Square order creation error:', error);
    return {
      success: false,
      error: error.message || '注文作成に失敗しました'
    };
  }
}

export default squareClient;
