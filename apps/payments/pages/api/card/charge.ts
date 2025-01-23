import { NextApiRequest, NextApiResponse } from 'next'

import type { ChargeCardInput } from '@island.is/clients/payments'

import { getPaymentsApi } from '../../../services/payment'

export default async function chargeCardHandler(
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
    cvc,
    amount,
    correlationId,
    paymentFlowId,
  } = req.body as ChargeCardInput

  const response = await getPaymentsApi().cardPaymentControllerCharge({
    chargeCardInput: {
      amount,
      cardNumber,
      cvc,
      expiryMonth,
      expiryYear,
      correlationId,
      paymentFlowId,
    },
  })

  return res.json(response)
}
