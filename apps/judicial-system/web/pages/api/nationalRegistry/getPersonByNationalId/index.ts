import faker from 'faker'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { NationalRegistryResponsePerson } from '../../../../src/types'
import { authenticateApiRequest } from '../../../../src/utils/apiAuthentication'
import { shouldMockNationalRegistry } from '../../../../src/utils/nationalRegistryMock'
import { readNationalIdQueryParameter } from '../../../../src/utils/nationalRegistryQuery'
import { fakePerson } from '../constants'

// Looks a person up by the path endpoint rather than the search endpoint: a
// national id in the path cannot carry a query of its own, so it cannot be
// turned into a search. Returns the registry's single person wrapped in the
// list the client expects, an empty list when nobody matches, or undefined
// when the lookup itself failed.
const getPersonByNationalId = async (
  nationalId: string,
): Promise<NationalRegistryResponsePerson | undefined> => {
  const response = await fetch(
    `https://api.ja.is/skra/v1/people/${nationalId}`,
    {
      headers: {
        Authorization: process.env.NATIONAL_REGISTRY_API_KEY || '',
      },
    },
  )

  // The path endpoint answers 404 for a national id it does not know. That is
  // a lookup that found nobody, not a failure, and the client reads it from an
  // empty list.
  if (response.status === 404) {
    return { items: [] }
  }

  // Any other non-ok status is a real failure; refuse it rather than passing
  // an error body back as if it were a person.
  if (!response.ok) {
    return undefined
  }

  return { items: [await response.json()] }
}

const createFakePerson = () => {
  const street = faker.address.streetAddress()
  const town = faker.address.city()

  return {
    ...fakePerson,
    name: faker.name.findName(),
    permanent_address: {
      ...fakePerson.permanent_address,
      street: { nominative: street, dative: street },
      postal_code: faker.datatype.number({ min: 101, max: 902 }),
      town: { nominative: town, dative: town },
    },
  }
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

  const people: NationalRegistryResponsePerson | undefined =
    shouldMockNationalRegistry()
      ? { items: [createFakePerson()] }
      : await getPersonByNationalId(nationalId)

  if (!people) {
    return res.status(502).json({ message: 'National registry lookup failed' })
  }

  res.status(200).json(people)
}
