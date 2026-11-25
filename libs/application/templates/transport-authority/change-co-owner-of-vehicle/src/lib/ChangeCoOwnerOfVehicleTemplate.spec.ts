import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
  FormValue,
} from '@island.is/application/types'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import ChangeCoOwnerOfVehicleTemplate from './ChangeCoOwnerOfVehicleTemplate'
import { Roles, States } from './constants'

const OWNER = '1111111111'
const OWNER_CO_OWNER = '2222222222'
const NEW_CO_OWNER = '3333333333'
const REMOVED_CO_OWNER = '4444444444'

const OWNER_CO_OWNER_APPROVAL = {
  nationalId: OWNER_CO_OWNER,
  role: 'ownerCoOwners',
}
const NEW_CO_OWNER_APPROVAL = { nationalId: NEW_CO_OWNER, role: 'coOwners' }

const reviewers = [OWNER_CO_OWNER, NEW_CO_OWNER]

const buildApplication = (state: string, answers: FormValue): Application =>
  ({
    id: '123',
    typeId: ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE,
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
  ownerCoOwners: [{ nationalId: OWNER_CO_OWNER, name: 'Current' }],
  coOwners: [
    { nationalId: NEW_CO_OWNER, name: 'New', wasRemoved: 'false' },
    { nationalId: REMOVED_CO_OWNER, name: 'Removed', wasRemoved: 'true' },
  ],
  ...overrides,
})

const send = (application: Application, type: string, nationalId: string) =>
  new ApplicationTemplateHelper(
    application,
    ChangeCoOwnerOfVehicleTemplate,
  ).changeState({ type, nationalId } as never)

describe('ChangeCoOwnerOfVehicleTemplate review approvals', () => {
  it('should reset approvals when entering review', () => {
    const [, state, updated] = send(
      buildApplication(
        States.PAYMENT,
        buildAnswers({
          approvedBy: [OWNER_CO_OWNER_APPROVAL, NEW_CO_OWNER_APPROVAL],
          ownerCoOwners: [{ nationalId: OWNER_CO_OWNER, approved: true }],
        }),
      ),
      DefaultEvents.SUBMIT,
      OWNER,
    )

    expect(state).toBe(States.REVIEW)
    expect(updated.answers.approvedBy).toEqual([])
    expect(updated.answers.ownerCoOwners).toEqual([
      expect.objectContaining({ approved: false }),
    ])
  })

  it('should not let the owner submit before every reviewer has approved, even with forged flags', () => {
    const application = buildApplication(
      States.REVIEW,
      buildAnswers({
        approvedBy: [OWNER_CO_OWNER_APPROVAL],
        coOwners: [{ nationalId: NEW_CO_OWNER, approved: true }],
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
    const [, , byRemoved] = send(
      application,
      DefaultEvents.APPROVE,
      REMOVED_CO_OWNER,
    )
    const [, , byReviewer] = send(
      application,
      DefaultEvents.APPROVE,
      NEW_CO_OWNER,
    )

    expect(byOwner.answers.approvedBy).toEqual([])
    expect(byRemoved.answers.approvedBy).toEqual([])
    expect(byReviewer.answers.approvedBy).toEqual([NEW_CO_OWNER_APPROVAL])
    expect(byReviewer.answers.coOwners).toEqual([
      expect.objectContaining({ nationalId: NEW_CO_OWNER, approved: true }),
      expect.objectContaining({
        nationalId: REMOVED_CO_OWNER,
        approved: false,
      }),
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
          ownerCoOwners: [{ nationalId: OWNER_CO_OWNER, approved: true }],
          coOwners: [{ nationalId: NEW_CO_OWNER, approved: true }],
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
      ChangeCoOwnerOfVehicleTemplate,
    )

    expect(helper.getWritableAnswersAndExternalData(Roles.REVIEWER)).toEqual({
      answers: ['rejecter'],
    })
  })
})
