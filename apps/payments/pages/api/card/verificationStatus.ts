import { getPaymentsApi } from 'apps/payments/services/payment'
import { NextApiRequest, NextApiResponse } from 'next'

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
