import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { Roles, States } from '../utils/constants'
import MachineLicenseRenewalTemplate from './MachineLicenseRenewalTemplate'

const APPLICANT = '0101302399'

const createApplication = (state: States): Application =>
  ({
    id: '123',
    assignees: [],
    applicantActors: [],
    state,
    applicant: APPLICANT,
    typeId: ApplicationTypes.MACHINE_LICENSE_RENEWAL,
    modified: new Date(),
    created: new Date(),
    answers: {},
    externalData: {},
    status: ApplicationStatus.IN_PROGRESS,
  } as unknown as Application)

describe('MachineLicenseRenewalTemplate', () => {
  describe('mapUserToRole', () => {
    const application = createApplication(States.SUBMITTED)

    it('maps the applicant to the applicant role', () => {
      expect(
        MachineLicenseRenewalTemplate.mapUserToRole(APPLICANT, application),
      ).toBe(Roles.APPLICANT)
    })

    it('maps AOSH to the organization role', () => {
      expect(
        MachineLicenseRenewalTemplate.mapUserToRole(
          InstitutionNationalIds.VINNUEFTIRLITID,
          application,
        ),
      ).toBe(Roles.ORGANIZATION)
    })

    it('maps anyone else to no role', () => {
      expect(
        MachineLicenseRenewalTemplate.mapUserToRole('0101307789', application),
      ).toBeUndefined()
    })
  })

  describe('submitted state', () => {
    it.each([
      [DefaultEvents.APPROVE, States.APPROVED],
      [DefaultEvents.REJECT, States.REJECTED],
    ] as const)('moves to the next state on %s', (event, target) => {
      const helper = new ApplicationTemplateHelper(
        createApplication(States.SUBMITTED),
        MachineLicenseRenewalTemplate,
      )

      expect(helper.changeState(event)).toEqual([
        true,
        target,
        expect.anything(),
      ])
    })

    it('only lets the organization approve or reject', () => {
      const helper = new ApplicationTemplateHelper(
        createApplication(States.SUBMITTED),
        MachineLicenseRenewalTemplate,
      )

      expect(helper.getPermittedEventsForRole(Roles.ORGANIZATION)).toEqual([
        DefaultEvents.APPROVE,
        DefaultEvents.REJECT,
      ])
      expect(helper.getPermittedEventsForRole(Roles.APPLICANT)).toEqual([])
    })
  })

  describe.each([States.APPROVED, States.REJECTED])('%s state', (state) => {
    it('rejects a repeated APPROVE or REJECT', () => {
      const helper = new ApplicationTemplateHelper(
        createApplication(state),
        MachineLicenseRenewalTemplate,
      )

      expect(() => helper.changeState(DefaultEvents.APPROVE)).toThrow()
      expect(() => helper.changeState(DefaultEvents.REJECT)).toThrow()
    })

    it('gives the organization no role', () => {
      const helper = new ApplicationTemplateHelper(
        createApplication(state),
        MachineLicenseRenewalTemplate,
      )

      expect(helper.getRoleInState(Roles.ORGANIZATION)).toBeUndefined()
    })
  })
})
