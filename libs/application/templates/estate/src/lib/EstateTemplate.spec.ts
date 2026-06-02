import EstateTemplate from './EstateTemplate'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import { EstateMember } from '../types'
import { EstateTypes, Roles, States } from './constants'

describe('EstateTemplate', () => {
  describe('mapUserToRole', () => {
    const createMockApplication = (
      applicant: string,
      selectedEstate?: string,
      estateMembers: EstateMember[] = [],
      assignees: string[] = [],
      reviewEnabled = false,
    ): Application => {
      return {
        applicant,
        assignees,
        answers: {
          selectedEstate,
          estate: {
            estateMembers,
          },
        },
        externalData: {
          checkReviewFlag: {
            data: { reviewEnabled },
            date: new Date().toISOString(),
          },
        },
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

    describe('assignee role mapping', () => {
      it('should return ASSIGNEE when user is in assignees list and review is enabled', () => {
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
          [],
          ['9999999999'],
          true,
        )
        const role = EstateTemplate.mapUserToRole('9999999999', application)
        expect(role).toBe(Roles.ASSIGNEE)
      })

      it('should return undefined when user is in assignees list but review is disabled', () => {
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
          [],
          ['9999999999'],
          false,
        )
        const role = EstateTemplate.mapUserToRole('9999999999', application)
        expect(role).toBeUndefined()
      })

      it('should return ASSIGNEE when user is an enabled estate member and review is enabled', () => {
        const estateMembers: EstateMember[] = [
          {
            name: 'John Doe',
            nationalId: '9999999999',
            relation: 'Child',
            enabled: true,
          },
        ]
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
          estateMembers,
          [],
          true,
        )
        const role = EstateTemplate.mapUserToRole('9999999999', application)
        expect(role).toBe(Roles.ASSIGNEE)
      })

      it('should return ASSIGNEE when user is an approved estate member and review is enabled', () => {
        const estateMembers: EstateMember[] = [
          {
            name: 'John Doe',
            nationalId: '9999999999',
            relation: 'Child',
            enabled: true,
            approved: true,
          },
        ]
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
          estateMembers,
          [],
          true,
        )
        const role = EstateTemplate.mapUserToRole('9999999999', application)
        expect(role).toBe(Roles.ASSIGNEE)
      })

      it('should return undefined when user is a disabled estate member', () => {
        const estateMembers: EstateMember[] = [
          {
            name: 'John Doe',
            nationalId: '9999999999',
            relation: 'Child',
            enabled: false,
          },
        ]
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
          estateMembers,
          [],
          true,
        )
        const role = EstateTemplate.mapUserToRole('9999999999', application)
        expect(role).toBeUndefined()
      })

      it('should return applicant role when user is both applicant and estate member', () => {
        const estateMembers: EstateMember[] = [
          {
            name: 'Applicant',
            nationalId: '1234567890',
            relation: 'Spouse',
            enabled: true,
          },
        ]
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
          estateMembers,
          [],
          true,
        )
        const role = EstateTemplate.mapUserToRole('1234567890', application)
        expect(role).toBe(Roles.APPLICANT_OFFICIAL_DIVISION)
      })

      it('should handle national IDs with dashes correctly when review is enabled', () => {
        const estateMembers: EstateMember[] = [
          {
            name: 'John Doe',
            nationalId: '999999-9999',
            relation: 'Child',
            enabled: true,
          },
        ]
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
          estateMembers,
          [],
          true,
        )
        const role = EstateTemplate.mapUserToRole('9999999999', application)
        expect(role).toBe(Roles.ASSIGNEE)
      })
    })

    describe('undefined role mapping', () => {
      it('should return undefined when user is not applicant, assignee, or estate member', () => {
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
        )
        const role = EstateTemplate.mapUserToRole('0000000000', application)
        expect(role).toBeUndefined()
      })

      it('should return undefined when assignees list is empty and user is not applicant', () => {
        const application = createMockApplication(
          '1234567890',
          EstateTypes.officialDivision,
          [],
          [],
        )
        const role = EstateTemplate.mapUserToRole('9999999999', application)
        expect(role).toBeUndefined()
      })
    })
  })

  describe('draft state transitions', () => {
    const createDraftApplication = (
      selectedEstate: string,
      reviewEnabled: boolean,
    ): Application =>
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
          estate: {
            estateMembers: [
              {
                name: 'Applicant',
                nationalId: '1111111111',
                enabled: true,
              },
              {
                name: 'Heir',
                nationalId: '2222222222',
                enabled: true,
              },
            ],
          },
        },
        externalData: {
          checkReviewFlag: {
            data: { reviewEnabled },
            date: new Date().toISOString(),
          },
        },
        status: ApplicationStatus.IN_PROGRESS,
      } as unknown as Application)

    it('should route paid estate submissions to review before payment when review is enabled', () => {
      const application = createDraftApplication(
        EstateTypes.divisionOfEstateByHeirs,
        true,
      )

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.inReview)
    })

    it('should still route free estate submissions to review when review is enabled', () => {
      const application = createDraftApplication(
        EstateTypes.officialDivision,
        true,
      )

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState, updatedApplication] = helper.changeState(
        DefaultEvents.SUBMIT,
      )

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.inReview)
      expect(
        (
          updatedApplication.answers.estate as {
            estateMembers: EstateMember[]
          }
        ).estateMembers[0].approved,
      ).toBe(true)
    })
  })

  describe('inReview state transitions', () => {
    const createInReviewApplication = (
      estateMembers: EstateMember[],
      selectedEstate = EstateTypes.officialDivision,
      assignees: string[] = [],
    ): Application =>
      ({
        id: '123',
        assignees,
        applicantActors: [],
        state: States.inReview,
        applicant: '1111111111',
        typeId: ApplicationTypes.ESTATE,
        modified: new Date(),
        created: new Date(),
        answers: {
          selectedEstate,
          estate: { estateMembers },
        },
        externalData: {
          checkReviewFlag: {
            data: { reviewEnabled: true },
            date: new Date().toISOString(),
          },
        },
        status: ApplicationStatus.IN_PROGRESS,
      } as unknown as Application)

    const estateMembersWithPendingApproval: EstateMember[] = [
      {
        name: 'Applicant',
        nationalId: '1111111111',
        enabled: true,
        approved: true,
      },
      {
        name: 'Heir',
        nationalId: '2222222222',
        enabled: true,
        approved: false,
      },
    ]

    const estateMembersAllApproved: EstateMember[] = [
      {
        name: 'Applicant',
        nationalId: '1111111111',
        enabled: true,
        approved: true,
      },
      {
        name: 'Heir',
        nationalId: '2222222222',
        enabled: true,
        approved: true,
      },
    ]

    it('should allow SUBMIT to signing for free estate types when not all estate members have approved', () => {
      const application = createInReviewApplication(
        estateMembersWithPendingApproval,
      )

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.signing)
    })

    it('should allow SUBMIT to signing for free estate types when all estate members have approved', () => {
      const application = createInReviewApplication(estateMembersAllApproved)

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.signing)
    })

    it('should allow PAYMENT to payment for paid estate types when not all estate members have approved', () => {
      const application = createInReviewApplication(
        estateMembersWithPendingApproval,
        EstateTypes.divisionOfEstateByHeirs,
      )

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState] = helper.changeState(DefaultEvents.PAYMENT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.payment)
    })

    it('should allow PAYMENT to payment for paid estate types when all estate members have approved', () => {
      const application = createInReviewApplication(
        estateMembersAllApproved,
        EstateTypes.permitForUndividedEstate,
      )

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState] = helper.changeState(DefaultEvents.PAYMENT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.payment)
    })

    it('should keep assignees visible when an estate member rejects the application', () => {
      const application = createInReviewApplication(
        estateMembersWithPendingApproval,
        EstateTypes.divisionOfEstateByHeirs,
        ['2222222222'],
      )

      const helper = new ApplicationTemplateHelper(application, EstateTemplate)
      const [hasChanged, newState, updatedApplication] = helper.changeState(
        DefaultEvents.REJECT,
      )

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.draft)
      expect(updatedApplication.assignees).toEqual(['2222222222'])
    })
  })

  describe('assignee role coverage', () => {
    // mapUserToRole returns ASSIGNEE for assignees and enabled estate members
    // in every state while review is enabled, so each state they can land in
    // must define the role with a form. Otherwise the form shell never
    // resolves a form and renders an infinite loader (e.g. an heir reloading
    // the application after rejecting it back to draft).
    it.each([
      States.draft,
      States.inReview,
      States.payment,
      States.signing,
      States.done,
    ])('should define an ASSIGNEE role in the %s state', (state) => {
      const stateConfig = EstateTemplate.stateMachineConfig.states[state]
      const roleIds = stateConfig?.meta?.roles?.map((role) => role.id)
      expect(roleIds).toContain(Roles.ASSIGNEE)
    })

    // The payment state must also define the estate-specific applicant roles,
    // since mapUserToRole never returns the default 'applicant' role once an
    // estate type has been selected.
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

  describe('stateMachineOptions', () => {
    it('should have assignEstateMembers action defined', () => {
      expect(
        EstateTemplate.stateMachineOptions?.actions?.assignEstateMembers,
      ).toBeDefined()
    })

    it('should have setApplicantAsApproved action defined', () => {
      expect(
        EstateTemplate.stateMachineOptions?.actions?.setApplicantAsApproved,
      ).toBeDefined()
    })

    it('should have clearAssignees action defined', () => {
      expect(
        EstateTemplate.stateMachineOptions?.actions?.clearAssignees,
      ).toBeDefined()
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
  })
})
