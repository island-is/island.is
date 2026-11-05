import { FieldTypesEnum } from '@island.is/form-system/shared'
import { validateSync } from 'class-validator'
import { FieldSettingsFactory } from './fieldSettings.factory'
import { FieldSettings } from './fieldSettings.model'

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
