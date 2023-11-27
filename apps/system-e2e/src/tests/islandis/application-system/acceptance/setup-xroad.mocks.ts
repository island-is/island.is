import {
  addXroadMock,
  resetMocks,
  wildcard,
} from '../../../../support/wire-mocks'
import { HttpMethod, Response } from '@anev/ts-mountebank'
import { EinstaklingsupplysingarToJSON } from '@island.is/clients/national-registry-v2'
import {
  Base,
  Labor,
  NationalRegistry,
} from '../../../../../../../infra/src/dsl/xroad'
import { PostParentalLeaveResponseToJSON } from '@island.is/clients/vmst'
import formatISO from 'date-fns/formatISO'
import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import { getEnvVariables } from '../../../../../../../infra/src/dsl/service-to-environment/pre-process-service'
import { env } from '../../../../support/urls'
import { EnvironmentConfig } from '../../../../../../../infra/src/dsl/types/charts'

export async function setupXroadMocks() {
  await resetMocks()
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101303019',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody(
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
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/1111111119',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody(
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
  })
  await addXroadMock({
    config: NationalRegistry,
    prefix: 'XROAD_NATIONAL_REGISTRY_SERVICE_PATH',
    apiPath: '/api/v1/einstaklingar/0101307789',
    prefixType: 'only-base-path',
    response: new Response().withJSONBody(
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
  const { envs } = getEnvVariables(Base.getEnv(), 'system-e2e', env)
  const xroadBasePath = envs['XROAD_BASE_PATH']
  const path =
    typeof xroadBasePath === 'string'
      ? xroadBasePath
      : xroadBasePath({
          svc: (args) => {
            return args as string
          },
          env: {} as EnvironmentConfig,
        })

  await wildcard(path)
}
