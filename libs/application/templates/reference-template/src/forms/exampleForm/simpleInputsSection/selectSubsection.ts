import {
  buildMultiField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { selectOptions } from '../../../utils/options'

export const selectSubsection = buildSubSection({
  id: 'select',
  title: 'Select',
  children: [
    buildMultiField({
      id: 'selectMultiField',
      title: 'Select fields',
      children: [
        buildSelectField({
          id: 'select',
          title: 'Regular select',
          options: selectOptions,
        }),
        buildSelectField({
          id: 'halfSelect',
          title: 'Half select',
          options: selectOptions,
          width: 'half',
        }),
        buildSelectField({
          id: 'whiteSelect',
          title: 'White (try to use blue if possible)',
          options: selectOptions,
          width: 'half',
          backgroundColor: 'white',
        }),
        buildSelectField({
          id: 'placeholderSelect',
          title: 'Placeholder select',
          options: selectOptions,
          placeholder: 'Select an option',
          width: 'half',
        }),
        buildSelectField({
          id: 'multiSelect',
          title: 'Multi select',
          options: selectOptions,
          isMulti: true,
        }),
      ],
    }),
  ],
})
