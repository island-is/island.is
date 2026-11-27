import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
  FormValue,
} from '@island.is/application/types'
import {
  ApplicationTemplateHelper,
  mergeAnswers,
} from '@island.is/application/core'
import TransferOfVehicleOwnershipTemplate from './TransferOfVehicleOwnershipTemplate'
import { Roles, States } from './constants'
import { getApproveAnswers } from '../utils'

const SELLER = '1111111111'
const BUYER = '2222222222'
const BUYER_OPERATOR = '3333333333'
const SELLER_CO_OWNER = '4444444444'

const BUYER_APPROVAL = { nationalId: BUYER, role: 'buyer' }
const OPERATOR_APPROVAL = {
  nationalId: BUYER_OPERATOR,
  role: 'buyerCoOwnerAndOperator.operator',
  row: 0,
}
const SELLER_CO_OWNER_APPROVAL = {
  nationalId: SELLER_CO_OWNER,
  role: 'sellerCoOwner',
}
const ALL_APPROVALS = [
  BUYER_APPROVAL,
  OPERATOR_APPROVAL,
  SELLER_CO_OWNER_APPROVAL,
]

const buildApplication = (
  state: string,
  answers: FormValue,
  assignees: string[] = [],
): Application =>
  ({
    id: '123',
    typeId: ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP,
    applicant: SELLER,
    applicantActors: [],
    assignees,
    state,
    status: ApplicationStatus.IN_PROGRESS,
    answers,
    externalData: {},
    modified: new Date(),
    created: new Date(),
    attachments: {},
  } as unknown as Application)

const buildAnswers = (overrides: FormValue = {}): FormValue => ({
  seller: { nationalId: SELLER },
  buyer: { nationalId: BUYER, name: 'Buyer' },
  buyerCoOwnerAndOperator: [
    { nationalId: BUYER_OPERATOR, name: 'Operator', type: 'operator' },
  ],
  sellerCoOwner: [{ nationalId: SELLER_CO_OWNER, name: 'Co-owner' }],
  ...overrides,
})

const send = (application: Application, type: string, nationalId: string) =>
  new ApplicationTemplateHelper(
    application,
    TransferOfVehicleOwnershipTemplate,
  ).changeState({ type, nationalId } as never)

const reviewers = [BUYER, BUYER_OPERATOR, SELLER_CO_OWNER]

