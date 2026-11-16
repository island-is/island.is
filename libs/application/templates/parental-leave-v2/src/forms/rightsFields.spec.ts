import { NO, YES } from '@island.is/application/core'
import {
  Application,
  FieldTypes,
  KeyValueField,
} from '@island.is/application/types'
import { SINGLE } from '../constants'
import { parentalLeaveFormMessages } from '../lib/messages'
import {
  buildGiveDaysFields,
  buildMultipleBirthsDaysFields,
  buildRequestDaysFields,
  buildRightsIntroFields,
} from './rightsFields'

const application = (answers: Record<string, unknown>) =>
  ({
    answers: { selectedChild: '0', ...answers },
    externalData: {
      children: {
        data: {
          children: [
            {
              hasRights: true,
              remainingDays: 180,
              parentalRelation: 'primary',
              expectedDateOfBirth: '2027-03-04',
            },
          ],
        },
        date: new Date(),
        status: 'success',
      },
    },
  } as unknown as Application)

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
  it('should show the total and the multiple births rights of a single parent', () => {
    const [rights] = buildRightsIntroFields()
    const value = (rights as KeyValueField).value as (
      application: Application,
    ) => unknown[]

    const lines = value(
      application({
        otherParentObj: { chooseOtherParent: SINGLE },
        multipleBirths: { hasMultipleBirths: YES, multipleBirths: '2' },
      }),
    )

    expect(lines).toEqual([
      expect.objectContaining({
        id: parentalLeaveFormMessages.reviewScreen.rightsTotal.id,
      }),
      expect.objectContaining({
        id: parentalLeaveFormMessages.shared.yourRightsInMonths.id,
      }),
      expect.objectContaining({
        id: parentalLeaveFormMessages.shared
          .yourSingleParentMultipleBirthsRightsInMonths.id,
      }),
    ])
  })

  it('should only show lines that can be rendered without multiple births', () => {
    // Each line is rendered as markdown, which throws on null
    const [rights] = buildRightsIntroFields()
    const value = (rights as KeyValueField).value as (
      application: Application,
    ) => unknown[]

    const lines = value(
      application({ multipleBirths: { hasMultipleBirths: NO } }),
    )

    expect(lines).toHaveLength(2)
    expect(lines.every((line) => line && typeof line === 'object')).toBe(true)
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
