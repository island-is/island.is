import { rest } from 'msw'
import { Test } from '@nestjs/testing'
import { startMocking } from '@island.is/shared/mocking'
import {
  CompanyRegistryMember,
  RSKCompaniesResponse,
  RSKService,
  RSK_OPTIONS,
} from './rsk'
import { Base64 } from 'js-base64'

// MOCK START
enum expectedResult {
  SUCCESS = 'success',
  NOT_FOUND = 'notFound',
  EMPTY = 'empty',
  SERVER_ERROR = 'serverError',
}
interface RSKRestResponse {
  status: 200 | 404 | 500
  body?: RSKCompaniesResponse
}

// we use ssn param to define success or error case here
const createRSKCompaniesResponse = (
  condition: expectedResult,
): RSKRestResponse => {
  switch (condition) {
    case expectedResult.SUCCESS: {
      return {
        status: 200,
        body: {
          MemberCompanies: [
            {
              ErProkuruhafi: '1',
              ErStjorn: '1',
              Kennitala: '0000000000',
              Nafn: 'Test Testson',
              Rekstarform: 'Kassi',
              StadaAdila: 'Standandi',
            },
            {
              ErProkuruhafi: '0',
              ErStjorn: '1',
              Kennitala: '0000000000',
              Nafn: 'Test Testson',
              Rekstarform: 'Kassi',
              StadaAdila: 'Standandi',
            },
          ],
        },
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

// we just check username to return fail. or success case
const hasAuth = (authHeader: string) => {
  const [username] = Base64.decode(authHeader.substring(6)).split(':')
  return username === expectedResult.SUCCESS
}

const rskDomain = 'http://testDomain.is'
const rskUrl = (path: string) => new URL(path, rskDomain).toString()

const handlers = [
  // serve as an auth middleware
  rest.get('*', (req, res, ctx) => {
    if (!hasAuth(req.headers.get('Authorization') ?? '')) {
      return res(ctx.status(403), ctx.json(''))
    }
  }),
  rest.get(
    rskUrl('/companyregistry/members/:condition/companies'),
    (req, res, ctx) => {
      const { params } = req
      const response = createRSKCompaniesResponse(params.condition)
      return res(ctx.status(response.status), ctx.json(response?.body ?? ''))
    },
  ),
]

startMocking(handlers)
// MOCK END

const getNestModule = async (condition: expectedResult) => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      RSKService,
      {
        provide: RSK_OPTIONS,
        useValue: {
          username: condition === 'empty' ? '' : condition, // this condition defines success or failure
          password: condition === 'empty' ? '' : 'pass123',
          url: rskDomain,
        },
      },
    ],
  }).compile()

  return moduleRef.get<RSKService>(RSKService)
}

describe('getCompaniesByNationalId', () => {
  let rskService: RSKService

  beforeEach(async () => {
    rskService = await getNestModule(expectedResult.SUCCESS)
  })

  it('should return success in teh correct format', async () => {
    const successResults: CompanyRegistryMember[] = [
      {
        hasProcuration: true,
        isPartOfBoardOfDirectors: true,
        nationalId: '0000000000',
        name: 'Test Testson',
        operationalForm: 'Kassi',
        companyStatus: 'Standandi',
      },
      {
        hasProcuration: false,
        isPartOfBoardOfDirectors: true,
        nationalId: '0000000000',
        name: 'Test Testson',
        operationalForm: 'Kassi',
        companyStatus: 'Standandi',
      },
    ]
    const results = await rskService.getCompaniesByNationalId(
      expectedResult.SUCCESS,
    )
    expect(results).toStrictEqual(successResults)
  })

  it('should return empty array when use has no company', async () => {
    const results = await rskService.getCompaniesByNationalId(
      expectedResult.EMPTY,
    )
    expect(results).toEqual([])
  })

  it('should throw on error', async () => {
    await expect(
      rskService.getCompaniesByNationalId(expectedResult.NOT_FOUND),
    ).rejects.toThrow()
    await expect(
      rskService.getCompaniesByNationalId(expectedResult.SERVER_ERROR),
    ).rejects.toThrow()
  })
})

describe('rsk auth', () => {
  it('should return error on failed auth', async () => {
    const rskService = await getNestModule(expectedResult.SERVER_ERROR)
    await expect(
      rskService.getCompaniesByNationalId(expectedResult.SUCCESS),
    ).rejects.toThrow()
  })

  it('should return error on empty auth', async () => {
    const rskService = await getNestModule(expectedResult.EMPTY)
    await expect(
      rskService.getCompaniesByNationalId(expectedResult.SUCCESS),
    ).rejects.toThrow()
  })
})
