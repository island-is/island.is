import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  ExternalData,
  DefaultEvents,
  FormValue,
  ApplicationStatus,
} from '@island.is/application/types'
import OldAgePensionTemplate from './OldAgePensionTemplate'
import { OAPEvents } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'

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
    typeId: ApplicationTypes.OLD_AGE_PENSION,
    created: new Date(),
    status: ApplicationStatus.IN_PROGRESS,
    modified: new Date(),
    applicantActors: [],
    answers,
    state,
    externalData,
  }
}

describe('Old Age Pension Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to tryggingastofnunSubmitted on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            confirmCorrectInfo: true,
          },
        }),
        OldAgePensionTemplate,
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
        OldAgePensionTemplate,
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
          state: 'tryggingastofnunSubmitted',
        }),
        OldAgePensionTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: OAPEvents.INREVIEW,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('tryggingastofnunInReview')
    })
  })

  describe('state transitions', () => {
    it('should transition from tryggingastofnunSubmitted to draft on edit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'tryggingastofnunSubmitted',
        }),
        OldAgePensionTemplate,
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
        OldAgePensionTemplate,
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
        OldAgePensionTemplate,
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
        OldAgePensionTemplate,
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
        OldAgePensionTemplate,
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
        OldAgePensionTemplate,
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
        OldAgePensionTemplate,
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
        OldAgePensionTemplate,
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
        OldAgePensionTemplate,
      )

      const [hasChanged, newState] = helper.changeState({
        type: OAPEvents.DISMISS,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('dismissed')
    })
  })
})
