import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'
import InheritanceReportTemplate from './InheritanceReportTemplate'
import { EstateMember } from '../types'
import { States } from './constants'

describe('InheritanceReportTemplate', () => {
  const createMockApplication = (
    heirs: EstateMember[] = [],
    state = States.inReview,
    assignees: string[] = [],
  ): Application =>
    ({
      id: '123',
      assignees,
      applicantActors: [],
      state,
      applicant: '1111111111',
      typeId: ApplicationTypes.INHERITANCE_REPORT,
      modified: new Date(),
      created: new Date(),
      answers: {
        heirs: { data: heirs },
      },
      externalData: {
        checkReviewFlag: {
          data: { reviewEnabled: true },
          date: new Date().toISOString(),
        },
      },
      status: ApplicationStatus.IN_PROGRESS,
    } as unknown as Application)

  describe('inReview state transitions', () => {
    it('should allow SUBMIT to signing when not all heirs have approved', () => {
      const application = createMockApplication([
        {
          name: 'Applicant',
          nationalId: '1111111111',
          relation: 'Heir',
          enabled: true,
          approved: true,
        },
        {
          name: 'Heir',
          nationalId: '2222222222',
          relation: 'Heir',
          enabled: true,
          approved: false,
        },
      ])

      const helper = new ApplicationTemplateHelper(
        application,
        InheritanceReportTemplate,
      )

      const [hasChanged, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.signing)
    })

    it('should allow SUBMIT to signing when all heirs have approved', () => {
      const application = createMockApplication([
        {
          name: 'Applicant',
          nationalId: '1111111111',
          relation: 'Heir',
          enabled: true,
          approved: true,
        },
        {
          name: 'Heir',
          nationalId: '2222222222',
          relation: 'Heir',
          enabled: true,
          approved: true,
        },
      ])

      const helper = new ApplicationTemplateHelper(
        application,
        InheritanceReportTemplate,
      )

      const [hasChanged, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.signing)
    })

    it('should keep assignees visible when an heir rejects the application', () => {
      const application = createMockApplication(
        [
          {
            name: 'Applicant',
            nationalId: '1111111111',
            relation: 'Heir',
            enabled: true,
            approved: true,
          },
          {
            name: 'Heir',
            nationalId: '2222222222',
            relation: 'Heir',
            enabled: true,
            approved: false,
          },
        ],
        States.inReview,
        ['2222222222'],
      )

      const helper = new ApplicationTemplateHelper(
        application,
        InheritanceReportTemplate,
      )

      const [hasChanged, newState, updatedApplication] = helper.changeState(
        DefaultEvents.REJECT,
      )

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.draft)
      expect(updatedApplication.assignees).toEqual(['2222222222'])
    })
  })
})
