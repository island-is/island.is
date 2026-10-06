import faker from 'faker'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { NationalRegistryResponsePerson } from '../../../../src/types'
import { authenticateApiRequest } from '../../../../src/utils/apiAuthentication'
import { shouldMockNationalRegistry } from '../../../../src/utils/nationalRegistryMock'
import { readNationalIdQueryParameter } from '../../../../src/utils/nationalRegistryQuery'
import { fakePerson } from '../constants'

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

  const people: NationalRegistryResponsePerson = shouldMockNationalRegistry()
    ? { items: [createFakePerson()] }
    : await getPersonByNationalId(nationalId)

  res.status(200).json(people)
}
