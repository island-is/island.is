import { uuid } from 'uuidv4'

import {
  CaseState,
  CaseType,
  indictmentCases,
  InstitutionType,
  investigationCases,
  prosecutionRoles,
  restrictionCases,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../..'
import { canUserAccessCase } from '../case.filter'
import { verifyNoAccess, verifyReadAccess } from './verify'

const continueFromCreatingProsecutor = (
  user: User,
  type: CaseType,
  state: CaseState,
  creatingProsecutorInstitutionId?: string,
) => {
  describe('hightened security', () => {
    describe('user is neither creating prosecutor nor assigned prosecutor', () => {
      const theCase = {
        type,
        state,
        creatingProsecutorId: uuid(),
        creatingProsecutor: {
          institutionId: creatingProsecutorInstitutionId,
        },
        prosecutorId: uuid(),
        isHeightenedSecurityLevel: true,
      } as Case

      let hasReadAccess: boolean
      let hasWriteAccess: boolean

      beforeEach(() => {
        hasReadAccess = canUserAccessCase(theCase, user, false)
        hasWriteAccess = canUserAccessCase(theCase, user, true)
      })

      it('should have no access', () => {
        expect(hasReadAccess).toBe(false)
        expect(hasWriteAccess).toBe(false)
      })
    })

    describe('user is creating prosecutor', () => {
      const theCase = {
        type,
        state,
        creatingProsecutorId: user.id,
        creatingProsecutor: {
          institutionId: creatingProsecutorInstitutionId,
        },
        prosecutorId: uuid(),
        isHeightenedSecurityLevel: true,
      } as Case

      let hasReadAccess: boolean
      let hasWriteAccess: boolean

      beforeEach(() => {
        hasReadAccess = canUserAccessCase(theCase, user, false)
        hasWriteAccess = canUserAccessCase(theCase, user, true)
      })

      it('should have full access', () => {
        expect(hasReadAccess).toBe(true)
        expect(hasWriteAccess).toBe(true)
      })
    })

    describe('user is assigned prosecutor', () => {
      const theCase = {
        type,
        state,
        creatingProsecutorId: uuid(),
        creatingProsecutor: {
          institutionId: creatingProsecutorInstitutionId,
        },
        prosecutorId: user.id,
        isHeightenedSecurityLevel: true,
      } as Case

      let hasReadAccess: boolean
      let hasWriteAccess: boolean

      beforeEach(() => {
        hasReadAccess = canUserAccessCase(theCase, user, false)
        hasWriteAccess = canUserAccessCase(theCase, user, true)
      })

      it('should have full access', () => {
        expect(hasReadAccess).toBe(true)
        expect(hasWriteAccess).toBe(true)
      })
    })
  })

  describe('not hightened security', () => {
    const theCase = {
      type,
      state,
      creatingProsecutor: { institutionId: creatingProsecutorInstitutionId },
    } as Case

    let hasReadAccess: boolean
    let hasWriteAccess: boolean

    beforeEach(() => {
      hasReadAccess = canUserAccessCase(theCase, user, false)
      hasWriteAccess = canUserAccessCase(theCase, user, true)
    })

    it('should have full access', () => {
      expect(hasReadAccess).toBe(true)
      expect(hasWriteAccess).toBe(true)
    })
  })
}

const continueFromType = (user: User, type: CaseType) => {
  const accessibleCaseStates = [
    CaseState.NEW,
    CaseState.DRAFT,
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
    CaseState.ACCEPTED,
    CaseState.REJECTED,
    CaseState.DISMISSED,
  ]

  describe.each(
    Object.values(CaseState).filter(
      (state) => !accessibleCaseStates.includes(state),
    ),
  )('inaccessible case state %s', (state) => {
    const theCase = { type, state } as Case

    verifyNoAccess(theCase, user)
  })

  describe.each(accessibleCaseStates)('accessible case state %s', (state) => {
    describe('creating prosecutor is defined', () => {
      describe('user is from different institution', () => {
        describe('case is not shared with user institution', () => {
          const theCase = {
            type,
            state,
            creatingProsecutor: { institutionId: uuid() },
          } as Case

          verifyNoAccess(theCase, user)
        })

        describe('case is shared with user institution', () => {
          const theCase = {
            type,
            state,
            creatingProsecutor: { institutionId: uuid() },
            sharedWithProsecutorsOfficeId: user.institution?.id,
          } as Case

          verifyReadAccess(theCase, user)
        })
      })

      describe('user is from same institution', () => {
        continueFromCreatingProsecutor(user, type, state, user.institution?.id)
      })
    })

    describe('creating prosecutor is undefined', () => {
      continueFromCreatingProsecutor(user, type, state, undefined)
    })
  })
}

describe('prosecusion user PROSECUTOR', () => {
  const user = {
    id: uuid(),
    role: UserRole.PROSECUTOR,
    institution: { id: uuid(), type: InstitutionType.PROSECUTORS_OFFICE },
  } as User

  describe.each([
    ...restrictionCases,
    ...investigationCases,
    ...indictmentCases,
  ])('accessible case type %s', (type) => {
    continueFromType(user, type)
  })
})

describe.each(prosecutionRoles.filter((role) => role !== UserRole.PROSECUTOR))(
  'prosecusion user %s',
  (role) => {
    const user = {
      id: uuid(),
      role,
      institution: { id: uuid(), type: InstitutionType.PROSECUTORS_OFFICE },
    } as User

    const accessibleCaseTypes = indictmentCases

    describe.each(
      Object.values(CaseType).filter(
        (type) => !accessibleCaseTypes.includes(type),
      ),
    )('inaccessible case type %s', (type) => {
      const theCase = { type } as Case

      verifyNoAccess(theCase, user)
    })

    describe.each(accessibleCaseTypes)('accessible case type %s', (type) => {
      continueFromType(user, type)
    })
  },
)
