import { FieldTypesEnum } from '@island.is/form-system/shared'
import { validateSync } from 'class-validator'
import { FieldSettingsFactory } from './fieldSettings.factory'
import { FieldSettings } from './fieldSettings.model'

it('preserves amount limits for currency number fields', () => {
  const settings = Object.assign(new FieldSettings(), {
    minAmount: 0,
    maxAmount: 1000,
  })

  expect(
    FieldSettingsFactory.getClass(FieldTypesEnum.ISK_NUMBERBOX, settings),
  ).toEqual({
    minAmount: 0,
    maxAmount: 1000,
    zendeskIsCustomField: null,
    zendeskCustomFieldId: null,
  })
  expect(validateSync(settings)).toEqual([])
})

it.each([true, false])(
  'preserves fetchBankAccountFromMyPages=%s for bank account fields',
  (fetchBankAccountFromMyPages) => {
    const settings = Object.assign(new FieldSettings(), {
      fetchBankAccountFromMyPages,
    })

    expect(
      FieldSettingsFactory.getClass(FieldTypesEnum.BANK_ACCOUNT, settings)
        ?.fetchBankAccountFromMyPages,
    ).toBe(fetchBankAccountFromMyPages)
    expect(validateSync(settings)).toEqual([])
    expect(
      FieldSettingsFactory.getClass(FieldTypesEnum.TEXTBOX, settings),
    ).not.toHaveProperty('fetchBankAccountFromMyPages')
  },
)

it.each([undefined, null])(
  'defaults bank account fetching to true when the setting is %s',
  (fetchBankAccountFromMyPages) => {
    const settings = Object.assign(new FieldSettings(), {
      fetchBankAccountFromMyPages,
    })

    expect(
      FieldSettingsFactory.getClass(FieldTypesEnum.BANK_ACCOUNT, settings)
        ?.fetchBankAccountFromMyPages,
    ).toBe(true)
  },
)

it('rejects non-boolean bank account fetch settings', () => {
  const settings = Object.assign(new FieldSettings(), {
    fetchBankAccountFromMyPages: 'true',
  })

  expect(validateSync(settings)).toEqual([
    expect.objectContaining({
      property: 'fetchBankAccountFromMyPages',
      constraints: { isBoolean: expect.any(String) },
    }),
  ])
})

it('preserves zero and negative date offsets for date picker fields', () => {
  const settings = Object.assign(new FieldSettings(), {
    minDateDaysFromToday: 0,
    maxDateDaysFromToday: -7,
  })
  const result = FieldSettingsFactory.getClass(
    FieldTypesEnum.DATE_PICKER,
    settings,
  )

  expect(result?.minDateDaysFromToday).toBe(0)
  expect(result?.maxDateDaysFromToday).toBe(-7)
  expect(validateSync(settings)).toEqual([])
})

it.each(['minDateDaysFromToday', 'maxDateDaysFromToday'] as const)(
  'rejects fractional values for %s',
  (property) => {
    const settings = Object.assign(new FieldSettings(), { [property]: 1.5 })

    expect(validateSync(settings)).toEqual([
      expect.objectContaining({
        property,
        constraints: { isInt: expect.any(String) },
      }),
    ])
  },
)
