import { addXroadMock, resetMocks, wildcard } from '../../../support/wire-mocks'
import { HttpMethod, Response } from '@anev/ts-mountebank'
import { EinstaklingsupplysingarToJSON } from '../../../../../../libs/clients/national-registry/v2/gen/fetch'
import { Labor, NationalRegistry } from '../../../../../../infra/src/dsl/xroad'
import { PostParentalLeaveResponseToJSON } from '../../../../../../libs/clients/vmst/gen/fetch'
import formatISO from 'date-fns/formatISO'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'

export async function setupXroadMocks() {
  await resetMocks()
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019',
    new Response().withJSONBody(
      EinstaklingsupplysingarToJSON({
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
    ),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/1111111119',
    new Response().withJSONBody(
      EinstaklingsupplysingarToJSON({
        kennitala: '1111111119',
        nafn: 'Stubbur Maack',
        eiginnafn: 'Stubbur',
        millinafn: null,
        kenninafn: 'Maack',
        fulltNafn: 'Stubbur Maack',
        kynkodi: '3',
        bannmerking: false,
        faedingardagur: new Date('2011-11-11T00:00:00'),
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
    ),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101307789',
    new Response().withJSONBody(
      EinstaklingsupplysingarToJSON({
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
    ),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019/forsja',
    new Response().withJSONBody(['1111111119']),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019/forsja/1111111119',
    new Response().withJSONBody(['0101307789']),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019/hjuskapur',
    new Response().withJSONBody({
      kennitalaMaka: '0101307789',
      nafnMaka: 'Gervimaður útlönd',
      hjuskaparkodi: '3',
      breytt: '2021-05-26T22:23:40.513',
    }),
  )
  await addXroadMock(
    NationalRegistry,
    'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    '/api/v1/einstaklingar/0101303019/fjolskyldumedlimir',
    new Response().withJSONBody({
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
  )
  await addXroadMock(
    Labor,
    'XROAD_VMST_API_PATH',
    '/users/0101303019/parental-leaves/periods/length',
    new Response().withJSONBody({
      periodLength: 98,
    }),
    'base-path-with-env',
  )
  await addXroadMock(
    Labor,
    'XROAD_VMST_API_PATH',
    '/users/0101303019/parental-leaves',
    [
      new Response().withJSONBody(
        PostParentalLeaveResponseToJSON({
          status: 'TestOK',
        }),
      ),
      new Response().withJSONBody(
        PostParentalLeaveResponseToJSON({
          status: 'OK',
          id: '23234',
        }),
      ),
    ],
    'base-path-with-env',
    HttpMethod.POST,
  )
  await addXroadMock(
    Labor,
    'XROAD_VMST_API_PATH',
    '/users/0101303019/parental-leaves',
    [
      new Response().withJSONBody({
        parentalLeaves: [],
      }),
    ],
    'base-path-with-env',
    HttpMethod.GET,
  )
  const babyBDayRandomFactor = Math.ceil(Math.random() * 85)

  await addXroadMock(
    Labor,
    'XROAD_VMST_API_PATH',
    '/users/0101303019/pregnancy-status',
    [
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
    'base-path-with-env',
  )
  await wildcard()
}
