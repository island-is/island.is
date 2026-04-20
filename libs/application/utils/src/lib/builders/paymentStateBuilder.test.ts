import { buildPaymentState } from './paymentStateBuilder'
import {
  DefaultEvents,
  InstitutionNationalIds,
  TemplateApi,
} from '@island.is/application/types'

describe('buildPaymentState', () => {
  it('should handle submitTarget as a string', () => {
    const result = buildPaymentState({
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItems: [{ code: 'SOME_CODE' }],
      submitTarget: 'TARGET_STRING',
    })

    expect(
      (result.on as { [key: string]: any })[DefaultEvents.SUBMIT][0].target,
    ).toBe('TARGET_STRING')
  })

  it('should handle submitTarget as an array with conditions', () => {
    const result = buildPaymentState({
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItems: [{ code: 'SOME_CODE' }],
      submitTarget: [
        { target: 'TARGET_1', cond: () => false },
        { target: 'TARGET_2' },
      ],
    })

    expect(
      (result.on as { [key: string]: any })[DefaultEvents.SUBMIT],
    ).toHaveLength(2)
    expect(
      (result.on as { [key: string]: any })[DefaultEvents.SUBMIT][0].target,
    ).toBe('TARGET_1')
    expect(
      typeof (result.on as { [key: string]: any })[DefaultEvents.SUBMIT][0]
        .cond,
    ).toBe('function')
    expect(
      (result.on as { [key: string]: any })[DefaultEvents.SUBMIT][1].target,
    ).toBe('TARGET_2')
    expect(
      (result.on as { [key: string]: any })[DefaultEvents.SUBMIT][1].cond,
    ).toBeUndefined()
  })

  it('sets default transitions if none are provided', () => {
    const options = {
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItems: [{ code: 'SOME_CHARGE_CODE' }],
    }
    const result = buildPaymentState(options)
    const onTransitions = result.on as { [key: string]: any }

    expect(onTransitions[DefaultEvents.SUBMIT][0].target).toBe('done')
    expect(onTransitions[DefaultEvents.ABORT].target).toBe('draft')
  })

  it('sets provided single submit target string', () => {
    const options = {
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItems: [{ code: 'SOME_CHARGE_CODE' }],
      submitTarget: 'CUSTOM_TARGET',
    }
    const result = buildPaymentState(options)
    const onTransitions = result.on as { [key: string]: any }

    expect(onTransitions[DefaultEvents.SUBMIT][0].target).toBe('CUSTOM_TARGET')
  })

  it('sets provided array of submit targets', () => {
    const customCondition = (context: any) => context.someKey === 'someValue'
    const options = {
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItems: [{ code: 'SOME_CHARGE_CODE' }],
      submitTarget: [
        { target: 'TARGET_ONE', cond: customCondition },
        { target: 'TARGET_TWO' },
      ],
    }
    const result = buildPaymentState(options)
    const onTransitions = result.on as { [key: string]: any }

    expect(onTransitions[DefaultEvents.SUBMIT].length).toBe(2)
    expect(onTransitions[DefaultEvents.SUBMIT][0].target).toBe('TARGET_ONE')
    expect(onTransitions[DefaultEvents.SUBMIT][0].cond).toBe(customCondition)
    expect(onTransitions[DefaultEvents.SUBMIT][1].target).toBe('TARGET_TWO')
  })

  it('configures the CreateChargeApi correctly', () => {
    const options = {
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItems: [{ code: 'SOME_CHARGE_CODE' }],
      extraData: [{ name: 'test', value: '1234' }],
    }
    const result = buildPaymentState(options)

    if (!result.meta) {
      fail('meta is not defined')
    }

    // Assert that onEntry is defined and is an array
    expect(result.meta.onEntry).toBeDefined()
    expect(Array.isArray(result.meta.onEntry)).toBe(true)

    // Type assertion that onEntry is an array
    const onEntryArray = result.meta.onEntry as TemplateApi<unknown>[]

    const configuredApi = onEntryArray[0] as any

    // Verify that the organizationId is set correctly
    expect(configuredApi.params.organizationId).toBe(
      InstitutionNationalIds.SYSLUMENN,
    )

    // Verify that the chargeItems are set correctly
    expect(configuredApi.params.chargeItems).toEqual([
      { code: 'SOME_CHARGE_CODE' },
    ])

    // Verify that the extraData is set correctly
    expect(configuredApi.params.extraData).toEqual([
      { name: 'test', value: '1234' },
    ])
  })

  it('configures payerNationalId as a string correctly', () => {
    const options = {
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItems: [{ code: 'SOME_CHARGE_CODE' }],
      payerNationalId: '1234567890',
    }
    const result = buildPaymentState(options)

    if (!result.meta) {
      fail('meta is not defined')
    }

    const onEntryArray = result.meta.onEntry as TemplateApi<unknown>[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const configuredApi = onEntryArray[0] as any

    expect(configuredApi.params.payerNationalId).toBe('1234567890')
  })

  it('configures payerNationalId as a function correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payerFn = (_app: any) => '1234567890'
    const options = {
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItems: [{ code: 'SOME_CHARGE_CODE' }],
      payerNationalId: payerFn,
    }
    const result = buildPaymentState(options)

    if (!result.meta) {
      fail('meta is not defined')
    }

    const onEntryArray = result.meta.onEntry as TemplateApi<unknown>[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const configuredApi = onEntryArray[0] as any

    expect(configuredApi.params.payerNationalId).toBe(payerFn)
  })

  it('works without payerNationalId (defaults to undefined)', () => {
    const options = {
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItems: [{ code: 'SOME_CHARGE_CODE' }],
    }
    const result = buildPaymentState(options)

    if (!result.meta) {
      fail('meta is not defined')
    }

    const onEntryArray = result.meta.onEntry as TemplateApi<unknown>[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const configuredApi = onEntryArray[0] as any

    expect(configuredApi.params.payerNationalId).toBeUndefined()
  })
})
