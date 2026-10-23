import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  InstitutionNationalIds,
} from '@island.is/application/types'
import OJOITemplate, { ApplicationStates, Roles } from './OJOIApplication'

const MINISTRY_ID = InstitutionNationalIds.DOMSMALA_RADUNEYTID
// Fake ID for any submitting institution other than the ministry
const INSTITUTION_ID = '0101303019'

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

const resolveRole = (nationalId: string, application: Application) => {
  const id = OJOITemplate.mapUserToRole(nationalId, application)
  const helper = new ApplicationTemplateHelper(application, OJOITemplate)
  return {
    id,
    roleInState: id ? helper.getRoleInState(id) : undefined,
    permittedEvents: id ? helper.getPermittedEventsForRole(id) : [],
  }
}

const reviewEvents = [
  DefaultEvents.APPROVE,
  DefaultEvents.EDIT,
  DefaultEvents.REJECT,
]

describe('OJOITemplate.mapUserToRole', () => {
  it('lets the ministry review, list and open its own submitted advert', () => {
    const { id, roleInState, permittedEvents } = resolveRole(
      MINISTRY_ID,
      createApplication({ applicant: MINISTRY_ID }),
    )

    expect(id).toBe(Roles.MINISTRY_APPLICANT)
    expect(roleInState).toBeDefined()
    expect(permittedEvents).toEqual(reviewEvents)
    expect(roleInState?.shouldBeListedForRole).not.toBe(false)
    expect(roleInState?.formLoader).toBeDefined()
  })

  it('lets the ministry review a submitted advert from another institution without listing it', () => {
    const { id, roleInState, permittedEvents } = resolveRole(
      MINISTRY_ID,
      createApplication(),
    )

    expect(id).toBe(Roles.ASSIGNEE)
    expect(permittedEvents).toEqual(reviewEvents)
    expect(roleInState?.shouldBeListedForRole).toBe(false)
  })

  it('gives the submitting institution no review actions', () => {
    const { id, roleInState, permittedEvents } = resolveRole(
      INSTITUTION_ID,
      createApplication(),
    )

    expect(id).toBe(Roles.APPLICANT)
    expect(permittedEvents).toEqual([])
    expect(roleInState?.formLoader).toBeDefined()
  })

  it.each([ApplicationStates.DRAFT, ApplicationStates.COMPLETE])(
    'keeps the ministry as applicant on its own advert in %s',
    (state) => {
      const application = createApplication({ state, applicant: MINISTRY_ID })

      expect(OJOITemplate.mapUserToRole(MINISTRY_ID, application)).toBe(
        Roles.APPLICANT,
      )
    },
  )
})
