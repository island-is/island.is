import EstateTemplate from './EstateTemplate'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import { EstateTypes, Roles, States } from './constants'

describe('EstateTemplate', () => {
  describe('mapUserToRole', () => {
    const createMockApplication = (
      applicant: string,
      selectedEstate?: string,
    ): Application => {
      return {
        applicant,
        assignees: [],
        answers: {
          selectedEstate,
        },
        externalData: {},
      } as unknown as Application
    }

    describe('applicant role mapping', () => {
      it('should return APPLICANT_OFFICIAL_DIVISION for official division estate type', () => {
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
        )
        const role = EstateTemplate.mapUserToRole('1234567890', application)
        expect(role).toBe(Roles.APPLICANT_OFFICIAL_DIVISION)
      })

      it('should return APPLICANT_NO_ASSETS for estate without assets type', () => {
        const application = createMockApplication(
          '1234567890',
          EstateTypes.estateWithoutAssets,
        )
        const role = EstateTemplate.mapUserToRole('1234567890', application)
        expect(role).toBe(Roles.APPLICANT_NO_ASSETS)
      })

      it('should return APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE for permit for undivided estate type', () => {
        const application = createMockApplication(
          '1234567890',
          EstateTypes.permitForUndividedEstate,
        )
        const role = EstateTemplate.mapUserToRole('1234567890', application)
        expect(role).toBe(Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE)
      })

      it('should return APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS for division of estate by heirs type', () => {
        const application = createMockApplication(
          '1234567890',
          EstateTypes.divisionOfEstateByHeirs,
        )
        const role = EstateTemplate.mapUserToRole('1234567890', application)
        expect(role).toBe(Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS)
      })

      it('should return APPLICANT for unknown estate type', () => {
        const application = createMockApplication('1234567890', 'unknown')
        const role = EstateTemplate.mapUserToRole('1234567890', application)
        expect(role).toBe(Roles.APPLICANT)
      })

      it('should return APPLICANT when no estate type is selected', () => {
        const application = createMockApplication('1234567890')
        const role = EstateTemplate.mapUserToRole('1234567890', application)
        expect(role).toBe(Roles.APPLICANT)
      })
    })

    describe('undefined role mapping', () => {
      it('should return undefined for any user that is not the applicant', () => {
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
        )
        const role = EstateTemplate.mapUserToRole('9999999999', application)
        expect(role).toBeUndefined()
      })
    })
  })

  describe('draft state transitions', () => {
    const createDraftApplication = (selectedEstate: string): Application =>
      ({
        id: '123',
        assignees: [],
        applicantActors: [],
        state: States.draft,
        applicant: '1111111111',
        typeId: ApplicationTypes.ESTATE,
        modified: new Date(),
        created: new Date(),
        answers: {
          selectedEstate,
        },
        externalData: {},
        status: ApplicationStatus.IN_PROGRESS,
      } as unknown as Application)

    it('should route SUBMIT to the signing/status state', () => {
      const application = createDraftApplication(EstateTypes.officialDivision)

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.signing)
    })

    it('should route PAYMENT to the payment state for paid estate types', () => {
      const application = createDraftApplication(
        EstateTypes.divisionOfEstateByHeirs,
      )

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState] = helper.changeState(DefaultEvents.PAYMENT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.payment)
    })
  })

  describe('signing state transitions', () => {
    const createSigningApplication = (
      signatories: Array<{ signed: boolean }>,
    ): Application =>
      ({
        id: '123',
        assignees: [],
        applicantActors: [],
        state: States.signing,
        applicant: '1111111111',
        typeId: ApplicationTypes.ESTATE,
        modified: new Date(),
        created: new Date(),
        answers: {
          selectedEstate: EstateTypes.officialDivision,
        },
        externalData: {
          getSignatories: {
            data: { success: true, signatories },
            date: new Date().toISOString(),
          },
        },
        status: ApplicationStatus.IN_PROGRESS,
      } as unknown as Application)

    it('should complete to done when all signatories have signed', () => {
      const application = createSigningApplication([
        { signed: true },
        { signed: true },
      ])

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.done)
    })

    it('should not complete when some signatories are still pending', () => {
      const application = createSigningApplication([
        { signed: true },
        { signed: false },
      ])

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(newState).toBe(States.signing)
    })
  })

  describe('payment state roles', () => {
    // mapUserToRole never returns the default 'applicant' role once an estate
    // type has been selected, so the payment state needs the estate-specific
    // applicant roles defined explicitly.
    it.each([
      Roles.APPLICANT_PERMIT_FOR_UNDIVIDED_ESTATE,
      Roles.APPLICANT_DIVISION_OF_ESTATE_BY_HEIRS,
    ])('should define %s in the payment state', (roleId) => {
      const stateConfig =
        EstateTemplate.stateMachineConfig.states[States.payment]
      const roleIds = stateConfig?.meta?.roles?.map((role) => role.id)
      expect(roleIds).toContain(roleId)
    })
  })

  describe('template properties', () => {
    it('should have correct type', () => {
      expect(EstateTemplate.type).toBe('Estate')
    })

    it('should allow multiple applications in draft', () => {
      expect(EstateTemplate.allowMultipleApplicationsInDraft).toBe(true)
    })

    it('should have correct translation namespace', () => {
      expect(EstateTemplate.translationNamespaces).toContain('es.application')
    })

    it('should not define an ASSIGNEE role in any state', () => {
      const states = EstateTemplate.stateMachineConfig.states
      Object.values(states).forEach((stateConfig) => {
        const roleIds = stateConfig?.meta?.roles?.map((role) => role.id) ?? []
        expect(roleIds).not.toContain('assignee')
      })
    })
  })
})
