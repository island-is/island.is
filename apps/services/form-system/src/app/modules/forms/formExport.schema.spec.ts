import { FieldTypesEnum } from '@island.is/form-system/shared'
import { formExportSchema } from './formExport.schema'

const parseField = (field: Record<string, unknown>) =>
  formExportSchema.parse({
    format: 'island.is/form-system',
    version: 1,
    form: {
      id: '00000000-0000-4000-8000-000000000001',
      identifier: 'form',
      name: { is: 'Form' },
      sections: [
        {
          id: '00000000-0000-4000-8000-000000000002',
          identifier: 'section',
          name: { is: 'Section' },
          sectionType: 'INPUT',
          displayOrder: 0,
          screens: [
            {
              id: '00000000-0000-4000-8000-000000000003',
              identifier: 'screen',
              name: { is: 'Screen' },
              displayOrder: 0,
              fields: [
                {
                  id: '00000000-0000-4000-8000-000000000004',
                  identifier: 'field',
                  name: { is: 'Field' },
                  displayOrder: 0,
                  ...field,
                },
              ],
            },
          ],
        },
      ],
    },
  }).form.sections[0].screens[0].fields[0]

it.each([
  { fieldType: FieldTypesEnum.TEXTBOX, property: 'tooltip' },
  { fieldType: FieldTypesEnum.NUMBERBOX, property: 'tooltip' },
  { fieldType: FieldTypesEnum.MESSAGE, property: 'informationText' },
])(
  'imports legacy $fieldType descriptions into $property',
  ({ fieldType, property }) => {
    const description = { is: 'Texti', en: 'Text' }
    const field = parseField({
      fieldType,
      description,
      fieldSettings: { hasDescription: false },
    })

    expect(field).toHaveProperty(property, description)
    expect(field).not.toHaveProperty('description')
    expect(field.fieldSettings).not.toHaveProperty('hasDescription')
  },
)

it('imports legacy checkbox descriptions as sublabels and preserves their large layout', () => {
  const description = { is: '', en: 'English sublabel' }
  const field = parseField({
    fieldType: FieldTypesEnum.CHECKBOX,
    description,
    fieldSettings: { isLarge: false, hasDescription: false },
  })

  expect(field.fieldSettings).toEqual({ subLabel: description, isLarge: true })
  expect(field).not.toHaveProperty('informationText')
})

it('preserves independent information, tooltip and sublabel text in new exports', () => {
  const informationText = { is: 'Instructions', en: 'English instructions' }
  const tooltip = { is: 'Help', en: 'English help' }
  const subLabel = { is: 'Checkbox text', en: 'English checkbox text' }
  const field = parseField({
    fieldType: FieldTypesEnum.CHECKBOX,
    informationText,
    tooltip,
    fieldSettings: { subLabel, isLarge: true },
  })

  expect(field).toMatchObject({
    informationText,
    tooltip,
    fieldSettings: { subLabel, isLarge: true },
  })
})
