import { rest } from 'msw'
import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { startMocking } from '@island.is/shared/mocking'
import { RegulationsService } from './regulations.service'
import { Regulation } from '@island.is/regulations'
import { RegulationViewTypes } from '@island.is/regulations/web'
import { demoRegulation } from './regulations.mocks'
import { RegulationsClientConfig } from './regulations.config'

// MOCK START
enum ExpectedResult {
  SUCCESS = 'success',
  NOT_FOUND = 'notFound',
  EMPTY = 'empty',
  SERVER_ERROR = 'serverError',
}
type RegulationRestResponse = {
  status: 200 | 400 | 404 | 500
  body?: Regulation | {}
}

// we use ssn param to define success or error case here
const createRegulationResponse = (
  condition: ExpectedResult,
): RegulationRestResponse => {
  switch (condition) {
    case ExpectedResult.SUCCESS: {
      return {
        status: 200,
        body: { demoRegulation },
      }
    }
    case ExpectedResult.EMPTY: {
      return {
        status: 200,
        body: {},
      }
    }
    case ExpectedResult.SERVER_ERROR: {
      return {
        status: 500,
      }
    }
    case ExpectedResult.NOT_FOUND:
    default: {
      return {
        status: 404,
      }
    }
  }
}

const regulationsDomain = 'http://testdomain.is/api/v1'
const regulationsUrl = (path: string) =>
  new URL(path, regulationsDomain).toString()

const handlers = [
  rest.get(
    regulationsUrl('/regulation/:condition/original'),
    (req, res, ctx) => {
      const { params } = req
      const response = createRegulationResponse(
        params.condition as ExpectedResult,
      )
      return res(ctx.status(response.status), ctx.json(response?.body ?? ''))
    },
  ),
]

startMocking(handlers)
// MOCK END

const getNestModule = async (condition: ExpectedResult) => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      RegulationsService,
      {
        provide: LOGGER_PROVIDER,
        useValue: logger,
      },
    ],
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [RegulationsClientConfig],
      }),
    ],
  }).compile()

  return moduleRef.resolve<RegulationsService>(RegulationsService)
}

describe('getRegulation', () => {
  let regulationsService: RegulationsService

  beforeEach(async () => {
    regulationsService = await getNestModule(ExpectedResult.SUCCESS)
  })

  it('should throw on error', async () => {
    // @ts-expect-error  (testing bad input)
    const emptyName: RegQueryName = ''
    // @ts-expect-error  (testing bad input)
    const badName: RegQueryName = 'NNNN-NNNN'
    // @ts-expect-error  (testing bad input)
    const watName: RegQueryName = ExpectedResult.SERVER_ERROR

    expect(
      await regulationsService.getRegulation(
        RegulationViewTypes.original,
        emptyName,
      ),
    ).toBe(null)
    expect(
      await regulationsService.getRegulation(
        RegulationViewTypes.current,
        badName,
      ),
    ).toBe(null)
    expect(
      await regulationsService.getRegulation(
        RegulationViewTypes.original,
        watName,
      ),
    ).toBe(null)
  })
})
