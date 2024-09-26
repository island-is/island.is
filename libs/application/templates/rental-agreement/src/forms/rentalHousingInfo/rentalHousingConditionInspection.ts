import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
  buildDescriptionField,
  buildTextField,
  buildFileUploadField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalHousingConditionInspection = buildSubSection({
  id: 'rentalHousingConditionInspection',
  title: m.housingConditionInspection.subSectionName,
  children: [
    buildMultiField({
      id: 'rentalHousingConditionInspection',
      title: m.housingConditionInspection.pageTitle,
      description: m.housingConditionInspection.pageDescription,
      children: [
        buildRadioField({
          id: 'rentalHousingConditionInspectionRadio',
          title: m.housingConditionInspection.inspectorTitle,
          description: m.housingConditionInspection.inspectorDescription,
          options: [
            {
              value: 'contractParties',
              label:
                m.housingConditionInspection.inspectorOptionContractParties,
            },
            {
              value: 'independentParty',
              label:
                m.housingConditionInspection.inspectorOptionIndependentParty,
            },
          ],
          width: 'half',
          space: 1,
        }),
        buildDescriptionField({
          id: 'rentalHousingConditionInspectionTitle',
          title: m.housingConditionInspection.inspectionResultsTitle,
          description:
            m.housingConditionInspection.inspectionResultsDescription,
          titleVariant: 'h5',
          space: 3,
        }),
        buildTextField({
          id: 'rentalHousingConditionInspectionTextInput',
          title: m.housingConditionInspection.inspectionResultsInputLabel,
          placeholder:
            m.housingConditionInspection.inspectionResultsInputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
        buildFileUploadField({
          id: 'rentalHousingConditionInspectionFileUpload',
          title: m.housingConditionInspection.fileUploadTitle,
          uploadDescription: m.housingConditionInspection.fileUploadDescription,
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
