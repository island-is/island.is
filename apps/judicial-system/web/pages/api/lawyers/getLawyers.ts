import { NextApiRequest, NextApiResponse } from 'next'
import type { Lawyer } from '@island.is/judicial-system-web/src/types'

type LawyerFull = {
  Id: number
  Name: string
  Title: string
  Phone: string
  Address: string
  City: string
  PostNumber: string
  Email: string
  Practice: string
  Education: string
  WebPage: string
  CaseCategories: []
  FirstName: string
  MiddleName: string
  SurName: string
  SSN: string
  MailBox: string
  Fax: string
  GSM: string
  HomePhone: string
  DirectPhone: string
  NonIcelandicPhone: string
  PracticeResponsible: string
  LawyerRepresentative: string
  Sex: string
  HdlLicense: string | null
  HrlLicense: string | null
  Insurance: string
  Country: string
  IsPracticing: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Languages: null | any
  InternationConnection: string
}

function mapToLawyer(lawyer: LawyerFull): Lawyer {
  return {
    name: lawyer.Name,
    practice: lawyer.Practice,
    email: lawyer.Email,
    phoneNr: lawyer.GSM,
  }
}

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
