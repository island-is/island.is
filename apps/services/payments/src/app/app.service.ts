import { Injectable } from '@nestjs/common'
import { PaymentInformation } from '../types'

@Injectable()
export class AppService {
  createPaymentUrl(paymentInfo: PaymentInformation): { url: string } {
    return { url: 'https://www.island.is/borga/:todoId' }
  }

  getPaymentInfo(id: string): { paymentInfo: PaymentInformation } {
    return {
      paymentInfo: {
        productId: 'product-id',
        availablePaymentMethods: ['card', 'invoice'],
        callbacks: {
          onSuccess: 'https://www.island.is/borga/success',
          onError: 'https://www.island.is/borga/error',
        },
        organizationId: 'organization-id',
        invoiceId: 'todo',
      },
    }
  }
}
