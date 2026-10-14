import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  DefaultEvents,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { createNationalId } from '@island.is/testing/fixtures'
import {
  IS_REGULATED_EXTERNAL_DATA_ID,
  Roles,
  States,
} from '../utils/constants'
import template from './template'

const COMPANY = createNationalId('company')
const INDIVIDUAL = createNationalId('person')

const regulatedExternalData = (
  isSupervisedEntity: boolean,
  accessWindowOpen: boolean,
): ExternalData => ({
  [IS_REGULATED_EXTERNAL_DATA_ID]: {
    data: { isSupervisedEntity, accessWindowOpen },
    date: new Date(),
    status: 'success',
  },
})

const buildApplication = (data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = States.DRAFT } = data
  return {
    id: '12345',
    assignees: [],
    applicant: COMPANY,
    typeId: ApplicationTypes.FJARSKIPTASTOFA_SELF_ASSESSMENT,
    created: new Date(),
    status: ApplicationStatus.IN_PROGRESS,
    modified: new Date(),
    applicantActors: [],
    answers,
    state,
    externalData,
  }
}

describe('Fjarskiptastofa self-assessment template', () => {
  describe('state transitions', () => {
    it('should transition from prerequisites to draft on submit for a supervised entity with an open access window', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: States.PREREQUISITES,
          externalData: regulatedExternalData(true, true),
        }),
        template,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.DRAFT)
    })

    it.each([
      ['not a supervised entity', false, true],
      ['access window closed', true, false],
      ['neither supervised nor open', false, false],
    ])(
      'should NOT transition from prerequisites to draft when the company is %s',
      (_label, isSupervisedEntity, accessWindowOpen) => {
        const helper = new ApplicationTemplateHelper(
          buildApplication({
            state: States.PREREQUISITES,
            externalData: regulatedExternalData(
              isSupervisedEntity,
              accessWindowOpen,
            ),
          }),
          template,
        )

        const [hasChanged, newState] = helper.changeState({
          type: DefaultEvents.SUBMIT,
        })

        expect(hasChanged).toBe(false)
        expect(newState).toBe(States.PREREQUISITES)
      },
    )

    it('should transition from draft to completed on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({ state: States.DRAFT }),
        template,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.COMPLETED)
    })

    it('should not allow any event out of the completed state', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({ state: States.COMPLETED }),
        template,
      )

      expect(() => helper.changeState({ type: DefaultEvents.SUBMIT })).toThrow(
        /invalid for state completed/,
      )
    })

    it('should prune the completed state 4 hours after submission', () => {
      const lifecycle =
        template.stateMachineConfig.states[States.COMPLETED]?.meta?.lifecycle

      expect(lifecycle?.shouldBePruned).toBe(true)
      if (lifecycle?.shouldBePruned === true) {
        expect(lifecycle.whenToPrune).toBe(4 * 3600 * 1000)
      }
    })
  })

  describe('mapUserToRole', () => {
    it('should map an individual national id to the notAllowed role', () => {
      const application = buildApplication({})
      expect(template.mapUserToRole(INDIVIDUAL, application)).toBe(
        Roles.NOTALLOWED,
      )
    })

    it('should map a company to the applicant role so it can open the prerequisites screen', () => {
      const application = buildApplication({})
      expect(template.mapUserToRole(COMPANY, application)).toBe(Roles.APPLICANT)
    })

    it('should map a company to the applicant role regardless of its access window (the submit gates instead)', () => {
      const openWindow = buildApplication({
        externalData: regulatedExternalData(true, true),
      })
      const closedWindow = buildApplication({
        externalData: regulatedExternalData(true, false),
      })
      const notSupervised = buildApplication({
        externalData: regulatedExternalData(false, true),
      })

      expect(template.mapUserToRole(COMPANY, openWindow)).toBe(Roles.APPLICANT)
      expect(template.mapUserToRole(COMPANY, closedWindow)).toBe(
        Roles.APPLICANT,
      )
      expect(template.mapUserToRole(COMPANY, notSupervised)).toBe(
        Roles.APPLICANT,
      )
    })
  })
})
