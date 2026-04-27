import EstateTemplate from './EstateTemplate'
import { Application, ApplicationContext } from '@island.is/application/types'
import { EstateMember } from '../types'
import { EstateTypes, Roles } from './constants'

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
