import { HttpMethod, Response } from '@anev/ts-mountebank'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import formatISO from 'date-fns/formatISO'
import { Labor, NationalRegistry } from '../../../../../infra/src/dsl/xroad'
import { addXroadMock } from '@island.is/testing/e2e'

export const loadParentalLeaveXroadMocks = async () => {
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
    apiPath: '/api/v1/einstaklingar/0101303019/hjuskapur',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody({
      kennitalaMaka: '0101307789',
      nafnMaka: 'Gervimaður útlönd',
      hjuskaparkodi: '3',
      breytt: '2021-05-26T22:23:40.513',
    }),
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
        {
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
  await addXroadMock({
    config: Labor,
    prefix: 'XROAD_VMST_API_PATH',
    apiPath: '/users/0101303019/parental-leaves/periods/length',
    response: new Response().withJSONBody({
      periodLength: 98,
    }),
    prefixType: 'base-path-with-env',
    serviceMemberCode: 'XROAD_VMST_MEMBER_CODE',
  })
  await addXroadMock({
    config: Labor,
    prefix: 'XROAD_VMST_API_PATH',
    serviceMemberCode: 'XROAD_VMST_MEMBER_CODE',
    apiPath: '/users/0101303019/parental-leaves',
    response: [
      new Response().withJSONBody({
        status: 'TestOK',
      }),
      new Response().withJSONBody({
        status: 'OK',
        id: '23234',
      }),
    ],
    prefixType: 'base-path-with-env',
    method: HttpMethod.POST,
  })
  await addXroadMock({
    config: Labor,
    prefix: 'XROAD_VMST_API_PATH',
    serviceMemberCode: 'XROAD_VMST_MEMBER_CODE',
    apiPath: '/users/0101303019/parental-leaves',
    response: [
      new Response().withJSONBody({
        parentalLeaves: [],
      }),
    ],
    prefixType: 'base-path-with-env',
    method: HttpMethod.GET,
  })
  const babyBDayRandomFactor = Math.ceil(Math.random() * 85)
  await addXroadMock({
    config: Labor,
    prefix: 'XROAD_VMST_API_PATH',
    serviceMemberCode: 'XROAD_VMST_MEMBER_CODE',
    apiPath: '/users/0101303019/pregnancy-status',
    response: [
      new Response().withJSONBody({
        hasActivePregnancy: true,
        expectedDateOfBirth: formatISO(
          addDays(addMonths(new Date(), 6), babyBDayRandomFactor),
          {
            representation: 'date',
          },
        ),
      }),
    ],
    prefixType: 'base-path-with-env',
  })
}
