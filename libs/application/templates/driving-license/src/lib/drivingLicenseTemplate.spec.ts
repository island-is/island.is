import {
  Application,
  ApplicationTemplateHelper,
  ApplicationTypes,
  ExternalData,
  FormValue,
  DefaultEvents,
  ApplicationStatus,
} from '@island.is/application/core'
import { States } from './constants'
import DrivingLicenseTemplate from './drivingLicenseTemplate'

const MOCK_APPLICANT_NATIONAL_ID = '1234567890'

function buildApplication(data: {
  state?: string
} = {}): Application {
  const { state = States.DRAFT } = data

  return {
    id: '12345',
    assignees: [],
    applicant: MOCK_APPLICANT_NATIONAL_ID,
    typeId: ApplicationTypes.DRIVING_LICENSE,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    answers: {},
    state,
    externalData: {},
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('Driving License Application Template', () => {
  describe('state transitions', () => {
    it('should transition from application to payment', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication(),
        DrivingLicenseTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.PAYMENT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.PAYMENT)
    })

    it('should transition from payment to done', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: States.PAYMENT
        }),
        DrivingLicenseTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.DONE)
    })
  })
})
