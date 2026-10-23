import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  InstitutionNationalIds,
} from '@island.is/application/types'
import OJOITemplate, { ApplicationStates } from './OJOIApplication'

const MINISTRY_ID = InstitutionNationalIds.DOMSMALA_RADUNEYTID
const INSTITUTION_ID = '5402696029'

const createApplication = (overrides: Partial<Application> = {}): Application =>
  ({
    id: 'app-id',
    state: ApplicationStates.SUBMITTED,
    applicant: INSTITUTION_ID,
    assignees: [MINISTRY_ID],
    answers: {},
    externalData: {},
    ...overrides,
  } as Application)

const roleInState = (nationalId: string, application: Application) => {
  const role = OJOITemplate.mapUserToRole(nationalId, application)
  const helper = new ApplicationTemplateHelper(application, OJOITemplate)
  return {
    roleInState: role ? helper.getRoleInState(role) : undefined,
    permittedEvents: role ? helper.getPermittedEventsForRole(role) : [],
  }
}

const reviewEvents = [
  DefaultEvents.APPROVE,
  DefaultEvents.EDIT,
  DefaultEvents.REJECT,
]

describe('OJOITemplate.mapUserToRole', () => {
  it('lets the ministry review, list and open its own submitted advert', () => {
    const application = createApplication({ applicant: MINISTRY_ID })

    const { roleInState: role, permittedEvents } = roleInState(
      MINISTRY_ID,
      application,
    )

    expect(permittedEvents).toEqual(reviewEvents)
    expect(role?.shouldBeListedForRole).not.toBe(false)
    expect(role?.formLoader).toBeDefined()
  })

  it('lets the ministry review a submitted advert from another institution without listing it', () => {
    const { roleInState: role, permittedEvents } = roleInState(
      MINISTRY_ID,
      createApplication(),
    )

    expect(permittedEvents).toEqual(reviewEvents)
    expect(role?.shouldBeListedForRole).toBe(false)
  })

  it('gives the submitting institution no review actions', () => {
    const { roleInState: role, permittedEvents } = roleInState(
      INSTITUTION_ID,
      createApplication(),
    )

    expect(permittedEvents).toEqual([])
    expect(role?.formLoader).toBeDefined()
  })

  it('keeps the ministry as applicant on its own draft', () => {
    const application = createApplication({
      state: ApplicationStates.DRAFT,
      applicant: MINISTRY_ID,
    })

    expect(OJOITemplate.mapUserToRole(MINISTRY_ID, application)).toBe(
      'applicant',
    )
  })
})
