import * as faker from 'faker'

import { NationalRegistryClientPerson } from '@island.is/shared/types'

import { createNationalId } from './nationalId'

const createRandomNationalRegistryUser = (): NationalRegistryClientPerson => {
  const [firstName, middleName, lastName] = [
    faker.name.firstName(),
    faker.name.middleName(),
    faker.name.lastName(),
  ]
  const name = `${firstName} ${middleName} ${lastName}`

  return {
    kennitala: createNationalId('person'),
    nafn: name,
    eiginnafn: firstName,
    millinafn: middleName,
    kenninafn: lastName,
    fulltNafn: name,
    kynkodi: faker.datatype.number({ min: 1, max: 8 }).toString(),
    bannmerking: faker.datatype.boolean(),
    faedingardagur: faker.date.past(100),
    logheimili: {
      heiti: faker.address.streetName(),
      postnumer: faker.address.zipCode(),
      stadur: faker.address.city(),
      sveitarfelagsnumer: faker.address.cityPrefix(),
    },
    adsetur: {
      heiti: faker.address.streetName(),
      postnumer: faker.address.zipCode(),
      stadur: faker.address.city(),
      sveitarfelagsnumer: faker.address.cityPrefix(),
    },
  }
}

export const createNationalRegistryUser = (
  user: Partial<NationalRegistryClientPerson> = createRandomNationalRegistryUser(),
): NationalRegistryClientPerson => {
  const fallback = createRandomNationalRegistryUser()

  const {
    kennitala = user['kennitala'] ?? fallback['kennitala'],
    nafn = user['nafn'] ?? fallback['nafn'],
    eiginnafn = user['eiginnafn'] ?? fallback['eiginnafn'],
    millinafn = user['millinafn'] ?? fallback['millinafn'],
    kenninafn = user['kenninafn'] ?? fallback['kenninafn'],
    fulltNafn = user['fulltNafn'] ?? fallback['fulltNafn'],
    kynkodi = user['kynkodi'] ?? fallback['kynkodi'],
    bannmerking = user['bannmerking'] ?? fallback['bannmerking'],
    faedingardagur = user['faedingardagur'] ?? fallback['faedingardagur'],
    logheimili = user['logheimili'] ?? fallback['logheimili'],
    adsetur = user['adsetur'] ?? fallback['adsetur'],
  } = user

  return {
    kennitala,
    nafn,
    eiginnafn,
    millinafn,
    kenninafn,
    fulltNafn,
    kynkodi,
    bannmerking,
    faedingardagur,
    logheimili,
    adsetur,
  }
}
