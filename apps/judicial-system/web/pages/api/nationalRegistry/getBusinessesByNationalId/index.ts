import type { NextApiRequest, NextApiResponse } from 'next'

import type { NationalRegistryResponseBusiness } from '../../../../src/types'
import { authenticateApiRequest } from '../../../../src/utils/apiAuthentication'
import { shouldMockNationalRegistry } from '../../../../src/utils/nationalRegistryMock'
import { readNationalIdQueryParameter } from '../../../../src/utils/nationalRegistryQuery'
import { fakeBusiness } from '../constants'

// Looks a business up by the path endpoint rather than the search endpoint: a
// national id in the path cannot carry a query of its own, so it cannot be
// turned into a search. Returns the registry's single business wrapped in the
// list the client expects, an empty list when nothing matches, or undefined
// when the lookup itself failed.
const getBusinessesByNationalId = async (
  nationalId: string,
): Promise<NationalRegistryResponseBusiness | undefined> => {
  const response = await fetch(
    `https://api.ja.is/skra/v1/businesses/${nationalId}`,
    {
      headers: {
        Authorization: process.env.NATIONAL_REGISTRY_API_KEY || '',
      },
    },
  )

  // The path endpoint answers 404 for a national id it does not know. That is
  // a lookup that found nothing, not a failure, and the client reads it from
  // an empty list.
  if (response.status === 404) {
    return { items: [] }
  }

  // Any other non-ok status is a real failure; refuse it rather than passing
  // an error body back as if it were a business.
  if (!response.ok) {
    return undefined
  }

  return { items: [await response.json()] }
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

  const businesses: NationalRegistryResponseBusiness | undefined =
    shouldMockNationalRegistry()
      ? { items: [fakeBusiness] }
      : await getBusinessesByNationalId(nationalId)

  if (!businesses) {
    return res.status(502).json({ message: 'National registry lookup failed' })
  }

  res.status(200).json(businesses)
}
