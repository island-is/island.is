import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { getUnknownRelationshipOptions } from '../../../lib/utils/getUnknownRelationshipOptions'
import { FormValue } from '@island.is/application/types'
import { ApproveOptions, ExternalData } from '../../../lib/types'

export const unknownRelationshipSubSection = buildSubSection({
  condition: (_, externalData) =>
    (externalData as unknown as ExternalData).nationalRegistrySpouse.data ==
    null,
  title: m.unknownRelationship.general.sectionTitle,
  id: Routes.UNKNOWNRELATIONSHIP,
  children: [
    buildMultiField({
      id: Routes.UNKNOWNRELATIONSHIP,
      title: m.unknownRelationship.general.pageTitle,
      description: m.unknownRelationship.general.intro,
      children: [
        buildDescriptionField({
          id: `${Routes.UNKNOWNRELATIONSHIP}.description`,
          title: '',
          description: m.unknownRelationship.general.description,
          marginBottom: 3,
        }),
        buildRadioField({
          id: 'relationshipStatus.unregisteredCohabitation',
          title: m.unknownRelationship.form.title,
          options: getUnknownRelationshipOptions(),
        }),
        buildTextField({
          condition: (answers) =>
            (answers.relationshipStatus as FormValue)
              ?.unregisteredCohabitation === ApproveOptions.Yes,
          id: 'relationshipStatus.spouseNationalId',
          title: m.unknownRelationship.inputs.spouseNationalId,
          placeholder: m.unknownRelationship.inputs.spouseNationalIdPlaceholder,
          format: '######-####',
        }),
        buildTextField({
          condition: (answers) =>
            (answers.relationshipStatus as FormValue)
              ?.unregisteredCohabitation === ApproveOptions.Yes,
          id: 'relationshipStatus.spouseEmail',
          variant: 'email',
          title: m.unknownRelationship.inputs.spouseEmail,
          placeholder: m.unknownRelationship.inputs.spouseEmailPlaceholder,
        }),
        buildCheckboxField({
          condition: (answers) =>
            (answers.relationshipStatus as FormValue)
              ?.unregisteredCohabitation === ApproveOptions.Yes,
          id: 'relationshipStatus.spouseApproveTerms',
          title: '',
          options: [
            { value: 'yes', label: m.unknownRelationship.inputs.checkboxLabel },
          ],
        }),
      ],
    }),
  ],
})
