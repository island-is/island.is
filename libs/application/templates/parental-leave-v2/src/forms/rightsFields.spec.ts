import { NO, YES } from '@island.is/application/core'
import { FieldTypes } from '@island.is/application/types'
import {
  buildGiveDaysFields,
  buildMultipleBirthsDaysFields,
  buildRequestDaysFields,
  buildRightsIntroFields,
} from './rightsFields'

const hiddenDefaults = (fields: ReturnType<typeof buildRequestDaysFields>) =>
  Object.fromEntries(
    fields
      .filter(({ type }) => type === FieldTypes.HIDDEN_INPUT)
      .map((field) => [
        field.id,
        (field as { defaultValue?: unknown }).defaultValue,
      ]),
  )

describe('rightsFields', () => {
  it('should show the rights as a read-only input that is not saved', () => {
    const [rights] = buildRightsIntroFields()

    expect(rights).toEqual(
      expect.objectContaining({
        type: FieldTypes.CUSTOM,
        component: 'RightsIntro',
        doesNotRequireAnswer: true,
      }),
    )
  })

  // Each screen saves its yes/no flags with the days on Continue, rather than
  // only sending them with the final submit.
  it.each([
    [
      'request',
      buildRequestDaysFields(),
      'requestRights.requestDays',
      { 'requestRights.isRequestingRights': YES },
    ],
    [
      'give',
      buildGiveDaysFields(),
      'giveRights.giveDays',
      { 'giveRights.isGivingRights': YES },
    ],
    [
      'multiple births',
      buildMultipleBirthsDaysFields(),
      'multipleBirthsRequestDays',
      {
        'requestRights.isRequestingRights': NO,
        'giveRights.isGivingRights': NO,
      },
    ],
  ])('should save the %s days and flags', (_, fields, daysId, flags) => {
    expect(fields.map(({ id }) => id)).toContain(daysId)
    expect(hiddenDefaults(fields)).toEqual(flags)
  })

  it.each([
    buildRequestDaysFields(),
    buildGiveDaysFields(),
    buildMultipleBirthsDaysFields(),
  ])('should put the days input and the total side by side', (...fields) => {
    const halves = fields.filter(
      (field) => (field as { colSpan?: unknown }).colSpan !== undefined,
    )

    expect(halves.map(({ type }) => type)).toEqual([
      FieldTypes.TEXT,
      FieldTypes.CUSTOM,
    ])
    halves.forEach((field) =>
      expect((field as { colSpan?: unknown }).colSpan).toEqual(['1/1', '1/2']),
    )
  })
})
