import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
  FormValue,
} from '@island.is/application/types'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import ChangeOperatorOfVehicleTemplate from './ChangeOperatorOfVehicleTemplate'
import { Roles, States } from './constants'

const OWNER = '1111111111'
const OWNER_CO_OWNER = '2222222222'
const NEW_OPERATOR = '3333333333'

const OWNER_CO_OWNER_APPROVAL = {
  nationalId: OWNER_CO_OWNER,
  role: 'ownerCoOwner',
}
const NEW_OPERATOR_APPROVAL = { nationalId: NEW_OPERATOR, role: 'operators' }

const reviewers = [OWNER_CO_OWNER, NEW_OPERATOR]

const buildApplication = (state: string, answers: FormValue): Application =>
  ({
    id: '123',
    typeId: ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE,
    applicant: OWNER,
    applicantActors: [],
    assignees: reviewers,
    state,
    status: ApplicationStatus.IN_PROGRESS,
    answers,
    externalData: {},
    modified: new Date(),
    created: new Date(),
    attachments: {},
  } as unknown as Application)

const buildAnswers = (overrides: FormValue = {}): FormValue => ({
  owner: { nationalId: OWNER },
  ownerCoOwner: [{ nationalId: OWNER_CO_OWNER, name: 'Co-owner' }],
  operators: [{ nationalId: NEW_OPERATOR, name: 'Operator' }],
  ...overrides,
})

const send = (application: Application, type: string, nationalId: string) =>
  new ApplicationTemplateHelper(
    application,
    ChangeOperatorOfVehicleTemplate,
  ).changeState({ type, nationalId } as never)

describe('ChangeOperatorOfVehicleTemplate review approvals', () => {
  it('should reset approvals when entering review', () => {
    const [, state, updated] = send(
      buildApplication(
        States.PAYMENT,
        buildAnswers({
          approvedBy: [OWNER_CO_OWNER_APPROVAL, NEW_OPERATOR_APPROVAL],
          operators: [{ nationalId: NEW_OPERATOR, approved: true }],
        }),
      ),
      DefaultEvents.SUBMIT,
      OWNER,
    )

    expect(state).toBe(States.REVIEW)
    expect(updated.answers.approvedBy).toEqual([])
    expect(updated.answers.operators).toEqual([
      expect.objectContaining({ approved: false }),
    ])
  })

  it('should not let the owner submit before every reviewer has approved, even with forged flags', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({
        approvedBy: [NEW_OPERATOR_APPROVAL],
        ownerCoOwner: [{ nationalId: OWNER_CO_OWNER, approved: true }],
      }),
    )

    const [hasChanged, state] = send(application, DefaultEvents.SUBMIT, OWNER)

    expect(hasChanged).toBe(false)
    expect(state).toBe(States.REVIEW)
  })

  it('should only record approvals from reviewers', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({ approvedBy: [] }),
    )

    const [, , byOwner] = send(application, DefaultEvents.APPROVE, OWNER)
    const [, , byReviewer] = send(
      application,
      DefaultEvents.APPROVE,
      OWNER_CO_OWNER,
    )

    expect(byOwner.answers.approvedBy).toEqual([])
    expect(byReviewer.answers.approvedBy).toEqual([OWNER_CO_OWNER_APPROVAL])
    expect(byReviewer.answers.ownerCoOwner).toEqual([
      expect.objectContaining({ nationalId: OWNER_CO_OWNER, approved: true }),
    ])
  })

  it('should let the owner retry the submit once every reviewer has approved', () => {
    let application = buildApplication(
      States.REVIEW,
      buildAnswers({ approvedBy: [] }),
    )
    for (const reviewer of reviewers) {
      const [, , updated] = send(application, DefaultEvents.APPROVE, reviewer)
      application = { ...application, answers: updated.answers }
    }

    const [, state] = send(application, DefaultEvents.SUBMIT, OWNER)

    expect(state).toBe(States.COMPLETED)
  })

  it('should fall back to approved flags for applications that entered review before approvedBy', () => {
    const [, state] = send(
      buildApplication(
        States.REVIEW,
        buildAnswers({
          ownerCoOwner: [{ nationalId: OWNER_CO_OWNER, approved: true }],
          operators: [{ nationalId: NEW_OPERATOR, approved: true }],
        }),
      ),
      DefaultEvents.SUBMIT,
      OWNER,
    )

    expect(state).toBe(States.COMPLETED)
  })

  it('should only let reviewers write the rejecter in review', () => {
    const helper = new ApplicationTemplateHelper(
      buildApplication(States.REVIEW, buildAnswers()),
      ChangeOperatorOfVehicleTemplate,
    )

    expect(helper.getWritableAnswersAndExternalData(Roles.REVIEWER)).toEqual({
      answers: ['rejecter'],
    })
  })
})
