import {
  ApplicationTemplateHelper,
  DefaultEvents,
} from '@island.is/application/core'
import { createApplication } from '@island.is/testing/fixtures'
import { States } from './constants'
import ExamplePaymentTemplate from './examplePaymentTemplate'

describe('Example payment template', () => {
  describe('state transitions', () => {
    it('should transition from draft to payment', () => {
      const helper = new ApplicationTemplateHelper(
        createApplication({
          state: States.DRAFT,
        }),
        ExamplePaymentTemplate,
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
        ExamplePaymentTemplate,
      )
      const [hasChanged, newState] = helper.changeState({
        type: DefaultEvents.SUBMIT,
      })
      expect(hasChanged).toBe(true)
      expect(newState).toBe(States.DONE)
    })
  })
})
