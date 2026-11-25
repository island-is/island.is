import { DefaultEvents } from '@island.is/application/types'
import { CreateDebtPaymentApi, GetDebtsApi } from '../dataProviders'
import { Roles, States } from '../utils/constants'
import template from './template'

describe('pay-debts template', () => {
  it('starts in draft, with no prerequisites state', () => {
    expect(template.stateMachineConfig.initial).toBe(States.DRAFT)
    expect(Object.keys(template.stateMachineConfig.states)).not.toContain(
      'prerequisites',
    )
  })

  it('permits the draft applicant to fetch the debts from the debts screen', () => {
    const draftRole = template.stateMachineConfig.states[
      States.DRAFT
    ].meta?.roles?.find((role) => role.id === Roles.APPLICANT)

    expect(draftRole?.api?.map((api) => api.actionId)).toEqual([
      GetDebtsApi.actionId,
    ])
  })

  it('lets the draft applicant submit into payment, which starts the debt payment', () => {
    const { states } = template.stateMachineConfig
    const draftRole = states[States.DRAFT].meta?.roles?.find(
      (role) => role.id === Roles.APPLICANT,
    )

    expect(draftRole?.actions?.map((action) => action.event)).toContain(
      DefaultEvents.SUBMIT,
    )
    expect(states[States.DRAFT].on?.[DefaultEvents.SUBMIT]).toEqual({
      target: States.PAYMENT,
    })
    expect(states[States.PAYMENT].meta?.onEntry).toBe(CreateDebtPaymentApi)
  })
})
