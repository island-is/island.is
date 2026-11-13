import { FormSystemDependency } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/shared'

import { removeAllDependencies } from './dependencyHelper'

describe('removeAllDependencies', () => {
  it.each([FieldTypesEnum.DROPDOWN_LIST, FieldTypesEnum.RADIO_BUTTONS])(
    'removes field and option IDs for %s without mutating the source',
    (fieldType) => {
      const dependencies: FormSystemDependency[] = [
        { parentProp: 'option-id', childProps: ['kept-child'] },
        { parentProp: 'field-id', childProps: ['kept-child'] },
        {
          parentProp: 'kept-parent',
          childProps: ['field-id', 'option-id', 'kept-child'],
        },
        { parentProp: 'empty-parent', childProps: ['field-id'] },
      ]

      expect(
        removeAllDependencies(dependencies, {
          id: 'field-id',
          fieldType,
          screenId: 'screen-id',
          name: { is: '', en: '' },
          isPartOfMultiset: false,
          isRequired: false,
          list: [{ id: 'option-id' }],
        }),
      ).toEqual([{ parentProp: 'kept-parent', childProps: ['kept-child'] }])
      expect(dependencies[2].childProps).toEqual([
        'field-id',
        'option-id',
        'kept-child',
      ])
    },
  )
})
