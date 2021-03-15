import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(401).json({ success: 'false' })
  }

  const { subject, body } = req.body

  const data = JSON.stringify({
    ticket: { requester_id: '431452825554', subject, comment: { body } },
  })

  const token = Buffer.from(
    `${process.env.ZENDESK_EMAIL}/token:${process.env.ZENDESK_TOKEN}`,
  ).toString('base64')

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${token}`,
  }

  let response

  try {
    response = await axios.post(
      `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`,
      data,
      {
        headers,
      },
    )
  } catch (e) {
    return res
      .status(200)
      .json({ success: 'false', message: e.response.statusText })
  }

  return res.status(200).json({ success: 'true' })
}

export default handler
