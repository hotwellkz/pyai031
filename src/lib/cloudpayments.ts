
export class PaymentService {
  private static instance: PaymentService;
  private widget: any;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.widget = (window as any).cp;
    }
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async pay(options: {
    amount: number;
    currency: string;
    description: string;
    accountId: string;
    email?: string;
  }): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.widget.pay('charge', {
          publicId: 'pk_bd293119b4768f0dcbaf370e4264d',
          description: options.description,
          amount: options.amount,
          currency: options.currency,
          accountId: options.accountId,
          email: options.email,
          data: {
            cloudPayments: {
              recurrent: { interval: 'Month', period: 1 }
            }
          },
          skin: "modern",
          successRedirect: window.location.origin + '/profile',
          failRedirect: window.location.origin + '/pricing',
        }, {
          onSuccess: (options: any) => {
            resolve({ status: 'Completed', ...options });
          },
          onFail: (reason: any, options: any) => {
            reject({ status: 'Failed', reason, ...options });
          },
          onComplete: (paymentResult: any, options: any) => {
            if (paymentResult.success) {
              resolve({ status: 'Completed', ...options });
            } else {
              reject({ status: 'Failed', ...paymentResult });
            }
          }
        });
      });
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }
}