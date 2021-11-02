import {
  Application,
  ApplicationTemplateHelper,
  ApplicationTypes,
  ExternalData,
  FormValue,
  DefaultEvents,
  ApplicationStatus,
} from '@island.is/application/core'
import ParentalLeaveTemplate from './ParentalLeaveTemplate'
import { SPOUSE, States as ApplicationStates, YES } from '../constants'

function buildApplication(data: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application {
  const {
    answers = {},
    externalData = {
      children: {
        data: {
          children: [
            {
              hasRights: true,
              remainingDays: 180,
              parentalRelation: 'primary',
              expectedDateOfBirth: '2022-10-31',
            },
          ],
          existingApplications: [],
        },
        date: new Date('2021-10-31'),
        status: 'success',
      },
    },
    state = 'draft',
  } = data

  return {
    id: '12345',
    assignees: [],
    applicant: '1234567890',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('Parental Leave Application Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to other parent if applicant is asking for shared rights', () => {
      const otherParentId = '0987654321'
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentId,
            selectedChild: '0',
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('otherParentApproval')
      expect(newApplication.assignees).toEqual([otherParentId])
    })

    it('should transition from draft to employer approval if applicant is not asking for shared rights', () => {
      const otherParentId = '0987654321'
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: 'no',
            },
            otherParentId,
            employer: {
              isSelfEmployed: 'no',
            },
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe('employerWaitingToAssign')
      // There should be no one assigned until employer accepts to be assigned
      expect(newApplication.assignees).toEqual([])
    })

    it('should assign the application to the employer when transitioning to employer approval from other parent approval', () => {
      const otherParentId = '0987654321'
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          state: 'draft',
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentId,
            employer: {
              isSelfEmployed: 'no',
            },
            selectedChild: '0',
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
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
      ] = finalHelper.changeState({
        type: DefaultEvents.APPROVE,
      })
      expect(hasChangedAgain).toBe(true)
      expect(finalState).toBe('employerWaitingToAssign')
      expect(finalApplication.assignees).toEqual([])
    })

    it('should assign the application to the other parent approval and then to VMST when the applicant is self employed', () => {
      const otherParentId = '0987654321'
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            requestRights: {
              isRequestingRights: 'yes',
            },
            otherParentId,
            employer: {
              isSelfEmployed: 'yes',
            },
            selectedChild: '0',
          },
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
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
      ] = finalHelper.changeState({
        type: DefaultEvents.APPROVE,
      })
      expect(hasChangedAgain).toBe(true)
      expect(finalState).toBe('vinnumalastofnunApproval')
      expect(finalApplication.assignees).toEqual([])
    })

    describe('other parent', () => {
      describe('when spouse is selected', () => {
        it('should assign their national registry id from external data to answers.otherParentId when transitioning from draft', () => {
          const otherParentId = '1234567890'
          const helper = new ApplicationTemplateHelper(
            buildApplication({
              externalData: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                family: {
                  data: [
                    {
                      nationalId: otherParentId,
                      fullName: 'Tester Testerson',
                      familyRelation: SPOUSE,
                    },
                  ],
                },
              },
              answers: {
                otherParent: SPOUSE,
                employer: {
                  email: 'selfemployed@test.test',
                  isSelfEmployed: YES,
                },
              },
            }),
            ParentalLeaveTemplate,
          )
          const [hasChanged, newState, newApplication] = helper.changeState({
            type: DefaultEvents.SUBMIT,
          })
          expect(hasChanged).toBe(true)
          expect(newState).toBe('vinnumalastofnunApproval')
          expect(newApplication.answers.otherParentId).toEqual(otherParentId)
        })
      })
    })
  })

  describe('edit flow', () => {
    it('should create a temp copy of periods when going into the Edit flow', () => {
      const periods = [
        {
          ratio: '100',
          endDate: '2021-05-15T00:00:00Z',
          startDate: '2021-01-15',
        },
        {
          ratio: '100',
          endDate: '2021-06-16',
          startDate: '2021-06-01',
        },
      ]
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            periods,
          },
          state: ApplicationStates.APPROVED,
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.EDIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.EDIT_OR_ADD_PERIODS)
      expect(newApplication.answers.tempPeriods).toEqual(periods)
    })

    it('should remove the temp copy of periods when canceling out of the Edit flow', () => {
      const periods = [
        {
          ratio: '100',
          endDate: '2021-05-15T00:00:00Z',
          startDate: '2021-01-15',
        },
        {
          ratio: '100',
          endDate: '2021-06-16',
          startDate: '2021-06-01',
        },
      ]
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            periods,
            tempPeriods: periods,
          },
          state: ApplicationStates.EDIT_OR_ADD_PERIODS,
        }),
        ParentalLeaveTemplate,
      )
      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.ABORT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(ApplicationStates.APPROVED)
      expect(newApplication.answers.tempPeriods).toEqual(undefined)
    })

    it('should assign the application to the employer when the user submits their edits', () => {
      const helper = new ApplicationTemplateHelper(
        buildApplication({
          answers: {
            employer: {
              isSelfEmployed: 'no',
            },
          },
          state: ApplicationStates.EDIT_OR_ADD_PERIODS,
        }),
        ParentalLeaveTemplate,
      )

      const [hasChanged, newState, newApplication] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(
        ApplicationStates.EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS,
      )
      expect(newApplication.assignees).toEqual([])
    })
  })
})
