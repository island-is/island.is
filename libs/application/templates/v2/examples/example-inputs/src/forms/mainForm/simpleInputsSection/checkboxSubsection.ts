import { SubSectionBuilder } from '@island.is/application/core'
import { checkboxOptions } from '../../../utils/options'

export const checkboxSubsection = new SubSectionBuilder(
  'checkbox',
  'Checkboxes',
)
  .addPage('checkboxMultiField', 'Checkboxes', (page) => {
    page
      .addCheckboxField('checkbox', 'Full width checkboxes', {
        options: checkboxOptions, // Importing options from utils makes the template much more readable
      })
      .addCheckboxField('checkboxHalf', 'Half width checkboxes', {
        width: 'half',
        options: checkboxOptions,
      })
      .addCheckboxField('checkboxHalfStrong', 'Half width strong checkboxes', {
        width: 'half',
        strong: true,
        options: checkboxOptions,
      })
  })
  .build()
