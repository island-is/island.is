import { FieldTypesEnum } from '@island.is/form-system/shared'
import { validateSync } from 'class-validator'
import { FieldSettingsFactory } from './fieldSettings.factory'
import { FieldSettings } from './fieldSettings.model'

it('defaults new FILE fields to one PDF with a ten MiB size limit', () => {
  expect(FieldSettingsFactory.getDefaultSettings(FieldTypesEnum.FILE)).toEqual({
    maxFiles: 1,
    fileTypes: '.pdf',
    fileMaxSize: 10485760,
    zendeskIsCustomField: null,
    zendeskCustomFieldId: null,
  })
  expect(
    FieldSettingsFactory.getDefaultSettings(FieldTypesEnum.TEXTBOX),
  ).not.toHaveProperty('maxFiles')
})

it.each([
  { maxFiles: 3, fileTypes: '.png,.jpg', fileMaxSize: 1048576 },
  { maxFiles: null, fileTypes: null, fileMaxSize: null },
])('does not replace existing FILE settings: %j', (fileSettings) => {
  const settings = Object.assign(new FieldSettings(), fileSettings)

  expect(
    FieldSettingsFactory.getClass(FieldTypesEnum.FILE, settings),
  ).toMatchObject(fileSettings)
})

it('preserves localized checkbox sublabels and removes the obsolete visibility flag', () => {
  const subLabel = { is: 'Undirtexti', en: 'Sublabel' }
  const settings = Object.assign(new FieldSettings(), {
    isLarge: true,
    subLabel,
    hasDescription: false,
  })

  const checkbox = FieldSettingsFactory.getClass(
    FieldTypesEnum.CHECKBOX,
    settings,
  )
  expect(checkbox).toMatchObject({ isLarge: true, subLabel })
  expect(checkbox).not.toHaveProperty('hasDescription')
  expect(
    FieldSettingsFactory.getClass(FieldTypesEnum.TEXTBOX, settings),
  ).not.toHaveProperty('subLabel')
  expect(
    FieldSettingsFactory.getClass(FieldTypesEnum.NUMBERBOX, settings),
  ).not.toHaveProperty('hasDescription')
})

it.each([FieldTypesEnum.FAMILY, FieldTypesEnum.CHILD])(
  'drops obsolete child-source settings while preserving %s settings',
  (type) => {
    const settings = Object.assign(new FieldSettings(), {
      familyType: 'CHILD',
      showBiologicalChildren: true,
      showChildrenInCustody: false,
      zendeskIsCustomField: true,
      zendeskCustomFieldId: 'custom-field',
    })

    expect(FieldSettingsFactory.getClass(type, settings)).toEqual({
      familyType: 'CHILD',
      zendeskIsCustomField: true,
      zendeskCustomFieldId: 'custom-field',
    })
  },
)

it.each([{ fieldsToSum: [] }, { fieldsToSum: ['first', 'second'] }])(
  'preserves selected currency field IDs: $fieldsToSum',
  ({ fieldsToSum }) => {
    const settings = Object.assign(new FieldSettings(), { fieldsToSum })

    expect(
      FieldSettingsFactory.getClass(FieldTypesEnum.ISK_SUMBOX, settings)
        ?.fieldsToSum,
    ).toEqual(fieldsToSum)
    expect(validateSync(settings)).toEqual([])
    expect(
      FieldSettingsFactory.getClass(FieldTypesEnum.ISK_NUMBERBOX, settings),
    ).not.toHaveProperty('fieldsToSum')
  },
)

it.each([{ fieldsToSum: 'first' }, { fieldsToSum: [123] }])(
  'rejects invalid currency field IDs: $fieldsToSum',
  ({ fieldsToSum }) => {
    const settings = Object.assign(new FieldSettings(), { fieldsToSum })

    expect(validateSync(settings)).toEqual([
      expect.objectContaining({ property: 'fieldsToSum' }),
    ])
  },
)

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
