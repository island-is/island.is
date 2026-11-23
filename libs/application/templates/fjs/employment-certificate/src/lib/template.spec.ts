import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  ApplicationTypes,
  DefaultEvents,
  ExternalData,
} from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { Roles, States, SUBMIT_RESULT_ID } from '../utils/constants'
import { dataSchema } from './dataSchema'
import { DeliveryStatus } from './types'
import template from './template'

const applicantNationalId = '0101302399'
const otherNationalId = '0101307789'

const submitSucceeded = (deliveryStatus: string): ExternalData => ({
  [SUBMIT_RESULT_ID]: {
    status: 'success',
    date: new Date(),
    data: { caseId: 'case-1', deliveryStatus },
  },
})

const submitFailed = (statusCode: number): ExternalData => ({
  [SUBMIT_RESULT_ID]: {
    status: 'failure',
    date: new Date(),
    statusCode,
    reason: { title: 'Villa', summary: 'Villa' },
    data: {},
  },
})

// ApplicationTemplateHelper doesn't run the onExit action, so each test puts
// the submit result into externalData as the API would.
const buildHelper = (state: States, externalData: ExternalData = {}) =>
  new ApplicationTemplateHelper(
    createApplication({
      state,
      applicant: applicantNationalId,
      typeId: ApplicationTypes.EMPLOYMENT_CERTIFICATE,
      externalData,
    }),
    template,
  )

