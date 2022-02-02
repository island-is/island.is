import { NextApiRequest, NextApiResponse } from 'next'

interface NationalRegistryPerson {
  age: number
  age_year_end: number
  banned: boolean
  family_kennitala: string
  gender: string
  kennitala: string
  legal_residence: {
    code: string
    municipality: string
    country: {
      code: string
      country: {
        code: string
        name: {
          en: string
          is: string
        }
      }
      type: string
      municipality: string
    }
  }
  marital_status: {
    type: string
    code: string
    description: {
      en: string
      is: string
    }
  }
  name: string
  partner_kennitala: string
  permanent_address: {
    street: { dative: string; nominative: string }
    postal_code: number
    town: { dative: string; nominative: string }
    country: { code: string; name: { en: string; is: string }; type: string }
    municipality: string
  }
  proxy_kennitala: string
  see_also: { search: string }
  type: string
}

interface NationalRegistryMeta {
  api_version: number
  first_item: number
  last_item: number
  total_items: number
}

export interface NationalRegistryResponse {
  items: NationalRegistryPerson[]
  meta: NationalRegistryMeta
}

async function getByNationalId(
  nationalId: string,
): Promise<NationalRegistryResponse> {
  const response = await fetch(
    `https://api.ja.is/skra/v1/people?kennitala=${nationalId}`,
    {
      headers: {
        Authorization: process.env.NATIONAL_REGISTRY_API_KEY || '',
      },
    },
  )

  return await response.json()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('ASDASDASDASD')
  const nationalId = (req.query.nationalId as string).replace('-', '')
  const people = await getByNationalId(nationalId)
  res.status(200).json(people)
}
