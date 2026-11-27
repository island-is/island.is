import { ApplicationMapper } from './application.mapper'
import { FieldTypesEnum } from '@island.is/form-system/shared'
import { FieldDto } from '../../fields/models/dto/field.dto'
import { ScreenDto } from '../../screens/models/dto/screen.dto'
import { SectionDto } from '../../sections/models/dto/section.dto'

describe('ApplicationMapper application JSON', () => {
  it('omits hidden dependent multiset values without renumbering saved rows', () => {
    const mapper = new ApplicationMapper()
    const fields = [
      Object.assign(new FieldDto(), {
        id: 'parent',
        identifier: 'parent',
        fieldType: FieldTypesEnum.CHECKBOX,
        isPartOfMultiset: true,
        values: [
          { order: 0, json: { checkboxValue: false } },
          { order: 1, json: { checkboxValue: true } },
        ],
      }),
      Object.assign(new FieldDto(), {
        id: 'child',
        identifier: 'child',
        fieldType: FieldTypesEnum.TEXTBOX,
        isPartOfMultiset: true,
        values: [
          { order: 0, json: { text: 'Hidden answer' } },
          { order: 1, json: { text: 'Visible answer' } },
        ],
      }),
      Object.assign(new FieldDto(), {
        id: 'standalone',
        identifier: 'standalone',
        fieldType: FieldTypesEnum.TEXTBOX,
        isPartOfMultiset: false,
        values: [{ order: 0, json: { text: 'Standalone answer' } }],
      }),
    ]
    const json = mapper.mapApplicationDtoToApplicationJsonDto({
      dependencies: [
        {
          parentProp: 'parent',
          childProps: ['child', 'standalone'],
          isSelected: true,
        },
      ],
      sections: [
        Object.assign(new SectionDto(), {
          screens: [Object.assign(new ScreenDto(), { isMulti: true, fields })],
        }),
      ],
    })
    expect(
      json.fields.find((field) => field.identifier === 'child')?.values,
    ).toEqual([{ order: 1, json: { text: 'Visible answer' } }])
    expect(
      json.fields.find((field) => field.identifier === 'standalone')?.values,
    ).toHaveLength(1)
    expect(fields[1].values).toHaveLength(2)
  })

  it('includes the localized form name in the X-Road JSON', () => {
    const mapper = new ApplicationMapper()

    const applicationJson = mapper.mapApplicationDtoToApplicationJsonDto({
      id: 'application-id',
      slug: 'form-slug',
      formName: { is: 'Heiti eyðublaðs', en: 'Form name' },
      sections: [],
    })

    expect(JSON.parse(JSON.stringify(applicationJson))).toMatchObject({
      id: 'application-id',
      slug: 'form-slug',
      formName: { is: 'Heiti eyðublaðs', en: 'Form name' },
    })
  })
})
