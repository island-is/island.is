import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'
import InheritanceReportTemplate from './InheritanceReportTemplate'
import {
  ESTATE_INHERITANCE,
  PREPAID_INHERITANCE,
  Roles,
  States,
} from './constants'

describe('InheritanceReportTemplate', () => {
  describe('mapUserToRole', () => {
    const createApplication = (
      applicant: string,
      applicationFor: string,
    ): Application =>
      ({
        applicant,
        assignees: [],
        answers: { applicationFor },
        externalData: {},
      } as unknown as Application)

    it('should return ESTATE_INHERITANCE_APPLICANT for the applicant of an estate inheritance', () => {
      const application = createApplication('1111111111', ESTATE_INHERITANCE)
      const role = InheritanceReportTemplate.mapUserToRole(
        '1111111111',
        application,
      )
      expect(role).toBe(Roles.ESTATE_INHERITANCE_APPLICANT)
    })

    it('should return PREPAID_INHERITANCE_APPLICANT for the applicant of a prepaid inheritance', () => {
      const application = createApplication('1111111111', PREPAID_INHERITANCE)
      const role = InheritanceReportTemplate.mapUserToRole(
        '1111111111',
        application,
      )
      expect(role).toBe(Roles.PREPAID_INHERITANCE_APPLICANT)
    })

    it('should return undefined for any user that is not the applicant', () => {
      const application = createApplication('1111111111', ESTATE_INHERITANCE)
      const role = InheritanceReportTemplate.mapUserToRole(
        '9999999999',
        application,
      )
      expect(role).toBeUndefined()
    })
  })

  describe('state transitions', () => {
    const createApplication = (
      state: string,
      signatories: Array<{ signed: boolean }> = [],
    ): Application =>
      ({
        id: '123',
        assignees: [],
        applicantActors: [],
        state,
        applicant: '1111111111',
        typeId: ApplicationTypes.INHERITANCE_REPORT,
        modified: new Date(),
        created: new Date(),
        answers: {
          applicationFor: ESTATE_INHERITANCE,
        },
        externalData: {
          getSignatories: {
            data: { success: true, signatories },
            date: new Date().toISOString(),
          },
        },
        status: ApplicationStatus.IN_PROGRESS,
      } as unknown as Application)

    it('should route SUBMIT from draft to the signing/status state', () => {
      const application = createApplication(States.draft)

      const helper = new ApplicationTemplateHelper(
        application,
        InheritanceReportTemplate,
      )
      const [hasChanged, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.signing)
    })

    it('should complete to done when all signatories have signed', () => {
      const application = createApplication(States.signing, [
        { signed: true },
        { signed: true },
      ])

      const helper = new ApplicationTemplateHelper(
        application,
        InheritanceReportTemplate,
      )
      const [hasChanged, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.done)
    })

    it('should not complete when some signatories are still pending', () => {
      const application = createApplication(States.signing, [
        { signed: true },
        { signed: false },
      ])

      const helper = new ApplicationTemplateHelper(
        application,
        InheritanceReportTemplate,
      )
      const [, newState] = helper.changeState(DefaultEvents.SUBMIT)

      expect(newState).toBe(States.signing)
    })
  })
})
