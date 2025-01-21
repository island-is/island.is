import { NextApiRequest, NextApiResponse } from 'next'
import { getPaymentsApi } from 'apps/payments/services/payment'
import type { VerifyCardInput } from '@island.is/clients/payments'

export default async function verifyCardHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const {
    cardNumber,
    expiryMonth,
    expiryYear,
    amount,
    correlationId,
    paymentFlowId,
  } = req.body as Omit<VerifyCardInput, 'verificationCallbackUrl'>

  const verificationResponse =
    await getPaymentsApi().cardPaymentControllerVerify({
      verifyCardInput: {
        amount,
        cardNumber,
        expiryMonth,
        expiryYear,
        correlationId,
        paymentFlowId,
        // TODO: Replace this with a real URL
        verificationCallbackUrl: '',
      },
    })

  return res.json(verificationResponse)
}
