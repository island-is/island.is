import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  DefaultEvents,
  ApplicationStatus,
} from '@island.is/application/types'
import { States } from './constants'
import NoDebtCertificateTemplate from './noDebtCertificateTemplate'

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
    applicantActors: [],
    typeId: ApplicationTypes.NO_DEBT_CERTIFICATE,
    created: new Date(),
    modified: new Date(),
    answers: {},
    state,
    externalData: {},
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('No Debt Certificate Application Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to completed', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication(),
        NoDebtCertificateTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.COMPLETED)
    })
  })
})
