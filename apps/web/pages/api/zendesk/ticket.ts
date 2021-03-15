import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { subject, body } = req.body

    const data = JSON.stringify({
      ticket: { subject, comment: { body } },
    })

    const token = Buffer.from(
      'stjanilofts@gmail.com/token:csA8760vTZKc6eSmXsAFH7yF5HsE5gQFVNxSW9lN',
    ).toString('base64')

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    }

    let response

    try {
      response = await axios.post(
        'https://stjanilofts.zendesk.com/api/v2/tickets.json',
        data,
        {
          headers,
        },
      )
    } catch (e) {
      return res
        .status(200)
        .json({ success: 'false', message: e.response.data.error })
    }

    return res.status(200).json({ success: 'true', message: response.data })
  }

  return res
    .status(200)
    .json({ success: 'false', message: 'Must be a POST request.' })
}

export default handler
