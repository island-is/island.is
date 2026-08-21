import faker from 'faker'
import { NextApiRequest, NextApiResponse } from 'next'

import { NationalRegistryResponsePerson } from '@island.is/judicial-system-web/src/types'

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
  const nationalId = (req.query.nationalId as string).replace('-', '')

  // Each api call costs actual money. This allows us to develop and test
  // without actually making a real api call.
  const people: NationalRegistryResponsePerson =
    process.env.NODE_ENV === 'production'
      ? await getPersonByNationalId(nationalId)
      : { items: [createFakePerson()] }

  res.status(200).json(people)
}
