import { faker } from '@faker-js/faker'

import { EinstaklingurDTOAllt } from '@island.is/clients/national-registry-v3'
import { createNationalId } from '@island.is/testing/fixtures'

const createRandomNationalRegistryV3User = (): EinstaklingurDTOAllt => {
  const [givenName, middleName, familyName] = [
    faker.person.firstName(),
    faker.person.middleName(),
    faker.person.lastName(),
  ]
  const name = `${givenName} ${middleName} ${familyName}`

  return {
    kennitala: createNationalId('person'),
    nafn: name,
    fulltNafn: {
      eiginNafn: givenName,
      milliNafn: middleName,
      kenniNafn: familyName,
      fulltNafn: name,
    },
    kyn: {
      kynKodi: faker.number.int({ min: 1, max: 8 }).toString(),
    },
    faedingarstadur: {
      faedingarDagur: faker.date.past({ years: 100 }),
    },
    heimilisfang: {
      husHeiti: faker.location.street(),
      postnumer: faker.location.zipCode(),
      poststod: faker.location.city(),
      sveitarfelag: faker.helpers.arrayElement(faker.definitions.location.city_prefix),
    },
    itarupplysingar: {
      adsetur: {
        husHeiti: faker.location.street(),
        postnumer: faker.location.zipCode(),
        poststod: faker.location.city(),
        sveitarfelag: faker.helpers.arrayElement(faker.definitions.location.city_prefix),
      },
    },
  }
}

export const createNationalRegistryV3User = (
  user: Partial<EinstaklingurDTOAllt> = createRandomNationalRegistryV3User(),
): EinstaklingurDTOAllt => {
  const fallback = createRandomNationalRegistryV3User()

  const {
    kennitala = user['kennitala'] ?? fallback['kennitala'],
    nafn = user['nafn'] ?? fallback['nafn'],
    fulltNafn = user['fulltNafn'] ?? fallback['fulltNafn'],
    kyn = user['kyn'] ?? fallback['kyn'],
    faedingarstadur = user['faedingarstadur'] ?? fallback['faedingarstadur'],
    heimilisfang = user['heimilisfang'] ?? fallback['heimilisfang'],
    itarupplysingar = user['itarupplysingar'] ?? fallback['itarupplysingar'],
  } = user

  return {
    kennitala,
    nafn,
    fulltNafn,
    kyn,
    faedingarstadur,
    heimilisfang,
    itarupplysingar,
  }
}
