import { SubSectionBuilder } from '@island.is/application/core'
import { selectOptions } from '../../../utils/options'

export const selectSubsection = new SubSectionBuilder('select', 'Select')
  .addPage('selectMultiField', 'Select fields', (page) => {
    page
      .addSelectField('select', 'Regular select', {
        options: selectOptions,
      })
      .addSelectField('halfSelect', 'Half select', {
        options: selectOptions,
        width: 'half',
      })
      .addSelectField('whiteSelect', 'White (try to use blue if possible)', {
        options: selectOptions,
        width: 'half',
        backgroundColor: 'white',
      })
      .addSelectField('placeholderSelect', 'Placeholder select', {
        options: selectOptions,
        placeholder: 'Select an option',
        width: 'half',
      })
      .addSelectField('multiSelect', 'Multi select', {
        options: selectOptions,
        isMulti: true,
      })
  })
  .build()
