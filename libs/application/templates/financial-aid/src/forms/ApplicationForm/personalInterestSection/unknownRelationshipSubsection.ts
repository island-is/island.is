import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { ExternalData } from '@island.is/application/types'
import * as m from '../../../lib/messages'
import { ApproveOptions } from '../../../lib/types'
import { unknownRelationshipOptions } from '../../../utils/options'

export const unknownRelationshipSubsection = buildSubSection({
  condition: (_, externalData) => {
    return (
      (externalData as unknown as ExternalData).nationalRegistrySpouse.data ==
      null
    )
  },
  title: m.unknownRelationship.general.sectionTitle,
  id: Routes.UNKNOWNRELATIONSHIP,
  children: [
    buildMultiField({
      id: 'unknownRelationshipMultiField',
      title: m.unknownRelationship.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'unknownRelationshipDescriptionIntro',
          title: '',
          description: m.unknownRelationship.general.intro,
        }),
        buildDescriptionField({
          id: 'unknownRelationshipDescription',
          title: '',
          description: m.unknownRelationship.general.description,
        }),
        buildDescriptionField({
          id: 'unknownRelationshipDescription2',
          title: m.unknownRelationship.form.title,
          titleVariant: 'h3',
        }),
        buildRadioField({
          id: 'relationshipStatus.unregisteredCohabitation',
          title: '',
          marginBottom: 2,
          options: unknownRelationshipOptions,
        }),
        buildTextField({
          condition: (answers) =>
            getValueViaPath<ApproveOptions>(
              answers,
              'relationshipStatus.unregisteredCohabitation',
            ) === ApproveOptions.Yes,
          id: 'relationshipStatus.spouseNationalId',
          title: m.unknownRelationship.inputs.spouseNationalId,
          placeholder: m.unknownRelationship.inputs.spouseNationalIdPlaceholder,
          format: '######-####',
          required: true,
        }),
        buildTextField({
          condition: (answers) =>
            getValueViaPath<ApproveOptions>(
              answers,
              'relationshipStatus.unregisteredCohabitation',
            ) === ApproveOptions.Yes,
          id: 'relationshipStatus.spouseEmail',
          title: m.unknownRelationship.inputs.spouseEmail,
          placeholder: m.unknownRelationship.inputs.spouseEmailPlaceholder,
          required: true,
        }),
        buildCheckboxField({
          condition: (answers) =>
            getValueViaPath<ApproveOptions>(
              answers,
              'relationshipStatus.unregisteredCohabitation',
            ) === ApproveOptions.Yes,
          id: 'relationshipStatus.spouseApproveTerms',
          title: '',
          required: true,
          options: [
            {
              label: m.unknownRelationship.inputs.checkboxLabel,
              value: ApproveOptions.Yes,
            },
          ],
        }),
      ],
    }),
  ],
})
