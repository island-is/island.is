import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { JwtAuthUserGuard, RolesGuard } from '@island.is/judicial-system/auth'
import {
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../../../case/test/createTestingCaseModule'

import { runGuardChain, runInRequestContext } from '../../../../test'
import { CaseExistsForUpdateGuard } from '../../../case/guards/caseExistsForUpdate.guard'
import { CaseTypeGuard } from '../../../case/guards/caseType.guard'
import { CaseWriteGuard } from '../../../case/guards/caseWrite.guard'
import {
  Case,
  CaseRepositoryService,
  CourtDocument,
  CourtSession,
} from '../../../repository'
import { CourtDocumentController } from '../../courtDocument.controller'
import { CourtSessionExistsGuard } from '../../guards/courtSessionExists.guard'
import { FiledCourtDocumentExistsGuard } from '../../guards/filedCourtDocumentExists.guard'
import { UnfiledCourtDocumentExistsGuard } from '../../guards/unfiledCourtDocumentExists.guard'

// Every route's guards, executed rather than merely declared.
//
// courtDocumentControllerGuards.spec.ts pins the declared order and
// courtDocumentRolesRules.spec.ts pins that no rule on any route reads the
// case. Neither runs a guard, and a wrong order here is not visible anywhere
// else: guards do not execute in controller unit tests, so a chain that locks
// the case row for every authenticated caller - or one that never reads the
// case the guards after it depend on - passes the whole suite. This table
// runs them, in Nest's order.
//
// Authentication is out of the picture: every row supplies a user, and what is
// tested is what the route's authorization guards do with them. Passport's
// real jwt strategy is not registered in a unit test, so it stands in as a
// subclass - the chain still refuses to run if the controller gains a
// class-level guard this spec does not account for.
class AuthenticatedGuard extends JwtAuthUserGuard {
  canActivate = () => true
}

const allowedRoles = [
  UserRole.DISTRICT_COURT_JUDGE,
  UserRole.DISTRICT_COURT_REGISTRAR,
  UserRole.DISTRICT_COURT_ASSISTANT,
]
const rejectedRoles = Object.values(UserRole).filter(
  (role) => !allowedRoles.includes(role),
)

// What each route resolves after the class-level chain: the session it names
// in the path, and the document - one filed in that session, or one still
// unfiled on the case. All of it is looked up on request.case.
type DocumentKind = 'filed' | 'unfiled' | undefined

const routes: [string, boolean, DocumentKind][] = [
  ['create', true, undefined],
  ['update', true, 'filed'],
  ['fileInCourtSession', false, 'unfiled'],
  ['delete', true, 'filed'],
]

describe.each(routes)(
  'CourtDocumentController - %s guard chain',
  (methodName, namesSession, documentKind) => {
    const courtId = uuid()
    const courtSessionId = uuid()
    const filedCourtDocumentId = uuid()
    const unfiledCourtDocumentId = uuid()

    const courtUser = (role: UserRole, institutionId = courtId) =>
      ({
        id: uuid(),
        role,
        institution: {
          id: institutionId,
          type: InstitutionType.DISTRICT_COURT,
        },
      } as User)

    const transaction = {} as Transaction

    const indictmentCaseAtCourt = (caseId: string) =>
      ({
        id: caseId,
        type: CaseType.INDICTMENT,
        state: CaseState.RECEIVED,
        courtId,
        courtSessions: [
          {
            id: courtSessionId,
            caseId,
            filedDocuments: [
              { id: filedCourtDocumentId, caseId } as CourtDocument,
            ],
          } as CourtSession,
        ],
        unfiledCourtDocuments: [
          { id: unfiledCourtDocumentId, caseId } as CourtDocument,
        ],
      } as Case)

    const documentId = () =>
      documentKind === 'filed' ? filedCourtDocumentId : unfiledCourtDocumentId

    let mockCaseRepositoryService: CaseRepositoryService
    let runChain: (
      user: User,
      caseId: string,
      params?: { courtSessionId?: string; courtDocumentId?: string },
    ) => Promise<{ allowed: boolean; rejectedBy?: string; error?: Error }>

    beforeEach(async () => {
      const { caseRepositoryService, caseService, sequelize } =
        await createTestingCaseModule()

      mockCaseRepositoryService = caseRepositoryService

      const mockTransaction = (sequelize as Sequelize).transaction as jest.Mock
      mockTransaction.mockResolvedValue(transaction)

      // One instance per guard the chain declares as a class. CaseTypeGuard is
      // declared as a configured instance and carries its own allowed case
      // types. RolesGuard gets a real Reflector so it resolves the route's
      // rules from its own metadata.
      const guards = [
        new AuthenticatedGuard(),
        new RolesGuard(new Reflector()),
        new CaseExistsForUpdateGuard(caseService, sequelize),
        new CaseWriteGuard(),
        new CourtSessionExistsGuard(),
        new FiledCourtDocumentExistsGuard(),
        new UnfiledCourtDocumentExistsGuard(),
      ]

      runChain = (
        user,
        caseId,
        {
          courtSessionId: requestedCourtSessionId = courtSessionId,
          courtDocumentId: requestedCourtDocumentId = documentId(),
        } = {},
      ) =>
        runInRequestContext(() =>
          runGuardChain(CourtDocumentController, methodName, guards, {
            params: {
              caseId,
              ...(namesSession && { courtSessionId: requestedCourtSessionId }),
              ...(documentKind && {
                courtDocumentId: requestedCourtDocumentId,
              }),
            },
            user: { currentUser: user },
            case: undefined,
          }),
        )
    })

    describe.each(allowedRoles)("%s at the case's court", (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(
          indictmentCaseAtCourt(caseId),
        )

        then = await runChain(courtUser(role), caseId)
      })

      it('should let the whole chain through', () => {
        expect(then.error).toBeUndefined()
        expect(then.rejectedBy).toBeUndefined()
        expect(then.allowed).toBe(true)
      })

      it('should read the case under the request transaction', () => {
        expect(
          mockCaseRepositoryService.findLiveByIdForUpdate,
        ).toHaveBeenCalledWith(caseId, transaction)
      })
    })

    describe.each(rejectedRoles)('%s', (role) => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(
          indictmentCaseAtCourt(caseId),
        )

        then = await runChain(courtUser(role), caseId)
      })

      it('should be rejected by RolesGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(RolesGuard.name)
      })

      // The point of keeping RolesGuard first: this caller is turned away
      // before the case is read, so no FOR UPDATE lock is taken on its behalf.
      // The repository stub is primed with a case above, so this fails if the
      // read happens - rather than passing because the read would have failed
      // anyway.
      it('should not read the case', () => {
        expect(
          mockCaseRepositoryService.findLiveByIdForUpdate,
        ).not.toHaveBeenCalled()
      })
    })

    describe('case does not exist', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(null)

        then = await runChain(courtUser(UserRole.DISTRICT_COURT_JUDGE), caseId)
      })

      it('should be rejected by the case-exists guard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseExistsForUpdateGuard.name)
        expect(then.error).toBeInstanceOf(NotFoundException)
      })
    })

    // The guards after the locking read all decide from request.case. Each of
    // them throws a 500 for a missing case and a 403 or 404 for the case it
    // was given, so the error type is what shows the read came first.
    describe('case is not an indictment case', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce({
          ...indictmentCaseAtCourt(caseId),
          type: CaseType.CUSTODY,
        } as Case)

        then = await runChain(courtUser(UserRole.DISTRICT_COURT_JUDGE), caseId)
      })

      it('should be rejected by CaseTypeGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseTypeGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })
    })

    describe('judge at another court', () => {
      const caseId = uuid()
      let then: Awaited<ReturnType<typeof runChain>>

      beforeEach(async () => {
        const mockFindLiveByIdForUpdate =
          mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
        mockFindLiveByIdForUpdate.mockResolvedValueOnce(
          indictmentCaseAtCourt(caseId),
        )

        then = await runChain(
          courtUser(UserRole.DISTRICT_COURT_JUDGE, uuid()),
          caseId,
        )
      })

      it('should be rejected by CaseWriteGuard', () => {
        expect(then.allowed).toBe(false)
        expect(then.rejectedBy).toBe(CaseWriteGuard.name)
        expect(then.error).toBeInstanceOf(ForbiddenException)
      })
    })

    if (namesSession) {
      describe('court session is not on the case', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveByIdForUpdate =
            mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
          mockFindLiveByIdForUpdate.mockResolvedValueOnce(
            indictmentCaseAtCourt(caseId),
          )

          then = await runChain(
            courtUser(UserRole.DISTRICT_COURT_JUDGE),
            caseId,
            { courtSessionId: uuid() },
          )
        })

        // CourtSessionExistsGuard looks the session up in the case's own
        // sessions - the locked row's list, so a session a concurrent request
        // has just deleted is not found here.
        it('should be rejected by CourtSessionExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(CourtSessionExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })
    }

    if (documentKind === 'filed') {
      describe('court document is not filed in the session', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveByIdForUpdate =
            mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
          mockFindLiveByIdForUpdate.mockResolvedValueOnce(
            indictmentCaseAtCourt(caseId),
          )

          then = await runChain(
            courtUser(UserRole.DISTRICT_COURT_JUDGE),
            caseId,
            { courtDocumentId: uuid() },
          )
        })

        // FiledCourtDocumentExistsGuard reads the session that
        // CourtSessionExistsGuard put on the request, so it too decides from
        // the locked case.
        it('should be rejected by FiledCourtDocumentExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(FiledCourtDocumentExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })
    }

    if (documentKind === 'unfiled') {
      describe('court document is not unfiled on the case', () => {
        const caseId = uuid()
        let then: Awaited<ReturnType<typeof runChain>>

        beforeEach(async () => {
          const mockFindLiveByIdForUpdate =
            mockCaseRepositoryService.findLiveByIdForUpdate as jest.Mock
          mockFindLiveByIdForUpdate.mockResolvedValueOnce(
            indictmentCaseAtCourt(caseId),
          )

          then = await runChain(
            courtUser(UserRole.DISTRICT_COURT_JUDGE),
            caseId,
            { courtDocumentId: filedCourtDocumentId },
          )
        })

        // A document already filed in a session is not in the case's unfiled
        // list, so it cannot be filed twice from the same snapshot.
        it('should be rejected by UnfiledCourtDocumentExistsGuard', () => {
          expect(then.allowed).toBe(false)
          expect(then.rejectedBy).toBe(UnfiledCourtDocumentExistsGuard.name)
          expect(then.error).toBeInstanceOf(NotFoundException)
        })
      })
    }
  },
)
