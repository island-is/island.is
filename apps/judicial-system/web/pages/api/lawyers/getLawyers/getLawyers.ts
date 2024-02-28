import { NextApiRequest, NextApiResponse } from 'next'

import { type Lawyer, mapToLawyer } from '@island.is/judicial-system/types'

async function getLawyers(): Promise<Lawyer[]> {
  const response = await fetch('https://lmfi.is/api/lawyers', {
    headers: {
      Authorization: `Basic ${process.env.LAWYERS_ICELAND_API_KEY}`,
      Accept: 'application/json',
    },
  })

  if (response.ok) {
    const lawyers = await response.json()
    const lawyersMapped = (lawyers || []).map(mapToLawyer)
    return lawyersMapped
  }

  const reason = await response.text()
  console.error('Failed to get lawyers:', reason)
  throw new Error(reason)
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const laywers = await getLawyers()

  /* Max age is 30 minutes, revalided if repeated within 30 sec*/
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=30',
  )
  res.status(200).json(laywers)
}
