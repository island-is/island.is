import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { NationalRegistrySpouse } from '@island.is/api/schema'
import { inRelationshipOptions } from '../../../utils/options'

export const inRelationshipSubsection = buildSubSection({
  condition: (_, externalData) =>
    getValueViaPath<NationalRegistrySpouse>(
      externalData,
      'nationalRegistrySpouse.data',
    ) != null,
  title: m.inRelationship.general.sectionTitle,
  id: Routes.INRELATIONSHIP,
  children: [
    buildMultiField({
      id: 'inRelationshipMultiField',
      title: m.inRelationship.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'inRelationshipDescriptionIntro',
          title: '',
          description: m.inRelationship.general.intro,
        }),
        buildDescriptionField({
          id: 'inRelationshipDescription',
          title: '',
          description: m.inRelationship.general.description,
        }),
        buildTextField({
          id: 'spouse.email',
          title: m.inRelationship.inputs.spouseEmail,
          placeholder: m.inRelationship.inputs.spouseEmailPlaceholder,
          variant: 'email',
          required: true,
        }),
        buildCheckboxField({
          id: 'spouse.approveTerms',
          title: '',
          required: true,
          options: inRelationshipOptions,
        }),
      ],
    }),
  ],
})
