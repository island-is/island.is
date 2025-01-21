import { NextApiRequest, NextApiResponse } from 'next'
import { getPaymentsApi } from 'apps/payments/services/payment'

const badRequest = (res: NextApiResponse, message: string) => {
  return res.status(400).json({ error: message })
}

export default async function verifyCardHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { card, amount, correlationId, paymentFlowId } = req.body

  await getPaymentsApi().cardPaymentControllerVerify({
    verifyCardInput: {
      amount,
      cardNumber: card.number,
      cvc: card.cvc,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      correlationId,
      paymentFlowId,
      // TODO: Replace this with a real URL
      verificationCallbackUrl: '',
    },
  })
}
