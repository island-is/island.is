import {
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplateHelper,
  DefaultEvents,
  ExternalData,
} from '@island.is/application/core'
import GeneralPetitionApplicationTemplate from './generalPetitionApplicationTemplate'
import { createApplication } from '@island.is/testing/fixtures'

describe('General petition application template', () => {
  describe('state transitions', () => {
    it('should transition from draft to approved', () => {
      const helper = new ApplicationTemplateHelper(
        createApplication(),
        GeneralPetitionApplicationTemplate,
      )

      const [hasChanged, newState, _] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe('approved')
      // expect(newApplication.assignees).toEqual([otherParentId])
    })
  })

  describe('access control for approved state', () => {
    let helper: ApplicationTemplateHelper<
      ApplicationContext,
      ApplicationStateSchema<{ type: DefaultEvents.SUBMIT }>,
      { type: DefaultEvents.SUBMIT }
    >

    const externalData: ExternalData = {
      illegalData: { data: true, status: 'failure', date: new Date() },
      nationalRegistry: {
        data: { nationalId: 'natid' },
        status: 'failure',
        date: new Date(),
      },
    }

    beforeEach(() => {
      helper = new ApplicationTemplateHelper(
        createApplication({
          state: 'approved',
          answers: {
            listName: 'listName',
          },
          externalData,
        }),
        GeneralPetitionApplicationTemplate,
      )
    })

    it('should allow reads and no writes by applicant', () => {
      const readable = helper.getReadableAnswersAndExternalData('applicant')

      expect(readable).toEqual({
        externalData,
        answers: {
          listName: 'listName',
        },
      })
    })

    it('should not allow writes by applicant', () => {
      const writable = helper.getWritableAnswersAndExternalData('applicant')
      expect(writable).toEqual(undefined)
    })

    it('should allow answers reads and no external data reads by signaturee', () => {
      const readable = helper.getReadableAnswersAndExternalData('signaturee')
      expect(readable).toEqual({
        externalData: {},
        answers: {
          aboutList: undefined,
          dates: undefined,
          documents: undefined,
          listName: 'listName',
        },
      })
    })

    it('should not allow writes by signaturee', () => {
      const writable = helper.getWritableAnswersAndExternalData('signaturee')
      expect(writable).toEqual(undefined)
    })
  })
})
