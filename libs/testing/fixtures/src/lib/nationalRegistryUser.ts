import * as randomString from 'randomstring'

import { Einstaklingsupplysingar } from '@island.is/clients/national-registry-v2'

const defaultValues: Einstaklingsupplysingar = {
  kennitala: randomString.generate({ length: 10, charset: 'numeric' }),
  nafn: randomString.generate(),
  eiginnafn: randomString.generate(),
  millinafn: randomString.generate(),
  kenninafn: randomString.generate(),
  fulltNafn: randomString.generate(),
  kynkodi: randomString.generate({ length: 1, charset: 'numeric' }),
  bannmerking: false,
  faedingardagur: new Date(),
  logheimili: {
    heiti: randomString.generate(),
    postnumer: randomString.generate({ length: 3, charset: 'numeric' }),
    stadur: randomString.generate(),
    sveitarfelagsnumer: randomString.generate(),
  },
  adsetur: {
    heiti: randomString.generate(),
    postnumer: randomString.generate({ length: 3, charset: 'numeric' }),
    stadur: randomString.generate(),
    sveitarfelagsnumer: randomString.generate(),
  },
}

export const createNationalRegistryUser = ({
  kennitala = defaultValues.kennitala,
  nafn = defaultValues.nafn,
  eiginnafn = defaultValues.eiginnafn,
  millinafn = defaultValues.millinafn,
  kenninafn = defaultValues.kenninafn,
  fulltNafn = defaultValues.fulltNafn,
  kynkodi = defaultValues.kynkodi,
  bannmerking = defaultValues.bannmerking,
  faedingardagur = defaultValues.faedingardagur,
  logheimili = defaultValues.logheimili,
  adsetur = defaultValues.adsetur,
}: Einstaklingsupplysingar = defaultValues): Einstaklingsupplysingar => ({
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
})
