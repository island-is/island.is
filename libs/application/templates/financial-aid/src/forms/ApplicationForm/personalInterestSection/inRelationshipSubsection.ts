import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { inRelationshipOptions } from '../../../utils/options'
import { hasSpouse } from '../../../utils/conditions'

export const inRelationshipSubsection = buildSubSection({
  condition: hasSpouse,
  title: m.inRelationship.general.sectionTitle,
  id: Routes.INRELATIONSHIP,
  children: [
    buildMultiField({
      id: 'inRelationshipMultiField',
      title: m.inRelationship.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'inRelationshipDescriptionIntro',
          description: m.inRelationship.general.intro,
        }),
        buildDescriptionField({
          id: 'inRelationshipDescription',
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
          required: true,
          options: inRelationshipOptions,
        }),
      ],
    }),
  ],
})
