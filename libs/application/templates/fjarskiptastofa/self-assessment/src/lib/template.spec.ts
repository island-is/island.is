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

const regulatedExternalData = (accessWindowOpen: boolean): ExternalData => ({
  [IS_REGULATED_EXTERNAL_DATA_ID]: {
    data: { isSupervisedEntity: true, accessWindowOpen },
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
    it('should transition from prerequisites to draft on submit', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({ state: States.PREREQUISITES }),
        template,
      )

      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.DRAFT)
    })

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
  })

  describe('mapUserToRole', () => {
    it('should map an individual national id to the notAllowed role', () => {
      const application = buildApplication({})
      expect(template.mapUserToRole(INDIVIDUAL, application)).toBe(
        Roles.NOTALLOWED,
      )
    })

    it('should map a company to the applicant role before the access window has been checked', () => {
      const application = buildApplication({})
      expect(template.mapUserToRole(COMPANY, application)).toBe(Roles.APPLICANT)
    })

    it('should map a company with an open access window to the applicant role', () => {
      const application = buildApplication({
        externalData: regulatedExternalData(true),
      })
      expect(template.mapUserToRole(COMPANY, application)).toBe(Roles.APPLICANT)
    })

    it('should map a company with a closed access window to the notAllowed role', () => {
      const application = buildApplication({
        externalData: regulatedExternalData(false),
      })
      expect(template.mapUserToRole(COMPANY, application)).toBe(
        Roles.NOTALLOWED,
      )
    })
  })
})
