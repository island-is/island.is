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
      chargeItemCodes: ['SOME_CODE'],
      submitTarget: 'TARGET_STRING',
    })

    expect(
      (result.on as { [key: string]: any })[DefaultEvents.SUBMIT][0].target,
    ).toBe('TARGET_STRING')
  })

  it('should handle submitTarget as an array with conditions', () => {
    const result = buildPaymentState({
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItemCodes: ['SOME_CODE'],
      submitTarget: [
        { target: 'TARGET_1', cond: (context) => false },
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
      chargeItemCodes: ['SOME_CHARGE_CODE'],
    }
    const result = buildPaymentState(options)
    const onTransitions = result.on as { [key: string]: any }

    expect(onTransitions[DefaultEvents.SUBMIT][0].target).toBe('done')
    expect(onTransitions[DefaultEvents.ABORT].target).toBe('draft')
  })

  it('sets provided single submit target string', () => {
    const options = {
      organizationId: InstitutionNationalIds.SYSLUMENN,
      chargeItemCodes: ['SOME_CHARGE_CODE'],
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
      chargeItemCodes: ['SOME_CHARGE_CODE'],
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
      chargeItemCodes: ['SOME_CHARGE_CODE'],
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

    // Verify that the chargeItemCodes are set correctly
    expect(configuredApi.params.chargeItemCodes).toEqual(['SOME_CHARGE_CODE'])

    // Verify that the extraData is set correctly
    expect(configuredApi.params.extraData).toEqual([
      { name: 'test', value: '1234' },
    ])
  })
})
