import { ApplicationTemplateHelper } from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { States } from './constants'
import DrivingLicenseTemplate from './drivingLicenseTemplate'

describe('Driving License Application Template', () => {
  describe('state transitions', () => {
    it('should transition from draft to prerequisites when requirements havent been met', () => {
      const helper = new ApplicationTemplateHelper(
        createApplication({
          state: States.DRAFT,
        }),
        DrivingLicenseTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.PAYMENT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.PREREQUISITES)
    })

    it('should transition from application to payment', () => {
      const helper = new ApplicationTemplateHelper(
        createApplication({
          state: States.DRAFT,
          answers: {
            requirementsMet: true,
          },
        }),
        DrivingLicenseTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.PAYMENT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.PAYMENT)
    })

    it('should transition from payment to done', () => {
      const helper = new ApplicationTemplateHelper(
        createApplication({
          state: States.PAYMENT,
        }),
        DrivingLicenseTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.DONE)
    })
  })
})
