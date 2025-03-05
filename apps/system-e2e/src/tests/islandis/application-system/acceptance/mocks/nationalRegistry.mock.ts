import { Response } from '@anev/ts-mountebank'
import { NationalRegistry } from '../../../../../../../../infra/src/dsl/xroad'
import { addXroadMock } from '../../../../../support/wire-mocks'

export const loadNationalRegistryXroadMocks = async () => {
  /* Gervimaður Afríka */
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
