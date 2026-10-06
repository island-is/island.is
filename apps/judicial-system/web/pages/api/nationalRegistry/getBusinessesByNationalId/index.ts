import type { NextApiRequest, NextApiResponse } from 'next'

import type { NationalRegistryResponseBusiness } from '../../../../src/types'
import { authenticateApiRequest } from '../../../../src/utils/apiAuthentication'
import { shouldMockNationalRegistry } from '../../../../src/utils/nationalRegistryMock'
import { readNationalIdQueryParameter } from '../../../../src/utils/nationalRegistryQuery'
import { fakeBusiness } from '../constants'

const getBusinessesByNationalId = async (
  nationalId: string,
): Promise<NationalRegistryResponseBusiness> => {
  const response = await fetch(
    `https://api.ja.is/skra/v1/businesses?kennitala=${nationalId}`,
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
  if (!authenticateApiRequest(req)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const nationalId = readNationalIdQueryParameter(req.query)

  if (!nationalId) {
    return res.status(400).json({ message: 'Invalid national id' })
  }

  const businesses = shouldMockNationalRegistry()
    ? { items: [fakeBusiness] }
    : await getBusinessesByNationalId(nationalId)

  res.status(200).json(businesses)
}
