import { ApplicationMapper } from './application.mapper'
import {
  FieldTypesEnum,
  getHiddenMultisetFieldIds,
} from '@island.is/form-system/shared'
import { FieldDto } from '../../fields/models/dto/field.dto'
import { ScreenDto } from '../../screens/models/dto/screen.dto'
import { SectionDto } from '../../sections/models/dto/section.dto'

jest.mock('@island.is/form-system/shared', () => {
  const actual = jest.requireActual<
    typeof import('@island.is/form-system/shared')
  >('@island.is/form-system/shared')
  return {
    ...actual,
    getHiddenMultisetFieldIds: jest.fn(actual.getHiddenMultisetFieldIds),
  }
})

describe('ApplicationMapper application JSON', () => {
  it.each([false, true])(
    'filters values and caches row visibility only for multiset=%s',
    (isMulti) => {
      jest.mocked(getHiddenMultisetFieldIds).mockClear()
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
            screens: [Object.assign(new ScreenDto(), { isMulti, fields })],
          }),
        ],
      })
      expect(
        json.fields.find((field) => field.identifier === 'child')?.values,
      ).toEqual(
        isMulti
          ? [{ order: 1, json: { text: 'Visible answer' } }]
          : fields[1].values,
      )
      expect(
        json.fields.find((field) => field.identifier === 'standalone')?.values,
      ).toHaveLength(1)
      expect(fields[1].values).toHaveLength(2)
      expect(getHiddenMultisetFieldIds).toHaveBeenCalledTimes(isMulti ? 2 : 0)
    },
  )

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
