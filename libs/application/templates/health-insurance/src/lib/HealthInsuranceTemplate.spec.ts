import {
  Application,
  ApplicationTemplateHelper,
  ApplicationTypes,
  ExternalData,
  DefaultEvents,
  FormValue,
  ApplicationStatus,
} from '@island.is/application/core'
import HealthInsuranceTemplate from './HealthInsuranceTemplate'

function buildApplication(data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application {
  const { answers = {}, externalData = {}, state = 'draft' } = data
  return {
    id: '12345',
    assignees: [],
    applicant: '123456-7890',
    typeId: ApplicationTypes.HEALTH_INSURANCE,
    created: new Date(),
    status: ApplicationStatus.IN_PROGRESS,
    modified: new Date(),
    attachments: {},
    answers,
    state,
    externalData,
  }
}

describe('Health Insurance Application Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to inReview on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            confirmCorrectInfo: true,
          },
        }),
        HealthInsuranceTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('inReview')
    })
  })
})
