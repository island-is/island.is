import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'

import {
  unknownRelationshipCheckboxOptions,
  unknownRelationshipOptions,
} from '../../../utils/options'
import { hasNoSpouse, isInRelationship } from '../../../utils/conditions'

export const unknownRelationshipSubsection = buildSubSection({
  condition: hasNoSpouse,
  title: m.unknownRelationship.general.sectionTitle,
  id: Routes.UNKNOWNRELATIONSHIP,
  children: [
    buildMultiField({
      id: 'unknownRelationshipMultiField',
      title: m.unknownRelationship.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'unknownRelationshipDescriptionIntro',
          description: m.unknownRelationship.general.intro,
        }),
        buildDescriptionField({
          id: 'unknownRelationshipDescription',
          description: m.unknownRelationship.general.description,
        }),
        buildDescriptionField({
          id: 'unknownRelationshipDescription2',
          title: m.unknownRelationship.form.title,
          titleVariant: 'h3',
        }),
        buildRadioField({
          id: 'relationshipStatus.unregisteredCohabitation',
          marginBottom: 2,
          options: unknownRelationshipOptions,
        }),
        buildTextField({
          condition: isInRelationship,
          id: 'relationshipStatus.spouseNationalId',
          title: m.unknownRelationship.inputs.spouseNationalId,
          placeholder: m.unknownRelationship.inputs.spouseNationalIdPlaceholder,
          format: '######-####',
          required: true,
        }),
        buildTextField({
          condition: isInRelationship,
          id: 'relationshipStatus.spouseEmail',
          title: m.unknownRelationship.inputs.spouseEmail,
          placeholder: m.unknownRelationship.inputs.spouseEmailPlaceholder,
          required: true,
        }),
        buildCheckboxField({
          condition: isInRelationship,
          id: 'relationshipStatus.spouseApproveTerms',
          required: true,
          options: unknownRelationshipCheckboxOptions,
        }),
      ],
    }),
  ],
})
