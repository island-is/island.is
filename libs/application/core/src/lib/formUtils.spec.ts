import {
  extractRepeaterIndexFromField,
  formatText,
  getFormNodeLeaves,
  getValueViaPath,
  mergeAnswers,
} from './formUtils'
import { buildForm, buildMultiField, buildSection } from './formBuilders'
import {
  buildCheckboxField,
  buildDescriptionField,
  buildRadioField,
  buildTextField,
} from './fieldBuilders'
import {
  Application,
  ApplicationTypes,
  Comparators,
  Form,
  StaticText,
  TextField,
  ApplicationStatus,
} from '@island.is/application/types'

const ExampleForm: Form = buildForm({
  id: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
  title: 'Atvinnuleysisbætur',
  children: [
    buildSection({
      id: 'intro',
      title: 'name',
      children: [
        buildDescriptionField({
          id: 'field',
          title: 'name',
          description: 'Þessi umsókn snýr að atvinnuleysisbótum',
        }),
        buildMultiField({
          id: 'about',
          title: 'name',
          children: [
            buildTextField({
              id: 'person.name',
              title: 'name',
            }),
            buildTextField({
              id: 'person.nationalId',
              title: 'name',
            }),
            buildTextField({
              id: 'person.phoneNumber',
              title: 'name',
              condition: {
                questionId: 'person.age',
                isMultiCheck: false,
                comparator: Comparators.GTE,
                value: '18',
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'career',
      title: 'name',
      children: [
        buildRadioField({
          id: 'careerHistory',
          title: 'name',
          options: [
            { value: 'yes', label: 'name' },
            { value: 'no', label: 'name' },
          ],
        }),
        buildCheckboxField({
          id: 'careerHistoryCompanies',
          title: 'name',
          options: [
            { value: 'government', label: 'name' },
            { value: 'aranja', label: 'Aranja' },
            { value: 'advania', label: 'Advania' },
          ],
        }),
        buildTextField({
          id: 'dreamJob',
          title: 'name',
        }),
      ],
    }),
  ],
})

describe('application schema utility functions', () => {
  it('should get all screens in a form', () => {
    const screens = getFormNodeLeaves(ExampleForm)

    expect(screens.length).toBe(5)
    expect(screens[0].id).toBe('field')
    expect(screens[1].id).toBe('about')
    expect(screens[2].id).toBe('careerHistory')
    expect(screens[3].id).toBe('careerHistoryCompanies')
    expect(screens[4].id).toBe('dreamJob')
  })
  it('can get all screens for a given form node', () => {
    const screens = getFormNodeLeaves(ExampleForm.children[0])

    expect(screens.length).toBe(2)
    expect(screens[0].id).toBe('field')
    expect(screens[1].id).toBe('about')

    const otherScreens = getFormNodeLeaves(ExampleForm.children[1])

    expect(otherScreens.length).toBe(3)
    expect(otherScreens[0].id).toBe('careerHistory')
    expect(otherScreens[1].id).toBe('careerHistoryCompanies')
    expect(otherScreens[2].id).toBe('dreamJob')
  })
})

describe('formatText', () => {
  const application: Application = {
    answers: { someAnswer: 'awesome' },
    assignees: [],
    applicantActors: [],
    applicant: '',
    created: new Date(),
    externalData: {},
    id: '',
    modified: new Date(),
    state: '',
    typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
    status: ApplicationStatus.IN_PROGRESS,
  }
  const formatMessage: (descriptor: StaticText, values?: unknown) => string = (
    descriptor,
  ) => descriptor as string
  it('should return plain text as is', () => {
    expect(formatText('text', application, formatMessage)).toBe('text')
    expect(formatText('blabbb', application, formatMessage)).toBe('blabbb')
  })
  it('should use the passed in application to format dynamic strings', () => {
    expect(
      formatText(
        (a) => `Hello mr. ${a.answers.someAnswer}`,
        application,
        formatMessage,
      ),
    ).toBe('Hello mr. awesome')

    expect(
      formatText(
        (a) => `Oh you are ${a.answers.someAnswer} too!`,
        application,
        formatMessage,
      ),
    ).toBe('Oh you are awesome too!')
  })
  it('should pass values of StaticText object into formatMessage', () => {
    const valueSpy = jest.fn()
    const expectedValues = {
      hello: 'world',
    }

    expect(valueSpy).toHaveBeenCalledTimes(0)

    const formatMessageWithValueSpy: (
      descriptor: StaticText,
      values?: unknown,
    ) => string = (descriptor, values) => {
      if (values) {
        valueSpy(values)
      }

      return descriptor as string
    }

    formatText(
      {
        id: 'test',
        description: 'Some description',
        values: expectedValues,
      },
      application,
      formatMessageWithValueSpy,
    )

    expect(valueSpy).toHaveBeenCalledTimes(1)
    expect(valueSpy).toHaveBeenLastCalledWith(expectedValues)
  })
})

describe('extractRepeaterIndexFromField', () => {
  it('should return the valid repeater index from a field inside a repeater', () => {
    const field = {
      ...buildTextField({ id: 'periods[123].id', title: '' }),
      isPartOfRepeater: true,
    } as TextField
    expect(extractRepeaterIndexFromField(field)).toBe(123)
  })
  it('should return the first valid repeater index from a field inside a repeater', () => {
    const field = {
      ...buildTextField({ id: 'periods[123].id[456].asIso[789]', title: '' }),
      isPartOfRepeater: true,
    } as TextField
    expect(extractRepeaterIndexFromField(field)).toBe(123)
  })
  it('should return -1 if the field is not inside a repeater', () => {
    const field = {
      ...buildTextField({ id: 'periods[123].id', title: '' }),
      isPartOfRepeater: false,
    } as TextField
    expect(extractRepeaterIndexFromField(field)).toBe(-1)
  })
  it('should return -1 if the field has invalid index', () => {
    const field = {
      ...buildTextField({ id: 'periods[1a1].id', title: '' }),
      isPartOfRepeater: true,
    } as TextField
    expect(extractRepeaterIndexFromField(field)).toBe(-1)
  })
})

describe('mergeAnswers', () => {
  it('should deep merge objects with new data', () => {
    expect(
      mergeAnswers(
        {
          periods: [{ startDate: '2021-01-29', endDate: '2021-02-19' }],
          employer: { isSelfEmployed: 'yes' },
          payments: { bank: '0000000000', union: 'id', pensionFund: 'id' },
          applicant: { email: 'mockEmail@island.is', phoneNumber: '9999999' },
          giveRights: { giveDays: 1, isGivingRights: 'no' },
          otherParent: 'no',
          requestRights: { requestDays: 18, isRequestingRights: 'no' },
          firstPeriodStart: 'specificDate',
          personalAllowance: { useAsMuchAsPossible: 'yes' },
          usePersonalAllowance: 'yes',
          usePrivatePensionFund: 'no',
          personalAllowanceFromSpouse: { useAsMuchAsPossible: 'yes' },
          usePersonalAllowanceFromSpouse: 'yes',
        },
        {
          periods: [
            { startDate: '2021-01-29', endDate: '2021-02-25', ratio: '100' },
            { startDate: '2021-02-20', endDate: '2021-03-15', ratio: '100' },
          ],
        },
      ),
    ).toStrictEqual({
      periods: [
        { startDate: '2021-01-29', endDate: '2021-02-25', ratio: '100' },
        { startDate: '2021-02-20', endDate: '2021-03-15', ratio: '100' },
      ],
      employer: { isSelfEmployed: 'yes' },
      payments: { bank: '0000000000', union: 'id', pensionFund: 'id' },
      applicant: { email: 'mockEmail@island.is', phoneNumber: '9999999' },
      giveRights: { giveDays: 1, isGivingRights: 'no' },
      otherParent: 'no',
      requestRights: { requestDays: 18, isRequestingRights: 'no' },
      firstPeriodStart: 'specificDate',
      personalAllowance: { useAsMuchAsPossible: 'yes' },
      usePersonalAllowance: 'yes',
      usePrivatePensionFund: 'no',
      personalAllowanceFromSpouse: { useAsMuchAsPossible: 'yes' },
      usePersonalAllowanceFromSpouse: 'yes',
    })
  })

  it('should return a merge object', () => {
    expect(
      mergeAnswers(
        { id: 'periodStart', value: '2020-20-20' },
        { id: 'periodStart', value: '2021-01-01' },
      ),
    ).toStrictEqual({ id: 'periodStart', value: '2021-01-01' })
  })

  it('should return a merge array of object with new answers to overwrite the current answers', () => {
    expect(
      mergeAnswers(
        [
          {
            periods: [{ startDate: '2023-12-12', ratio: 100 }],
          },
        ],
        [
          {
            periods: [{ startDate: '2021-01-01' }],
          },
        ],
      ),
    ).toStrictEqual([
      {
        periods: [{ startDate: '2021-01-01', ratio: 100 }],
      },
    ])
  })

  it('should return the deleted object from the array', () => {
    expect(
      mergeAnswers(
        [
          {
            periods: [{ startDate: '2023-12-12', ratio: 100 }],
          },
        ],
        [
          {
            periods: [], // They deleted the period
          },
        ],
      ),
    ).toStrictEqual([
      {
        periods: [],
      },
    ])
  })
})

describe('getValueViaPath', () => {
  it('should return error message from simple object', () => {
    expect(
      getValueViaPath(
        {
          personalAllowance: {
            usePersonalAllowance: 'Error message',
          },
        },
        'personalAllowance.usePersonalAllowance',
        undefined,
      ),
    ).toBe('Error message')
  })

  it('should return error message from array of objects', () => {
    expect(
      getValueViaPath(
        {
          periods: [
            {
              startDate: 'Error message startDate',
            },
          ],
        },
        'periods[0].startDate',
        undefined,
      ),
    ).toBe('Error message startDate')
  })

  it('should works', () => {
    expect(
      getValueViaPath(
        { 'periods[1].startDate': 'Required' },
        'periods[1].startDate',
        undefined,
      ),
    ).toBe('Required')
  })
})