describe('Employment certificate template', () => {
  it('is gated by a feature flag and allows no delegations', () => {
    expect(template.type).toBe(ApplicationTypes.EMPLOYMENT_CERTIFICATE)
    expect(template.featureFlag).toBeDefined()
    expect(template.allowedDelegations).toBeUndefined()
  })

  describe('state transitions', () => {
    it('goes from prerequisites to draft on SUBMIT', () => {
      const [hasChanged, newState] = buildHelper(
        States.PREREQUISITES,
      ).changeState({ type: DefaultEvents.SUBMIT })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.DRAFT)
    })

    it.each([
      [DeliveryStatus.SENT_TO_MAILBOX, States.COMPLETED],
      [DeliveryStatus.PROCESSING, States.PROCESSING],
      [DeliveryStatus.CLOSED, States.CLOSED],
      ['some_new_status', States.PROCESSING],
    ])('goes from draft on %s to %s', (status, state) => {
      const [hasChanged, newState] = buildHelper(
        States.DRAFT,
        submitSucceeded(status),
      ).changeState({ type: DefaultEvents.SUBMIT })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(state)
    })

    it.each([409, 500, 503])(
      'goes from draft to submission failed on a %s',
      (statusCode) => {
        const [hasChanged, newState] = buildHelper(
          States.DRAFT,
          submitFailed(statusCode),
        ).changeState({ type: DefaultEvents.SUBMIT })

        expect(hasChanged).toBe(true)
        expect(newState).toBe(States.SUBMISSION_FAILED)
      },
    )

    it('goes back to draft on EDIT only when the history changed (409)', () => {
      const [hasChanged, newState] = buildHelper(
        States.SUBMISSION_FAILED,
        submitFailed(409),
      ).changeState({ type: DefaultEvents.EDIT })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.DRAFT)
    })

    it.each([400, 500, 503])(
      'keeps the answers unchanged after a %s by refusing EDIT',
      (statusCode) => {
        const [hasChanged, newState] = buildHelper(
          States.SUBMISSION_FAILED,
          submitFailed(statusCode),
        ).changeState({ type: DefaultEvents.EDIT })

        expect(hasChanged).toBe(false)
        expect(newState).toBe(States.SUBMISSION_FAILED)
      },
    )

    it.each([
      [DeliveryStatus.SENT_TO_MAILBOX, States.COMPLETED],
      [DeliveryStatus.PROCESSING, States.PROCESSING],
      [DeliveryStatus.CLOSED, States.CLOSED],
    ])(
      'goes from submission failed on a retry with %s to %s',
      (status, state) => {
        const [hasChanged, newState] = buildHelper(
          States.SUBMISSION_FAILED,
          submitSucceeded(status),
        ).changeState({ type: DefaultEvents.SUBMIT })

        expect(hasChanged).toBe(true)
        expect(newState).toBe(state)
      },
    )

    it('stays in submission failed when a retry fails again', () => {
      const [hasChanged, newState] = buildHelper(
        States.SUBMISSION_FAILED,
        submitFailed(500),
      ).changeState({ type: DefaultEvents.SUBMIT })

      expect(hasChanged).toBe(false)
      expect(newState).toBe(States.SUBMISSION_FAILED)
    })

    it.each([States.PROCESSING, States.COMPLETED, States.CLOSED])(
      'rejects SUBMIT in %s',
      (state) => {
        expect(() =>
          buildHelper(state).changeState({ type: DefaultEvents.SUBMIT }),
        ).toThrow()
      },
    )
  })

  it.each([
    [States.COMPLETED, 'completed'],
    [States.PROCESSING, 'completed'],
    [States.CLOSED, 'rejected'],
  ])('shows %s as %s in the applications overview', (state, status) => {
    expect(template.stateMachineConfig.states[state].meta?.status).toBe(status)
  })

  describe('template API wiring', () => {
    it.each([
      [States.PREREQUISITES, 'getEmploymentEligibility'],
      [States.DRAFT, 'getEmploymentHistoryPreview'],
    ])('runs %s without storing the result: %s', (state, action) => {
      const apis = buildHelper(state).getApisFromRoleInState(Roles.APPLICANT)
      const api = apis.find((a) => a.action === action)

      expect(api).toBeDefined()
      expect(api?.shouldPersistToExternalData).toBe(false)
      if (state === States.PREREQUISITES) {
        expect(
          apis.some((a) => a.action === 'getEmploymentHistoryPreview'),
        ).toBe(false)
      }
    })

    it('submits on leaving draft without throwing, so failures reach their own state', () => {
      const onExit = buildHelper(States.DRAFT).getOnExitStateAPIAction()
      const actions = Array.isArray(onExit) ? onExit : [onExit]

      expect(actions).toHaveLength(1)
      expect(actions[0]?.action).toBe('submitApplication')
      expect(actions[0]?.throwOnError).toBe(false)
      expect(actions[0]?.triggerEvent).toBe(DefaultEvents.SUBMIT)
    })

    it('retries without throwing, so the form shows the stored result', () => {
      const onExit = buildHelper(
        States.SUBMISSION_FAILED,
      ).getOnExitStateAPIAction()
      const actions = Array.isArray(onExit) ? onExit : [onExit]

      expect(actions).toHaveLength(1)
      expect(actions[0]?.action).toBe('submitApplication')
      expect(actions[0]?.throwOnError).toBe(false)
    })
  })

  describe('mapUserToRole', () => {
    const application = createApplication({ applicant: applicantNationalId })

    it('maps the applicant to the applicant role', () => {
      expect(template.mapUserToRole(applicantNationalId, application)).toBe(
        Roles.APPLICANT,
      )
    })

    it('gives no role to anyone else', () => {
      expect(
        template.mapUserToRole(otherNationalId, application),
      ).toBeUndefined()
    })
  })

  describe('dataSchema', () => {
    const history = (answers: Record<string, unknown>) =>
      dataSchema
        .pick({ institutionIds: true, includeUnion: true, comment: true })
        .safeParse({ institutionIds: ['inst-a'], ...answers })

    it('needs at least one institution', () => {
      expect(history({}).success).toBe(true)
      expect(history({ institutionIds: [] }).success).toBe(false)
    })

    it('takes the union choice and an optional comment', () => {
      expect(history({ includeUnion: ['yes'], comment: 'Texti' }).success).toBe(
        true,
      )
      expect(history({ includeUnion: [] }).success).toBe(true)
      expect(history({ includeUnion: ['no'] }).success).toBe(false)
    })

    it('limits the comment to 4,000 characters after trimming', () => {
      expect(history({ comment: 'a'.repeat(4000) }).success).toBe(true)
      expect(history({ comment: `  ${'a'.repeat(4000)}  ` }).success).toBe(true)
      expect(history({ comment: 'a'.repeat(4001) }).success).toBe(false)
    })

    it('accepts a missing email but not an invalid one', () => {
      const applicant = (email?: string) =>
        dataSchema.shape.applicant.safeParse({
          name: 'Gervimaður',
          nationalId: applicantNationalId,
          email,
        }).success

      expect(applicant(undefined)).toBe(true)
      expect(applicant('')).toBe(true)
      expect(applicant('gervi@island.is')).toBe(true)
      expect(applicant('not-an-email')).toBe(false)
    })
  })
})
