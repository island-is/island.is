import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  DefaultEvents,
  ApplicationStatus,
} from '@island.is/application/types'
import { States } from './constants'
import MortgageCertificateTemplate from './mortgageCertificateTemplate'

const MOCK_APPLICANT_NATIONAL_ID = '0101010101'

const buildApplication = (
  data: {
    state?: string
  } = {},
): Application => {
  const { state = States.DRAFT } = data

  return {
    id: '12345',
    assignees: [],
    applicant: MOCK_APPLICANT_NATIONAL_ID,
    typeId: ApplicationTypes.MORTGAGE_CERTIFICATE,
    applicantActors: [],
    created: new Date(),
    modified: new Date(),
    answers: {},
    state,
    externalData: {
      validateMortgageCertificate: {
        data: { validation: { exists: true, hasKMarking: true } },
        date: new Date(),
        status: 'success',
      },
    },
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('Mortgage certificate Application Template', () => {
  describe('state transitions', () => {
    it('should transition from prerequisiets info to draft', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: States.PREREQUISITES,
        }),
        MortgageCertificateTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.DRAFT)
    })

    it('should transition from draft to payment', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication(),
        MortgageCertificateTemplate,
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
        MortgageCertificateTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.COMPLETED)
    })
  })
})
