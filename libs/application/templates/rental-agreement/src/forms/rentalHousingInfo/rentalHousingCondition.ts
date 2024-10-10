import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
  buildDescriptionField,
  buildTextField,
  buildFileUploadField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import build from 'next/dist/build'

export const RentalHousingCondition = buildSubSection({
  id: 'rentalHousingCondition',
  title: m.housingCondition.subSectionName,
  children: [
    buildMultiField({
      id: 'rentalHousingCondition',
      title: m.housingCondition.pageTitle,
      description: m.housingCondition.pageDescription,
      children: [
        buildDescriptionField({
          id: 'rentalHousingConditionTitle',
          title: m.housingCondition.inspectorTitle,
          titleVariant: 'h3',
          space: 1,
        }),
        buildRadioField({
          id: 'rentalHousingConditionInspector',
          title: '',
          description: m.housingCondition.inspectorDescription,
          options: [
            {
              value: 'contractParties',
              label: m.housingCondition.inspectorOptionContractParties,
            },
            {
              value: 'independentParty',
              label: m.housingCondition.inspectorOptionIndependentParty,
            },
          ],
          defaultValue: 'contractParties',
          width: 'half',
        }),
        buildTextField({
          id: 'rentalHousingConditionInspectorName',
          title: m.housingCondition.independantInspectorNameLabel,
          placeholder: m.housingCondition.independantInspectorNamePlaceholder,
          condition: (answers) =>
            answers.rentalHousingConditionInspector === 'independentParty',
          required: true,
        }),
        buildDescriptionField({
          id: 'rentalHousingResultsTitle',
          title: m.housingCondition.inspectionResultsTitle,
          titleVariant: 'h3',
          space: 6,
        }),
        buildTextField({
          id: 'rentalHousingConditionTextInput',
          title: m.housingCondition.inspectionResultsInputLabel,
          description: m.housingCondition.inspectionResultsDescription,
          placeholder: m.housingCondition.inspectionResultsInputPlaceholder,
          variant: 'textarea',
          rows: 8,
          minLength: 1,
        }),
        buildFileUploadField({
          id: 'fileUpload.housingCondition',
          title: m.housingCondition.fileUploadTitle,
          uploadHeader: m.housingCondition.fileUploadTitle,
          uploadDescription: m.housingCondition.fileUploadDescription,
          uploadAccept: '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
          uploadMultiple: true,
          forImageUpload: true,
        }),
      ],
    }),
  ],
})
