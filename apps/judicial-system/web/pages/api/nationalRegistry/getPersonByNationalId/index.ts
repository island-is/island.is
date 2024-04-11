import { NextApiRequest, NextApiResponse } from 'next'

import { NationalRegistryResponsePerson } from '@island.is/judicial-system-web/src/types'

const getPersonByNationalId = async (
  nationalId: string,
): Promise<NationalRegistryResponsePerson> => {
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
  const nationalId = (req.query.nationalId as string).replace('-', '')

  const people = await getPersonByNationalId(nationalId)
  res.status(200).json(people)
}
