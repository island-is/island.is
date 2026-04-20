import { Response } from '@anev/ts-mountebank'
import {
  NationalRegistry,
  NationalRegistryB2C,
} from '../../../../../../../../infra/src/dsl/xroad'
import { addXroadMock } from '../../../../../support/wire-mocks'

export const loadNationalRegistryXroadMocks = async () => {
  /* Gervimaður Ameríka */
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_PATH',
    apiPath: '/Midlun/v1/Einstaklingar/0101302989',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitala: '0101302989',
      nafn: 'Gervimaður Ameríka',
    }),
  })
  /* Gervimaður Evrópa */
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_PATH',
    apiPath: '/Midlun/v1/Einstaklingar/0101302719',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitala: '0101302719',
      nafn: 'Gervimaður Evrópa',
    }),
  })

  /* Gervimaður Afríka */
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
    apiPath: '/Einstaklingar/0101303019',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitala: '0101303019',
      nafn: 'Gervimaður Afríka',
      kynKodi: '1',
      kynTexti: 'Karl',
      bannmerking: false,
      faedingardagur: '1930-01-01T00:00:00',
      logheimili: {
        heimilisfang: 'Fellsmúli 2',
        ibudanumer: null,
        postnumer: '108',
        stadur: 'Reykjavík',
        sveitarfelagsnumer: '0000',
      },
      adsetur: {
        heimilisfang: 'Engihjalli 3',
        ibudanumer: null,
        postnumer: '200',
        stadur: 'Kópavogur',
        sveitarfelagsnumer: '1000',
      },
    }),
  })
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
    apiPath: '/Einstaklingar/0101303019/forsjaUndir',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      forsjaBornList: [
        {
          barnKt: '1111111119',
          barnNafn: 'Stubbur Maack',
        },
      ],
      forsjaKt: '0101303019',
      forsjaNafn: 'Gervimaður Afríka',
    }),
  })
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
    apiPath: '/Einstaklingar/0101303019/logheimilistengslItar',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      logheimilisTengsl: '0101303019',
      logheimiliseinstaklingar: [
        {
          kennitala: '0101303019',
          nafn: 'Gervimaður Afríka',
          kynKodi: '1',
          kynTexti: 'Karl',
          bannmerking: false,
          faedingardagur: '1930-01-01T00:00:00',
          logheimili: {
            heimilisfang: 'Fellsmúli 2',
            ibudanumer: null,
            postnumer: '108',
            stadur: 'Reykjavík',
            sveitarfelagsnumer: '0000',
          },
          adsetur: {
            heimilisfang: 'Engihjalli 3',
            ibudanumer: null,
            postnumer: '200',
            stadur: 'Kópavogur',
            sveitarfelagsnumer: '1000',
          },
        },
        {
          kennitala: '1111111119',
          nafn: 'Stubbur Maack',
          kynKodi: '3',
          kynTexti: 'Drengur',
          bannmerking: false,
          faedingardagur: '2011-11-11T00:00:00',
          logheimili: {
            heimilisfang: 'Skógarbraut 931A',
            ibudanumer: null,
            postnumer: '262',
            stadur: 'Reykjanesbær',
            sveitarfelagsnumer: '2000',
          },
          adsetur: {
            heimilisfang: 'Fellsmúli 2',
            ibudanumer: null,
            postnumer: '108',
            stadur: 'Reykjavík',
            sveitarfelagsnumer: '0000',
          },
        },
        {
          kennitala: '0101307789',
          nafn: 'Gervimaður útlönd',
          kynKodi: '1',
          kynTexti: 'Karl',
          bannmerking: false,
          faedingardagur: '1930-01-01T00:00:00',
          logheimili: {
            heimilisfang: 'Engihjalli 3',
            ibudanumer: null,
            postnumer: '200',
            stadur: 'Kópavogur',
            sveitarfelagsnumer: '1000',
          },
          adsetur: {
            heimilisfang: 'Fellsmúli 2',
            ibudanumer: null,
            postnumer: '108',
            stadur: 'Reykjavík',
            sveitarfelagsnumer: '0000',
          },
        },
      ],
    }),
  })
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
    apiPath: '/Einstaklingar/0101303019/rikisfang',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kodi: 'IS',
      land: 'Ísland',
    }),
  })
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
    apiPath: '/Einstaklingar/0101303019/hjuskapur',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      hjuskapur: {
        hjuskaparKodi: '1',
        hjuskaparTexti: 'Ógift(ur)',
        dagsetningBreytt: '1992-11-16T00:00:00',
        kennitalaMaka: '0101307789',
        nafnMaka: 'Gervimaður útlönd',
      },
      sambud: {
        sambud: false,
        sambudTexti: null,
        dagsetningBreytt: null,
        kennitalaMaka: null,
        nafnMaka: null,
      },
    }),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101303019',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitala: '0101303019',
      nafn: 'Gervimaður Afríka',
      eiginnafn: 'Gervimaður',
      millinafn: null,
      kenninafn: 'Afríka',
      fulltNafn: 'Gervimaður Afríka',
      kynkodi: '1',
      bannmerking: false,
      faedingardagur: '1930-01-01T00:00:00',
      logheimili: {
        heiti: 'Engihjalli 3',
        postnumer: '200',
        stadur: 'Kópavogur',
        sveitarfelagsnumer: '1000',
      },
      adsetur: {
        heiti: 'Fellsmúli 2',
        postnumer: '108',
        stadur: 'Reykjavík',
        sveitarfelagsnumer: '0000',
      },
    }),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101303019/hjuskapur',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitalaMaka: '0101307789',
      nafnMaka: 'Gervimaður útlönd',
      hjuskaparkodi: '1',
      breytt: '2021-05-26T22:23:40.513',
    }),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101303019/rikisfang',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kodi: 'IS',
      land: 'Ísland',
    }),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101303019/buseta',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      {
        huskodi: '000031440040',
        fasteignanumer: '',
        heimilisfang: 'Gullengi 4',
        postnumer: '112',
        stadur: 'Reykjavík',
        sveitarfelagsnumer: '0000',
        landakodi: 'IS',
        breytt: '2022-07-04T00:00:00',
      },
      {
        huskodi: '99XT00000000',
        fasteignanumer: '',
        heimilisfang: 'Afríka ótilgreint',
        postnumer: null,
        stadur: 'Afríka ótilgreint',
        sveitarfelagsnumer: null,
        landakodi: 'XT',
        breytt: '1992-11-16T00:00:00',
      },
    ]),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101303019/samibuar',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody(['0101303019']),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101303019/forsja',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody(['1111111119']),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101303019/forsja/1111111119',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody(['0101307789']),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101303019/fjolskyldumedlimir',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      fjolskyldunumer: '0101303019',
      einstaklingar: [
        {
          kennitala: '0101303019',
          nafn: 'Gervimaður Afríka',
          eiginnafn: 'Gervimaður',
          millinafn: null,
          kenninafn: 'Afríka',
          fulltNafn: 'Gervimaður Afríka',
          kynkodi: '1',
          bannmerking: false,
          faedingardagur: '1930-01-01T00:00:00',
          logheimili: {
            heiti: 'Gullengi 4',
            postnumer: '112',
            stadur: 'Reykjavík',
            sveitarfelagsnumer: '0000',
          },
          adsetur: {
            heiti: 'Fellsmúli 2',
            postnumer: '108',
            stadur: 'Reykjavík',
            sveitarfelagsnumer: '0000',
          },
        },
        {
          kennitala: '0101307789',
          nafn: 'Gervimaður útlönd',
          eiginnafn: 'Gervimaður',
          millinafn: null,
          kenninafn: 'útlönd',
          fulltNafn: 'Gervimaður útlönd',
          kynkodi: '1',
          bannmerking: false,
          faedingardagur: '1930-01-01T00:00:00',
          logheimili: {
            heiti: 'Engihjalli 3',
            postnumer: '200',
            stadur: 'Kópavogur',
            sveitarfelagsnumer: '1000',
          },
          adsetur: {
            heiti: 'Fellsmúli 2',
            postnumer: '108',
            stadur: 'Reykjavík',
            sveitarfelagsnumer: '0000',
          },
        },
      ],
    }),
  })

  /* Gervimaður útlönd */
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101307789',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitala: '0101307789',
      nafn: 'Gervimaður útlönd',
      eiginnafn: 'Gervimaður',
      millinafn: null,
      kenninafn: 'útlönd',
      fulltNafn: 'Gervimaður útlönd',
      kynkodi: '1',
      bannmerking: false,
      faedingardagur: '1930-01-01T00:00:00',
      logheimili: {
        heiti: 'Engihjalli 3',
        postnumer: '200',
        stadur: 'Kópavogur',
        sveitarfelagsnumer: '1000',
      },
      adsetur: {
        heiti: 'Fellsmúli 2',
        postnumer: '108',
        stadur: 'Reykjavík',
        sveitarfelagsnumer: '0000',
      },
    }),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101307789/hjuskapur',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitalaMaka: '0101303019',
      nafnMaka: 'Gervimaður Afríka',
      hjuskaparkodi: '1',
      breytt: '2021-05-26T22:23:40.513',
    }),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101307789/rikisfang',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kodi: 'IS',
      land: 'Ísland',
    }),
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101307789/faedingarstadur',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      sveitarfelagsnumer: '0000',
      stadur: 'Reykjavík',
      faedingardagur: '1930-01-01T00:00:00',
    }),
  })
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
    apiPath: '/Einstaklingar/0101307789/lite',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitala: '0101307789',
      nafn: 'Gervimaður útlönd',
      logheimili: {
        heimilisfang: 'Engihjalli 3',
        ibudanumer: null,
        postnumer: '200',
        stadur: 'Kópavogur',
        sveitarfelagsnumer: '1000',
      },
      adsetur: {
        heimilisfang: 'Fellsmúli 2',
        ibudanumer: null,
        postnumer: '108',
        stadur: 'Reykjavík',
        sveitarfelagsnumer: '0000',
      },
    }),
  })

  /* Stubbur Maack */
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/1111111119',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitala: '1111111119',
      nafn: 'Stubbur Maack',
      eiginnafn: 'Stubbur',
      millinafn: null,
      kenninafn: 'Maack',
      fulltNafn: 'Stubbur Maack',
      kynkodi: '3',
      bannmerking: false,
      faedingardagur: '2011-11-11T00:00:00',
      logheimili: {
        heiti: 'Skógarbraut 931A',
        postnumer: '262',
        stadur: 'Reykjanesbær',
        sveitarfelagsnumer: '2000',
      },
      adsetur: {
        heiti: 'Fellsmúli 2',
        postnumer: '108',
        stadur: 'Reykjavík',
        sveitarfelagsnumer: '0000',
      },
    }),
  })
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
    apiPath: '/Einstaklingar/1111111119',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitala: '1111111119',
      nafn: 'Stubbur Maack',
      kynKodi: '3',
      kynTexti: 'Drengur',
      bannmerking: false,
      faedingardagur: '2011-11-11T00:00:00',
      logheimili: {
        heimilisfang: 'Skógarbraut 931A',
        ibudanumer: null,
        postnumer: '262',
        stadur: 'Reykjanesbær',
        sveitarfelagsnumer: '2000',
      },
      adsetur: {
        heimilisfang: 'Fellsmúli 2',
        ibudanumer: null,
        postnumer: '108',
        stadur: 'Reykjavík',
        sveitarfelagsnumer: '0000',
      },
    }),
  })
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
    apiPath: '/Einstaklingar/1111111119/rikisfang',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kodi: 'IS',
      land: 'Ísland',
    }),
  })
  await addXroadMock({
    config: NationalRegistryB2C,
    prefix: 'NATIONAL_REGISTRY_B2C_APPLICATION_PATH',
    apiPath: '/Einstaklingar/1111111119/forsjaYfir',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      forsjaAdilarList: [
        {
          forsjaKt: '0101307789',
          forsjaNafn: 'Gervimaður útlönd',
        },
        {
          forsjaKt: '0101303019',
          forsjaNafn: 'Gervimaður Afríka',
        },
      ],
      barnKt: '1111111119',
      barnNafn: 'Stubbur Maack',
    }),
  })

  /* Lyklar */
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/lyklar/hjuskaparkodar/1/1',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kodi: '1',
      lysing: 'Ógiftur',
    }),
  })
}
