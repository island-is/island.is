import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { vehicleSpacing } from '../../../lib/messages'
import { getFreightItems } from '../../../utils'
import { ExemptionFor } from '../../../shared'

export const vehicleSpacingSection = buildSection({
  id: 'vehicleSpacingSection',
  title: vehicleSpacing.general.sectionTitle,
  condition: (answers) => {
    const freightItems = getFreightItems(answers)
    return freightItems.some((item) =>
      item.exemptionFor?.includes(ExemptionFor.WEIGHT),
    )
  },
  children: [
    buildMultiField({
      id: 'vehicleSpacingMultiField',
      title: vehicleSpacing.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'lorem ipsum',
        }),
      ],
    }),
  ],
})
