import { NextApiRequest, NextApiResponse } from 'next'
import type { Lawyer } from '@island.is/judicial-system-web/src/types'
import type { LawyerFull } from './index'

function mapToLawyer(lawyer: LawyerFull): Lawyer {
  return {
    name: lawyer.Name,
    practice: lawyer.Practice,
    email: lawyer.Email,
    phoneNr: lawyer.GSM,
    nationalId: lawyer.SSN,
  }
}

async function getLawyer(nationalId: string): Promise<Lawyer> {
  const response = await fetch(`https://lmfi.is/api/lawyer/${nationalId}`, {
    headers: {
      Authorization: `Basic ${process.env.LAWYERS_ICELAND_API_KEY}`,
      Accept: 'application/json',
    },
  })

  if (response.ok) {
    const lawyer = await response.json()
    const lawyerMapped = (lawyer || {}).map(mapToLawyer)
    return lawyerMapped
  }

  const reason = await response.text()
  console.error('Failed to get lawyer:', reason)
  throw new Error(reason)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const laywer = await getLawyer(req.body.nationalId)

  /* Max age is 30 minutes, revalided if repeated within 30 sec*/
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=30',
  )
  res.status(200).json(laywer)
}
