import { getPaymentsApi } from 'apps/payments/services/payment'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function chargeCardHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { card, amount, correlationId, paymentFlowId } = req.body

  const response = await getPaymentsApi().cardPaymentControllerCharge({
    chargeCardInput: {
      amount,
      cardNumber: card.number,
      cvc: card.cvc,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      correlationId,
      paymentFlowId,
    },
  })

  return response
}
