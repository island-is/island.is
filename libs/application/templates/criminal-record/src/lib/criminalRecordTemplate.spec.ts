import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  DefaultEvents,
  ApplicationStatus,
} from '@island.is/application/types'
import { States } from './constants'
import CriminalRecordTemplate from './CriminalRecordTemplate'

const MOCK_APPLICANT_NATIONAL_ID = '0101010101'

function buildApplication(
  data: {
    state?: string
  } = {},
): Application {
  const { state = States.DRAFT } = data

  return {
    id: '12345',
    assignees: [],
    applicant: MOCK_APPLICANT_NATIONAL_ID,
    typeId: ApplicationTypes.CRIMINAL_RECORD,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    answers: {},
    state,
    externalData: {},
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('Criminal Record Application Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to payment', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication(),
        CriminalRecordTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.PAYMENT)
    })

    it('should transition from payment to completed', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: States.PAYMENT,
        }),
        CriminalRecordTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.COMPLETED)
    })
  })
})
