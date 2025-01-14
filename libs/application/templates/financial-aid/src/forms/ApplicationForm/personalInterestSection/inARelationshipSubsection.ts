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

export const inARelationshipSubsection = buildSubSection({
  condition: (_, externalData) => {
    const spouseData = getValueViaPath<NationalRegistrySpouse>(
      externalData,
      'nationalRegistrySpouse.data',
    )

    return spouseData != null
  },
  title: m.inRelationship.general.sectionTitle,
  id: Routes.INRELATIONSHIP,
  children: [
    buildMultiField({
      id: 'inARelationshipMultiField',
      title: m.inRelationship.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'inARelationshipDescriptionIntro',
          title: '',
          description: m.inRelationship.general.intro,
        }),
        buildDescriptionField({
          id: 'inARelationshipDescription',
          title: '',
          description: m.inRelationship.general.description,
        }),
        buildTextField({
          id: 'spouse.email',
          title: m.inRelationship.inputs.spouseEmail,
          placeholder: m.inRelationship.inputs.spouseEmailPlaceholder,
        }),
        buildCheckboxField({
          id: 'spouse.approveTerms',
          title: '',
          options: [
            {
              label: m.inRelationship.inputs.checkboxLabel,
              value: 'yes',
            },
          ],
        }),
      ],
    }),
  ],
})
