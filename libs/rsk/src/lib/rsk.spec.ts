import { rest } from 'msw'
import { Test } from '@nestjs/testing'
import { startMocking } from '@island.is/shared/mocking'
import { LoggingModule } from '@island.is/logging'
import { RSKCompaniesResponse, RSKService, RSK_OPTIONS } from './rsk'

// MOCK START
enum responseCondition {
  SUCCESS = 'success',
  NOT_FOUND = 'notFound',
  EMPTY = 'empty',
}
interface RSKRestResponse {
  status: 200 | 404 | 500
  body?: RSKCompaniesResponse
}
const createRSKCompaniesResponse = (
  condition: responseCondition,
): RSKRestResponse => {
  switch (condition) {
    case responseCondition.SUCCESS: {
      return {
        status: 200,
        body: {
          MemberCompanies: [
            {
              ErProkuruhafi: '1',
              ErStjorn: '1',
              Kennitala: '1111111111',
              Nafn: 'Test Testson',
              Rekstarform: 'Kassi',
              StadaAdila: 'Standandi',
            },
            {
              ErProkuruhafi: '0',
              ErStjorn: '1',
              Kennitala: '1111111111',
              Nafn: 'Test Testson',
              Rekstarform: 'Kassi',
              StadaAdila: 'Standandi',
            },
          ],
        },
      }
    }
    case responseCondition.EMPTY: {
      return {
        status: 200,
        body: {},
      }
    }
    case responseCondition.NOT_FOUND:
    default: {
      return {
        status: 404,
      }
    }
  }
}

const rskDomain = 'http://testDomain.is'
const rskUrl = (path: string) => new URL(path, rskDomain).toString()

const handlers = [
  rest.get(
    rskUrl('/companyregistry/members/:condition/companies'),
    (req, res, ctx) => {
      const { params } = req
      console.log('params.condition', params.condition)
      const response = createRSKCompaniesResponse(params.condition)
      return res(ctx.status(response.status), ctx.json(response.body))
    },
  ),
]

startMocking(handlers)
// MOCK END

describe('rsk service', () => {
  let rskService: RSKService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [
        RSKService,
        {
          provide: RSK_OPTIONS,
          useValue: {
            username: 'tester',
            password: 'pass123',
            url: rskDomain,
          },
        },
      ],
    }).compile()

    rskService = moduleRef.get<RSKService>(RSKService)
  })

  it('should return success', async () => {
    const results = await rskService.getCompaniesByNationalId(
      responseCondition.SUCCESS,
    )
    expect(results).toEqual(
      createRSKCompaniesResponse(responseCondition.SUCCESS).body
        ?.MemberCompanies,
    )
  })

  it('should return empty array when use has no company', async () => {
    const results = await rskService.getCompaniesByNationalId(
      responseCondition.EMPTY,
    )
    expect(results).toEqual([])
  })

  it('should set auth header', async () => {
    const results = await rskService.getCompaniesByNationalId(
      responseCondition.EMPTY,
    )

    expect(results).toEqual([])
  })
})

// TODO: Make MSW return auth error when username/password is not correct
