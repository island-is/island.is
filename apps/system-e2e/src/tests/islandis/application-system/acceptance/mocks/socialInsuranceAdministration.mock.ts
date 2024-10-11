import { HttpMethod, Response } from '@anev/ts-mountebank'
import {
  NationalRegistry,
  SocialInsuranceAdministration,
} from '../../../../../../../../infra/src/dsl/xroad'
import { addXroadMock } from '../../../../../support/wire-mocks'

export const loadSocialInsuranceAdministrationXroadMocks = async () => {
  /* NationalRegistry */
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
      faedingardagur: new Date('1930-01-01T00:00:00'),
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
      faedingardagur: new Date('1930-01-01T00:00:00'),
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
    apiPath: '/api/v1/einstaklingar/0101307789/faedingarstadur',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      sveitarfelagsnumer: '0000',
      stadur: 'Reykjavík',
      faedingardagur: '1930-01-01T00:00:00',
    }),
  })
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

  /* SocialInsuranceAdministration */
  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/General/currencies',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody([
      'ZAR',
      'AUD',
      'CAD',
      'CHF',
      'DKK',
      'EUR',
      'GBP',
      'NOK',
      'PLN',
      'SEK',
      'USD',
      'LVL',
      'CZK',
      'SKK',
      'IKR',
      'LTL',
      'VND',
      'BGN',
      'RUB',
      'CNY',
      'ALL',
      'LEI',
      'UAH',
      'HUF',
    ]),
  })
  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/Applicant',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      emailAddress: 'mail@mail.is',
      phoneNumber: null,
      bankAccount: {
        bank: '2222',
        ledger: '00',
        accountNumber: '123456',
      },
    }),
  })
  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/Applicant/oldagepension/eligible',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      isEligible: true,
      reason: null,
      reasonCode: null,
    }),
  })
  await addXroadMock({
    config: SocialInsuranceAdministration,
    prefix: 'XROAD_TR_PATH',
    apiPath: '/api/protected/v1/Application/oldagepension',
    response: new Response().withJSONBody({
      applicationLineId: 1234567,
    }),
    prefixType: 'only-base-path',
    method: HttpMethod.POST,
  })
}
