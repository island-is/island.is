import * as faker from 'faker'

import { Einstaklingsupplysingar } from '@island.is/clients/national-registry-v2'

const createRandomNationalRegistryUser = (): Einstaklingsupplysingar => {
  const [firstName, middleName, lastName] = [
    faker.name.firstName(),
    faker.name.middleName(),
    faker.name.lastName(),
  ]
  const name = `${firstName} ${middleName} ${lastName}`

  return {
    kennitala: faker.helpers.replaceSymbolWithNumber('##########'),
    nafn: name,
    eiginnafn: firstName,
    millinafn: middleName,
    kenninafn: lastName,
    fulltNafn: name,
    kynkodi: faker.datatype.number({ min: 1, max: 8 }).toString(),
    bannmerking: faker.datatype.boolean(),
    faedingardagur: faker.date.past(),
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
  user: Einstaklingsupplysingar = createRandomNationalRegistryUser(),
): Einstaklingsupplysingar => {
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
