import { FieldTypesEnum } from '@island.is/form-system/shared'
import { formExportSchema } from './formExport.schema'

const parseField = (field: Record<string, unknown>, version = 2) =>
  formExportSchema.parse({
    format: 'island.is/form-system',
    version,
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

it('rejects legacy exports rather than converting their field content', () => {
  expect(() =>
    parseField(
      {
        fieldType: FieldTypesEnum.CHECKBOX,
        description: { is: '', en: 'English sublabel' },
        fieldSettings: { isLarge: false, hasDescription: false },
      },
      1,
    ),
  ).toThrow()
})

it.each([true, false])(
  'preserves field content and isLarge=%s without conversion',
  (isLarge) => {
    const informationText = { is: 'Instructions', en: 'English instructions' }
    const tooltip = { is: 'Help', en: 'English help' }
    const subLabel = { is: 'Checkbox text', en: 'English checkbox text' }
    const field = parseField({
      fieldType: FieldTypesEnum.CHECKBOX,
      informationText,
      tooltip,
      fieldSettings: { subLabel, isLarge },
    })

    expect(field).toMatchObject({
      informationText,
      tooltip,
      fieldSettings: { subLabel, isLarge },
    })
  },
)
