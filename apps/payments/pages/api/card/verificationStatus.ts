import { NextApiRequest, NextApiResponse } from 'next'

import { getPaymentsApi } from '../../../services/payment'

export default async function verificationStatusHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { paymentFlowId } = req.query

  const response =
    await getPaymentsApi().cardPaymentControllerVerificationStatus({
      paymentFlowId: paymentFlowId as string,
    })

  return res.json(response)
}
