import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const confirmMunicipality = buildSection({
  id: 'confirmMunicipality',
  title: m.prereqMessages.confirmMunicipalityTitle,
  children: [
    buildMultiField({
      id: 'confirmMunicipalityMultiField',
      title: m.prereqMessages.confirmMunicipalityTitle,
      children: [
        buildDescriptionField({
          id: 'confirmMunicipalityDescription',
          description: m.prereqMessages.confirmMunicipalityDescription,
          marginBottom: 4,
        }),
        buildCheckboxField({
          id: 'confirmMunicipality',
          options: [
            {
              label: m.prereqMessages.confirmMunicipalityCheckbox,
              value: YES,
            },
          ],
        }),
      ],
    }),
  ],
})