describe('TransferOfVehicleOwnershipTemplate review approvals', () => {
  it('should reset approvals, including forged flags, when entering review', () => {
    const application = buildApplication(
      States.PAYMENT,
      buildAnswers({
        buyer: { nationalId: BUYER, approved: true },
        approvedBy: ALL_APPROVALS,
      }),
    )

    const [, state, updated] = send(application, DefaultEvents.SUBMIT, SELLER)

    expect(state).toBe(States.REVIEW)
    expect(updated.answers.approvedBy).toEqual([])
    expect(updated.answers.buyer).toMatchObject({ approved: false })
  })

  it('should not let the seller submit before every reviewer has approved', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({ approvedBy: [BUYER_APPROVAL, OPERATOR_APPROVAL] }),
      reviewers,
    )

    const [hasChanged, state] = send(application, DefaultEvents.SUBMIT, SELLER)

    expect(hasChanged).toBe(false)
    expect(state).toBe(States.REVIEW)
  })

  it('should ignore approved flags sent by the client', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({
        approvedBy: [],
        buyer: { nationalId: BUYER, approved: true },
        buyerCoOwnerAndOperator: [
          { nationalId: BUYER_OPERATOR, type: 'operator', approved: true },
        ],
        sellerCoOwner: [{ nationalId: SELLER_CO_OWNER, approved: true }],
      }),
      reviewers,
    )

    const [, state] = send(application, DefaultEvents.SUBMIT, SELLER)

    expect(state).toBe(States.REVIEW)
  })

  it('should record the approval of the authenticated reviewer only', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({ approvedBy: [] }),
      reviewers,
    )

    const [, state, updated] = send(application, DefaultEvents.APPROVE, BUYER)

    expect(state).toBe(States.REVIEW)
    expect(updated.answers.approvedBy).toEqual([BUYER_APPROVAL])
    expect(updated.answers.buyer).toMatchObject({ approved: true })
    expect(updated.answers.sellerCoOwner).toEqual([
      expect.objectContaining({ nationalId: SELLER_CO_OWNER, approved: false }),
    ])
  })

  it('should not record an approval from someone who is not a reviewer', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({ approvedBy: [] }),
      reviewers,
    )

    const [, , updated] = send(application, DefaultEvents.APPROVE, SELLER)

    expect(updated.answers.approvedBy).toEqual([])
  })

  it('should let the seller retry the submit once every reviewer has approved', () => {
    let application = buildApplication(
      States.REVIEW,
      buildAnswers({ approvedBy: [] }),
      reviewers,
    )
    for (const reviewer of reviewers) {
      const [, , updated] = send(application, DefaultEvents.APPROVE, reviewer)
      application = { ...application, answers: updated.answers }
    }

    const [hasChanged, state] = send(application, DefaultEvents.SUBMIT, SELLER)

    expect(hasChanged).toBe(true)
    expect(state).toBe(States.COMPLETED)
  })

  it('should require a new approval when a buyer operator is changed to co-owner', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({
        approvedBy: ALL_APPROVALS,
        buyerCoOwnerAndOperator: [
          { nationalId: BUYER_OPERATOR, type: 'coOwner', approved: true },
        ],
      }),
      reviewers,
    )

    const [, state] = send(application, DefaultEvents.SUBMIT, BUYER)

    expect(state).toBe(States.REVIEW)
  })

  it('should require a new approval when the buyer is replaced', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({
        approvedBy: ALL_APPROVALS,
        buyer: { nationalId: SELLER_CO_OWNER, approved: true },
      }),
      reviewers,
    )

    const [, state] = send(application, DefaultEvents.SUBMIT, SELLER)

    expect(state).toBe(States.REVIEW)
  })

  describe('when the buyer changes an approved co-owner or operator', () => {
    const OPERATOR = { nationalId: BUYER_OPERATOR, type: 'operator' }
    const REMOVED_OPERATOR = { ...OPERATOR, wasRemoved: 'true' }

    // Answer saves do not go through the state machine; the API runs the answer
    // validators against the stored application and then merges the answers
    const save = async (application: Application, answers: FormValue) => {
      const errors = await new ApplicationTemplateHelper(
        application,
        TransferOfVehicleOwnershipTemplate,
      ).applyAnswerValidators(
        answers,
        ((message: { id: string }) => message.id) as never,
      )
      return {
        errors,
        application: errors
          ? application
          : {
              ...application,
              answers: mergeAnswers(application.answers, answers),
            },
      }
    }

    const approvedByAll = () => {
      let application = buildApplication(
        States.REVIEW,
        buildAnswers({ approvedBy: [] }),
        reviewers,
      )
      for (const reviewer of reviewers) {
        const [, , updated] = send(application, DefaultEvents.APPROVE, reviewer)
        application = { ...application, answers: updated.answers }
      }
      return application
    }

    it('should not let a removed operator be restored', async () => {
      const removed = await save(approvedByAll(), {
        buyerCoOwnerAndOperator: [REMOVED_OPERATOR],
      })
      const restored = await save(removed.application, {
        buyerCoOwnerAndOperator: [OPERATOR],
      })

      expect(removed.errors).toBeUndefined()
      expect(restored.errors).toEqual({
        buyerCoOwnerAndOperator:
          'ta.tvo.application:error.approvedReviewerChanged',
      })
    })

    it('should not let an approved operator be changed', async () => {
      const toCoOwner = await save(approvedByAll(), {
        buyerCoOwnerAndOperator: [{ ...OPERATOR, type: 'coOwner' }],
      })
      const toSomeoneElse = await save(approvedByAll(), {
        buyerCoOwnerAndOperator: [{ ...OPERATOR, nationalId: SELLER_CO_OWNER }],
      })
      const dropped = await save(approvedByAll(), {
        buyerCoOwnerAndOperator: [],
      })

      expect(toCoOwner.errors).toBeDefined()
      expect(toSomeoneElse.errors).toBeDefined()
      expect(dropped.errors).toBeDefined()
    })

    it('should require a new approval when a removed operator is added again', async () => {
      const removed = await save(approvedByAll(), {
        buyerCoOwnerAndOperator: [REMOVED_OPERATOR],
      })
      const readded = await save(removed.application, {
        buyerCoOwnerAndOperator: [REMOVED_OPERATOR, OPERATOR],
      })

      const [, state] = send(readded.application, DefaultEvents.SUBMIT, SELLER)

      expect(readded.errors).toBeUndefined()
      expect(readded.application.answers.buyerCoOwnerAndOperator).toEqual([
        expect.objectContaining({ wasRemoved: 'true' }),
        OPERATOR,
      ])
      expect(state).toBe(States.REVIEW)
    })

    it('should require a new approval when an operator is re-added after a role change', async () => {
      const removed = await save(approvedByAll(), {
        buyerCoOwnerAndOperator: [
          REMOVED_OPERATOR,
          { ...OPERATOR, type: 'coOwner' },
        ],
      })
      const changedBack = await save(removed.application, {
        buyerCoOwnerAndOperator: [
          REMOVED_OPERATOR,
          { ...OPERATOR, type: 'coOwner', wasRemoved: 'true' },
          OPERATOR,
        ],
      })

      const [, state] = send(
        changedBack.application,
        DefaultEvents.SUBMIT,
        SELLER,
      )

      expect(removed.errors).toBeUndefined()
      expect(changedBack.errors).toBeUndefined()
      expect(state).toBe(States.REVIEW)
    })

    it('should accept a save that keeps every row', async () => {
      const BUYER_CO_OWNER = '5555555555'
      const application = buildApplication(
        States.REVIEW,
        buildAnswers({
          approvedBy: [
            {
              nationalId: BUYER_CO_OWNER,
              role: 'buyerCoOwnerAndOperator.coOwner',
              row: 1,
            },
          ],
          buyerCoOwnerAndOperator: [
            { ...REMOVED_OPERATOR, nationalId: SELLER_CO_OWNER },
            { nationalId: BUYER_CO_OWNER, type: 'coOwner', approved: true },
            OPERATOR,
          ],
        }),
        [...reviewers, BUYER_CO_OWNER],
      )

      const { errors } = await save(application, {
        buyerCoOwnerAndOperator: [
          { ...REMOVED_OPERATOR, nationalId: SELLER_CO_OWNER },
          {
            nationalId: BUYER_CO_OWNER,
            type: 'coOwner',
            name: 'Renamed',
            approved: true,
          },
          OPERATOR,
          { nationalId: SELLER, type: 'operator' },
        ],
      })

      expect(errors).toBeUndefined()
    })

    it('should not let a row claim an approval that was not recorded', async () => {
      const application = buildApplication(
        States.REVIEW,
        buildAnswers({ approvedBy: [] }),
        reviewers,
      )

      const forged = await save(application, {
        buyerCoOwnerAndOperator: [{ ...OPERATOR, approved: true }],
      })
      const forgedNewRow = await save(application, {
        buyerCoOwnerAndOperator: [
          OPERATOR,
          { nationalId: SELLER, type: 'coOwner', approved: true },
        ],
      })
      const removedWithFlag = await save(application, {
        buyerCoOwnerAndOperator: [{ ...REMOVED_OPERATOR, approved: true }],
      })

      expect(forged.errors).toBeDefined()
      expect(forgedNewRow.errors).toBeDefined()
      expect(removedWithFlag.errors).toBeUndefined()
    })

    it('should keep approved flags of applications that entered review before approvedBy', async () => {
      const application = buildApplication(
        States.REVIEW,
        buildAnswers({
          buyerCoOwnerAndOperator: [
            { ...OPERATOR, approved: true },
            { nationalId: SELLER, type: 'coOwner' },
          ],
        }),
        reviewers,
      )

      const kept = await save(application, {
        buyerCoOwnerAndOperator: [
          { ...OPERATOR, approved: true },
          { nationalId: SELLER, type: 'coOwner' },
        ],
      })
      const forged = await save(application, {
        buyerCoOwnerAndOperator: [
          { ...OPERATOR, approved: true },
          { nationalId: SELLER, type: 'coOwner', approved: true },
        ],
      })

      expect(kept.errors).toBeUndefined()
      expect(forged.errors).toBeDefined()
    })

    it('should not send the list with a co-owner or operator approval', () => {
      const answers = buildAnswers({ approvedBy: [] })

      expect(getApproveAnswers(BUYER_OPERATOR, answers)).not.toHaveProperty(
        'buyerCoOwnerAndOperator',
      )
    })
  })

  it('should record every role of a buyer who is also a seller co-owner', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({
        approvedBy: [OPERATOR_APPROVAL],
        sellerCoOwner: [{ nationalId: BUYER }],
      }),
      [BUYER, BUYER_OPERATOR],
    )

    const [, , updated] = send(application, DefaultEvents.APPROVE, BUYER)
    const [, state] = send(
      { ...application, answers: updated.answers },
      DefaultEvents.SUBMIT,
      BUYER,
    )

    expect(updated.answers.approvedBy).toEqual([
      OPERATOR_APPROVAL,
      BUYER_APPROVAL,
      { nationalId: BUYER, role: 'sellerCoOwner' },
    ])
    expect(updated.answers.sellerCoOwner).toEqual([
      expect.objectContaining({ nationalId: BUYER, approved: true }),
    ])
    expect(state).toBe(States.COMPLETED)
  })

  it('should record the approval of a seller who is also a buyer operator', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({
        approvedBy: [BUYER_APPROVAL, SELLER_CO_OWNER_APPROVAL],
        buyerCoOwnerAndOperator: [{ nationalId: SELLER, type: 'operator' }],
      }),
      [BUYER, SELLER, SELLER_CO_OWNER],
    )

    const [, , updated] = send(application, DefaultEvents.APPROVE, SELLER)
    const [, state] = send(
      { ...application, answers: updated.answers },
      DefaultEvents.SUBMIT,
      SELLER,
    )

    expect(updated.answers.buyerCoOwnerAndOperator).toEqual([
      expect.objectContaining({ nationalId: SELLER, approved: true }),
    ])
    expect(state).toBe(States.COMPLETED)
  })

  describe('applications that entered review before approvedBy', () => {
    const legacyAnswers = buildAnswers({
      buyer: { nationalId: BUYER, approved: true },
      sellerCoOwner: [{ nationalId: SELLER_CO_OWNER, approved: true }],
    })

    it('should fall back to approved flags', () => {
      const [, pendingState] = send(
        buildApplication(States.REVIEW, legacyAnswers, reviewers),
        DefaultEvents.SUBMIT,
        SELLER,
      )
      const [, approvedState] = send(
        buildApplication(
          States.REVIEW,
          buildAnswers({
            ...legacyAnswers,
            buyerCoOwnerAndOperator: [
              { nationalId: BUYER_OPERATOR, type: 'operator', approved: true },
            ],
          }),
          reviewers,
        ),
        DefaultEvents.SUBMIT,
        SELLER,
      )

      expect(pendingState).toBe(States.REVIEW)
      expect(approvedState).toBe(States.COMPLETED)
    })

    it('should build approvedBy from the flags on the first approval', () => {
      const [, , updated] = send(
        buildApplication(States.REVIEW, legacyAnswers, reviewers),
        DefaultEvents.APPROVE,
        BUYER_OPERATOR,
      )

      expect(updated.answers.approvedBy).toEqual([
        BUYER_APPROVAL,
        SELLER_CO_OWNER_APPROVAL,
        OPERATOR_APPROVAL,
      ])
    })
  })

  it('should limit what each role can write in review', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication(States.REVIEW, buildAnswers(), reviewers),
      TransferOfVehicleOwnershipTemplate,
    )

    expect(helper.getWritableAnswersAndExternalData(Roles.APPLICANT)).toEqual({
      answers: ['rejecter'],
    })
    expect(helper.getWritableAnswersAndExternalData(Roles.REVIEWER)).toEqual({
      answers: ['rejecter'],
    })
    expect(helper.getWritableAnswersAndExternalData(Roles.BUYER)).toEqual({
      answers: [
        'buyerCoOwnerAndOperator',
        'buyerMainOperator',
        'insurance',
        'rejecter',
      ],
    })
  })
})
