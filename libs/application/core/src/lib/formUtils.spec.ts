import { getFormNodeLeaves } from './formUtils'
import {
  ApplicationTypes,
  buildCheckboxField,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  Comparators,
  Form,
} from '@island.is/application/core'

const ExampleForm: Form = buildForm({
  id: ApplicationTypes.EXAMPLE,
  ownerId: 'DOL',
  name: 'Atvinnuleysisbætur',
  children: [
    buildSection({
      id: 'intro',
      name: 'name',
      children: [
        buildIntroductionField({
          id: 'field',
          name: 'name',
          introduction: 'Þessi umsókn snýr að atvinnuleysisbótum',
        }),
        buildMultiField({
          id: 'about',
          name: 'name',
          children: [
            buildTextField({
              id: 'person.name',
              name: 'name',
              required: true,
            }),
            buildTextField({
              id: 'person.nationalId',
              name: 'name',
              required: true,
            }),
            buildTextField({
              id: 'person.phoneNumber',
              name: 'name',
              required: false,
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
      name: 'name',
      children: [
        buildRadioField({
          id: 'careerHistory',
          name: 'name',
          required: true,
          options: [
            { value: 'yes', label: 'name' },
            { value: 'no', label: 'name' },
          ],
        }),
        buildCheckboxField({
          id: 'careerHistoryCompanies',
          name: 'name',
          required: false,
          options: [
            { value: 'government', label: 'name' },
            { value: 'aranja', label: 'Aranja' },
            { value: 'advania', label: 'Advania' },
          ],
        }),
        buildTextField({
          id: 'dreamJob',
          name: 'name',
          required: false,
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
