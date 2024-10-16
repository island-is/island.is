import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'

export const inARelationshipSubSection = buildSubSection({
  condition: (_, externalData) =>
    externalData.nationalRegistrySpouse.data !== null,
  id: Routes.INRELATIONSHIP,
  title: m.inRelationship.general.sectionTitle,
  children: [
    buildMultiField({
      title: m.inRelationship.general.sectionTitle,
      description: m.inRelationship.general.intro,
      children: [
        buildDescriptionField({
          id: 'spouse.description',
          title: '',
          description: m.inRelationship.general.description,
        }),
        buildTextField({
          id: 'spouse.email',
          title: m.inRelationship.inputs.spouseEmail,
          variant: 'email',
          required: true,
          width: 'full',
          placeholder: m.inRelationship.inputs.spouseEmailPlaceholder,
        }),
        buildCheckboxField({
          id: 'spouse.approveTerms',
          title: '',
          required: true,
          defaultValue: [],
          options: [
            {
              value: 'yes',
              label: m.inRelationship.inputs.checkboxLabel,
            },
          ],
        }),
      ],
    }),
  ],
})
