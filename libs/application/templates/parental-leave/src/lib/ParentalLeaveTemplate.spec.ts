import {
  Application,
  ApplicationTemplateHelper,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/core'
import ParentalLeaveTemplate from './ParentalLeaveTemplate'

const mockApiTemplateUtils = {
  performAction: () => Promise.resolve(''),
}

function buildApplication(data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application {
  const { answers = {}, externalData = {}, state = 'draft' } = data
  return {
    id: '12345',
    assignees: [],
    applicant: '123456-7890',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    answers,
    state,
    externalData,
  }
}

describe('Parental Leave Application Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to other parent if applicant is asking for shared rights', () => {
      const otherParentId = '098765-4321'
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentId,
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState(
        {
          type: 'SUBMIT',
        },
        mockApiTemplateUtils,
      )
      expect(hasChanged).toBe(true)
      expect(newState).toBe('otherParentApproval')
      expect(newApplication.assignees).toEqual([otherParentId])
    })
    it('should transition from draft to employer approval if applicant is not asking for shared rights', () => {
      const otherParentId = '098765-4321'
      const employerId = '1234543210'
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: 'no',
            },
            otherParentId,
            employer: {
              nationalRegistryId: employerId,
            },
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState(
        {
          type: 'SUBMIT',
        },
        mockApiTemplateUtils,
      )
      expect(hasChanged).toBe(true)
      expect(newState).toBe('employerWaitingToAssign')
      // There should be no one assigned until employer accepts to be assigned
      expect(newApplication.assignees).toEqual([])
    })
    it('should assign the application to the employer when transitioning to employer approval from other parent approval', () => {
      const otherParentId = '098765-4321'
      const employerId = '1234543210'
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentId,
            employer: {
              nationalRegistryId: employerId,
            },
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState(
        {
          type: 'SUBMIT',
        },
        mockApiTemplateUtils,
      )
      expect(hasChanged).toBe(true)
      expect(newState).toBe('otherParentApproval')
      expect(newApplication.assignees).toEqual([otherParentId])

      const finalHelper = new ApplicationTemplateHelper(
        newApplication,
        ParentalLeaveTemplate,
      )
      const [
        hasChangedAgain,
        finalState,
        finalApplication,
      ] = finalHelper.changeState(
        {
          type: 'APPROVE',
        },
        mockApiTemplateUtils,
      )
      expect(hasChangedAgain).toBe(true)
      expect(finalState).toBe('employerWaitingToAssign')
      // There should be no one assigned until employer accepts to be assigned
      // TODO: fix that this is not an empty array
      expect(finalApplication.assignees).toEqual([otherParentId])
    })
  })
})
