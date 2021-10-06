import { rest } from 'msw'
import { Test } from '@nestjs/testing'
import { startMocking } from '@island.is/shared/mocking'
import { RegulationsService, REGULATIONS_OPTIONS } from './regulations'
import { Regulation, RegulationViewTypes } from '@island.is/regulations/web'
import { demoRegulation } from './regulations.mocks'

// MOCK START
enum expectedResult {
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
  condition: expectedResult,
): RegulationRestResponse => {
  switch (condition) {
    case expectedResult.SUCCESS: {
      return {
        status: 200,
        body: { demoRegulation },
      }
    }
    case expectedResult.EMPTY: {
      return {
        status: 200,
        body: {},
      }
    }
    case expectedResult.SERVER_ERROR: {
      return {
        status: 500,
      }
    }
    case expectedResult.NOT_FOUND:
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
      const response = createRegulationResponse(params.condition)
      return res(ctx.status(response.status), ctx.json(response?.body ?? ''))
    },
  ),
]

startMocking(handlers)
// MOCK END

const getNestModule = async (condition: expectedResult) => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      RegulationsService,
      {
        provide: REGULATIONS_OPTIONS,
        useValue: {
          url: regulationsDomain,
        },
      },
    ],
  }).compile()

  return moduleRef.get<RegulationsService>(RegulationsService)
}

describe('getRegulation', () => {
  let regulationsService: RegulationsService

  beforeEach(async () => {
    regulationsService = await getNestModule(expectedResult.SUCCESS)
  })

  it('should throw on error', async () => {
    // @ts-expect-error  (testing bad input)
    const emptyName: RegQueryName = ''
    // @ts-expect-error  (testing bad input)
    const badName: RegQueryName = 'NNNN-NNNN'
    // @ts-expect-error  (testing bad input)
    const watName: RegQueryName = expectedResult.SERVER_ERROR

    await expect(
      regulationsService.getRegulation(RegulationViewTypes.original, emptyName),
    ).rejects.toThrow()
    await expect(
      regulationsService.getRegulation(RegulationViewTypes.current, badName),
    ).rejects.toThrow()
    await expect(
      regulationsService.getRegulation(RegulationViewTypes.original, watName),
    ).rejects.toThrow()
  })
})
