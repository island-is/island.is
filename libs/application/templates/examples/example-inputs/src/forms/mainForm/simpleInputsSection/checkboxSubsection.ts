import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { checkboxOptions } from '../../../utils/options'

export const checkboxSubsection = buildSubSection({
  id: 'checkbox',
  title: 'Checkboxes',
  children: [
    buildMultiField({
      id: 'checkboxMultiField',
      title: 'Checkboxes',
      children: [
        buildCheckboxField({
          id: 'checkbox',
          title: 'Full width checkboxes',
          options: checkboxOptions, // Importing options from utils makes the template much more readable
        }),
        buildCheckboxField({
          id: 'checkboxHalf',
          title: 'Half width checkboxes',
          width: 'half',
          options: checkboxOptions,
        }),
        buildCheckboxField({
          id: 'checkboxHalfStrong',
          title: 'Half width strong checkboxes',
          width: 'half',
          strong: true,
          options: checkboxOptions,
        }),
      ],
    }),
  ],
})
