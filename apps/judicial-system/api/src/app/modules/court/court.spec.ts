import { uuid } from 'uuidv4'
import { formatISO } from 'date-fns'

import { Test } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'
import { CaseType, User } from '@island.is/judicial-system/types'
import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'
import {
  AuthenticateApi,
  CreateCaseApi,
} from '@island.is/judicial-system/court-client'

import { BackendAPI } from '../../../services'
import { environment } from '../../../environments'
import { CourtResolver } from './court.resolver'
import { CourtService } from './court.service'

function expectReceivalDate(receivalDate: string) {
  const date = new Date()
  const today = formatISO(date, { representation: 'date' })
  date.setDate(date.getDate() - 1)
  const yesterday = formatISO(new Date(), { representation: 'date' })
  expect(receivalDate === today || receivalDate === yesterday).toBe(true)
}

describe('CourtModule', () => {
  const authenticationToken = uuid()
  const courtCaseNumber = uuid() // should be of the form 'R-1234/2021', but using random uuid for testing
  let receivalDate: string
  let createCase: jest.Mock
  let courtResolver: CourtResolver

  beforeEach(async () => {
    createCase = jest.fn((args) => {
      receivalDate = args?.createCaseData?.receivalDate

      return Promise.resolve(`"${courtCaseNumber}"`)
    })

    const courtModule = await Test.createTestingModule({
      imports: [
        LoggingModule,
        AuditTrailModule.register(environment.auditTrail),
      ],
      providers: [
        {
          provide: AuthenticateApi,
          useClass: jest.fn(() => ({
            authenticate: () => Promise.resolve(`"${authenticationToken}"`),
          })),
        },
        {
          provide: CreateCaseApi,
          useClass: jest.fn(() => ({
            createCase,
          })),
        },
        CourtResolver,
        CourtService,
      ],
    }).compile()

    courtResolver = courtModule.get<CourtResolver>(CourtResolver)
  })

  describe('Given a case', () => {
    const caseId = uuid()
    const policeCaseNumber = uuid() // should be of the form '111-2021-2', but using random uuid for testing
    const user = {} as User
    let updateCase: jest.Mock

    beforeEach(() => {
      updateCase = jest.fn((args) => {
        return Promise.resolve({ caseId, policeCaseNumber, courtCaseNumber })
      })
    })

    it('should create a custody case', async () => {
      const type = CaseType.CUSTODY

      const res = await courtResolver.createCourtCase(
        { caseId, type, policeCaseNumber },
        user,
        { backendApi: ({ updateCase } as unknown) as BackendAPI },
      )

      expect(createCase).toHaveBeenCalledTimes(1)
      expect(createCase).toHaveBeenCalledWith({
        createCaseData: {
          authenticationToken,
          caseType: 'R - Rannsóknarmál',
          subtype: 'Gæsluvarðhald',
          basedOn: 'Rannsóknarhagsmunir',
          sourceNumber: policeCaseNumber,
          status: 'Skráð',
          receivalDate,
        },
      })
      expectReceivalDate(receivalDate)
      expect(updateCase).toHaveBeenCalledTimes(1)
      expect(updateCase).toHaveBeenCalledWith(caseId, { courtCaseNumber })

      expect(res).toStrictEqual({ caseId, policeCaseNumber, courtCaseNumber })
    })

    it('should create a travel ban case', async () => {
      const type = CaseType.TRAVEL_BAN

      const res = await courtResolver.createCourtCase(
        { caseId, type, policeCaseNumber },
        user,
        { backendApi: ({ updateCase } as unknown) as BackendAPI },
      )

      expect(createCase).toHaveBeenCalledTimes(1)
      expect(createCase).toHaveBeenCalledWith({
        createCaseData: {
          authenticationToken,
          caseType: 'R - Rannsóknarmál',
          subtype: 'Farbann',
          basedOn: 'Rannsóknarhagsmunir',
          sourceNumber: policeCaseNumber,
          status: 'Skráð',
          receivalDate,
        },
      })
      expectReceivalDate(receivalDate)
      expect(updateCase).toHaveBeenCalledTimes(1)
      expect(updateCase).toHaveBeenCalledWith(caseId, { courtCaseNumber })

      expect(res).toStrictEqual({ caseId, policeCaseNumber, courtCaseNumber })
    })
  })
})
