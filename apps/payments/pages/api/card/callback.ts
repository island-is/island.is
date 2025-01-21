import { getPaymentsApi } from 'apps/payments/services/payment'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function cardVerificationCallbackHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Method not allowed' })
  }

  const contentType = req.headers['content-type']

  if (contentType !== 'application/x-www-form-urlencoded') {
    return res.status(400).json({ error: 'Invalid content-type' })
  }

  const { xid, mdStatus, MD, cavv, dsTransId } = req.body

  if (!MD) {
    return res.status(400).json({ error: 'MD is required' })
  }

  await getPaymentsApi().cardPaymentControllerVerificationCallback({
    verificationCallbackInput: {
      cavv,
      dsTransId,
      md: MD,
      mdStatus,
      xid,
    },
  })

  return res.status(200).json({})
}
