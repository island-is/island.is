import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { TokenGuard } from '@island.is/judicial-system/auth'
import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { CaseExistsGuard } from '../../../case/guards/caseExists.guard'
import { CaseExistsForUpdateGuard } from '../../../case/guards/caseExistsForUpdate.guard'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { Case, CaseRepositoryService, Defendant } from '../../../repository'
import { DefendantExistsGuard } from '../../guards/defendantExists.guard'
import { DefendantNationalIdExistsGuard } from '../../guards/defendantNationalIdExists.guard'
import { InternalDefendantController } from '../../internalDefendant.controller'

// Every route's guards, executed rather than merely declared.
//
// The routes' guards specs pin the declared order. None of them runs a guard,
// and the thing that matters most here is not visible anywhere else: which
// routes read the case under FOR UPDATE. The update route must, so that it
// changes the defendant against a case row no one else can change. The three
// deliver routes must not - they call the court system with no transaction,
// and a locking read there would hold the case lock across external I/O. A
// class-level swap of the exists guard would have done exactly that and
// passed the whole suite, so this table runs each route's chain and asserts
// which read it made.
//
// The routes run the real TokenGuard: it decides from a header alone, so it
// is cheap to run, and the row that sends the wrong token proves neither read
// is made on an unauthenticated caller's behalf.

const defendantId = uuid()
const defendantNationalId = '0101010000'
const secretToken = uuid()

const withDefendant = (theCase: Case) =>
  ({
    ...theCase,
    defendants: [
      {
        id: defendantId,
        caseId: theCase.id,
        nationalId: defendantNationalId,
      } as Defendant,
    ],
  } as Case)

const receivedCustodyCase = (caseId: string) =>
  withDefendant({
    id: caseId,
    type: CaseType.CUSTODY,
    state: CaseState.RECEIVED,
  } as Case)

const receivedIndictmentCase = (caseId: string) =>
  withDefendant({
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.RECEIVED,
  } as Case)

// One row per route: the method, whether it locks the case, the case its
// type guard lets through and one it does not, and the params that name the
// defendant.
type RouteRow = [
  string,
  boolean,
  (caseId: string) => Case,
  (caseId: string) => Case,
  (requested?: string) => Record<string, string>,
  string,
]

const byId = (requested = defendantId) => ({ defendantId: requested })
const byNationalId = (requested = defendantNationalId) => ({
  defendantNationalId: requested,
})

const routes: RouteRow[] = [
  [
    'deliverDefendantToCourt',
    false,
    receivedCustodyCase,
    receivedIndictmentCase,
    byId,
    DefendantExistsGuard.name,
  ],
  [
    'deliverRequestDefendantToCourt',
    false,
    receivedCustodyCase,
    receivedIndictmentCase,
    byId,
    DefendantExistsGuard.name,
  ],
  [
    'updateDefendant',
    true,
    receivedIndictmentCase,
    receivedCustodyCase,
    byNationalId,
    DefendantNationalIdExistsGuard.name,
  ],
  [
    'deliverIndictmentDefendantToCourt',
    false,
    receivedIndictmentCase,
    receivedCustodyCase,
    byId,
    DefendantExistsGuard.name,
  ],
]

describe.each(routes)(
  'InternalDefendantController - %s guard chain',
  (
    methodName,
    locksCase,
    allowedCaseFor,
    wrongTypeCaseFor,
    defendantParams,
    defendantGuardName,
  ) => {
    const transaction = {} as Transaction

    let mockCaseRepositoryService: CaseRepositoryService
    let runChain: (
      authorization: string | undefined,
      caseId: string,
      requestedDefendant?: string,
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    // The read the route must make, and the one it must not.
    const expectedRead = () =>
      (locksCase
        ? mockCaseRepositoryService.findLiveByIdForUpdate
        : mockCaseRepositoryService.findLiveById) as jest.Mock
    const forbiddenRead = () =>
      (locksCase
        ? mockCaseRepositoryService.findLiveById
        : mockCaseRepositoryService.findLiveByIdForUpdate) as jest.Mock

    const primeCase = (theCase: Case | null) => {
      // Both reads are primed, so a route making the wrong one fails on the
      // assertion below rather than on a missing case.
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockResolvedValueOnce(theCase)

      const mockFindLiveByIdForUpdate =
        mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
      mockFindLiveByIdForUpdate.mockResolvedValueOnce(theCase)
    }

    beforeEach(async () => {
      const { caseRepositoryService, caseService, sequelize } =
        await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class. CaseTypeGuard
      // is declared as a configured instance and carries its own allowed
      // case types.
      const guards = [
        new TokenGuard({ jwtSecret: '', secretToken, isConfigured: true }),
        new CaseExistsGuard(caseService),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new DefendantExistsGuard(),
        new DefendantNationalIdExistsGuard(),
      ]

      runChain = (authorization, caseId, requestedDefendant) =>
        runInRequestContext(() =>
          runGuardChain(InternalDefendantController, methodName, guards, {
            params: { caseId, ...defendantParams(requestedDefendant) },
            headers: { authorization },
            case: undefined,
          }),
        )
    })

    describe('defendant on a case of the right type', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(allowedCaseFor(caseId))

        then = await runChain(`Bearer ${secretToken}`, caseId)
      })

      it('should let the whole chain through', () => {
        expect(then.error).toBeUndefined()
        expect(then.rejectedBy).toBeUndefined()
        expect(then.allowed).toBe(true)
      })

      if (locksCase) {
        it('should read the case under the request transaction', () => {
          expect(expectedRead()).toHaveBeenCalledWith(caseId, transaction)
        })
      } else {
        it('should read the case without locking it', () => {
          expect(expectedRead()).toHaveBeenCalledWith(caseId, {
            allowDeleted: false,
            transaction: undefined,
          })
        })
      }

      it('should make no other read of the case', () => {
        expect(forbiddenRead()).not.toHaveBeenCalled()
      })
    })

    describe('wrong token', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(allowedCaseFor(caseId))

        then = await runChain(`Bearer ${uuid()}`, caseId)
      })

      it('should be rejected by TokenGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(TokenGuard.name)
        expect(then.error).toBeInstanceOf(UnauthorizedException)
      })

      it('should not read the case', () => {
        expect(expectedRead()).not.toHaveBeenCalled()
        expect(forbiddenRead()).not.toHaveBeenCalled()
      })
    })

    describe('case does not exist', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(null)

        then = await runChain(`Bearer ${secretToken}`, caseId)
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(
          locksCase ? CaseExistsForUpdateGuard.name : CaseExistsGuard.name,
        )
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })

    // The guards after the exists guard decide from request.case. Each of
    // them throws a 500 for a missing case and a 403 or 404 for the case it
    // was given, so the error type is what shows the read came first.
    describe('case is not of a type the route takes', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(wrongTypeCaseFor(caseId))

        then = await runChain(`Bearer ${secretToken}`, caseId)
      })

      it('should be rejected by CaseTypeGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseTypeGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })

      it('should have read the case first', () => {
        expect(expectedRead()).toHaveBeenCalledTimes(1)
      })
    })

    describe('defendant is not on the case', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        primeCase(allowedCaseFor(caseId))

        then = await runChain(`Bearer ${secretToken}`, caseId, '0202020000')
      })

      // The defendant guards look the defendant up among the case's own
      // defendants, which is the row the update handler then changes - both
      // see the same read.
      it('should be rejected by the defendant guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(defendantGuardName)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })
  },
)
