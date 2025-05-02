import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  ExternalData,
  DefaultEvents,
  FormValue,
  ApplicationStatus,
} from '@island.is/application/types'
import DeathBenefitsTemplate from './DeathBenefitsTemplate'
import {
  OAPEvents,
  States,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'

const buildApplication = (data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = 'draft' } = data
  return {
    id: '12345',
    assignees: [],
    applicant: '123456-7890',
    typeId: ApplicationTypes.DEATH_BENEFITS,
    created: new Date(),
    status: ApplicationStatus.IN_PROGRESS,
    modified: new Date(),
    applicantActors: [],
    answers,
    state,
    externalData,
  }
}

describe('Death Benefits Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to tryggingastofnunSubmitted on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            confirmCorrectInfo: true,
          },
        }),
        DeathBenefitsTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('tryggingastofnunSubmitted')
    })
  })

  describe('state transitions', () => {
    it('should transition from draft to tryggingastofnunSubmitted on abort', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            confirmCorrectInfo: true,
          },
        }),
        DeathBenefitsTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.ABORT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('tryggingastofnunSubmitted')
    })
  })

  describe('state transitions', () => {
    it('should transition from tryggingastofnunSubmitted to tryggingastofnunInReview on inreview', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: States.TRYGGINGASTOFNUN_SUBMITTED,
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: OAPEvents.INREVIEW,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.TRYGGINGASTOFNUN_IN_REVIEW)
    })
  })

  describe('state transitions', () => {
    it('should transition from tryggingastofnunSubmitted to draft on edit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'tryggingastofnunSubmitted',
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.EDIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('draft')
    })
  })

  describe('state transitions', () => {
    it('should transition from tryggingastofnunSubmitted to additionalDocumentsRequired on ADDITIONALDOCUMENTSREQUIRED', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'tryggingastofnunSubmitted',
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: OAPEvents.ADDITIONALDOCUMENTSREQUIRED,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('additionalDocumentsRequired')
    })
  })

  describe('state transitions', () => {
    it('should transition from tryggingastofnunSubmitted to dismissed on dismissed', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'tryggingastofnunSubmitted',
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: OAPEvents.DISMISS,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('dismissed')
    })
  })

  describe('state transitions', () => {
    it('should transition from tryggingastofnunInReview to approved on approve', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'tryggingastofnunInReview',
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.APPROVE,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('approved')
    })
  })

  describe('state transitions', () => {
    it('should transition from tryggingastofnunInReview to rejected on reject', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'tryggingastofnunInReview',
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.REJECT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('rejected')
    })
  })

  describe('state transitions', () => {
    it('should transition from tryggingastofnunInReview to additionalDocumentsRequired on ADDITIONALDOCUMENTSREQUIRED', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'tryggingastofnunInReview',
          answers: {
            fileUploadAdditionalFiles: {
              additionalDocuments: [],
            },
            fileUploadAdditionalFilesRequired: {
              additionalDocumentsRequired: [],
            },
          },
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: OAPEvents.ADDITIONALDOCUMENTSREQUIRED,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('additionalDocumentsRequired')
    })
  })

  describe('state transitions', () => {
    it('should transition from tryggingastofnunInReview to dismissed on dismissed', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'tryggingastofnunInReview',
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: OAPEvents.DISMISS,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('dismissed')
    })
  })

  describe('state transitions', () => {
    it('should transition from additionalDocumentsRequired to tryggingastofnunInReview on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'additionalDocumentsRequired',
          answers: {
            fileUploadAdditionalFiles: {
              additionalDocuments: [],
            },
            fileUploadAdditionalFilesRequired: {
              additionalDocumentsRequired: [],
            },
          },
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('tryggingastofnunInReview')
    })
  })

  describe('state transitions', () => {
    it('should transition from additionalDocumentsRequired to dismissed on dismissed', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'additionalDocumentsRequired',
        }),
        DeathBenefitsTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: OAPEvents.DISMISS,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('dismissed')
    })
  })
})
