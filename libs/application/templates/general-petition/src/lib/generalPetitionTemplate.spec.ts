import { ApplicationTemplateHelper } from '@island.is/application/core'
import {
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  ExternalData,
} from '@island.is/application/types'
import GeneralPetitionTemplate from './GeneralPetitionTemplate'
import { createApplication } from '@island.is/application/testing'

describe('General petition application template', () => {
  describe('state transitions', () => {
    it('should transition from prereqs to draft', () => {
      const helper = new ApplicationTemplateHelper(
        createApplication(),
        GeneralPetitionTemplate,
      )

      const [hasChanged, newState, _] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })

      expect(hasChanged).toBe(true)
      expect(newState).toBe('draft')
    })
  })

  describe('access control for done state', () => {
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
          state: 'done',
          answers: {
            listName: 'listName',
          },
          externalData,
        }),
        GeneralPetitionTemplate,
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
