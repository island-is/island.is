import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
  buildDescriptionField,
  buildTextField,
  buildFileUploadField,
} from '@island.is/application/core'
import { getApplicationAnswers, getInspectorOptions } from '../../lib/utils'
import * as m from '../../lib/messages'
import { rentalHousingConditionInspector } from '../../lib/constants'

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
          options: getInspectorOptions(),
          defaultValue: 'contractParties',
          width: 'half',
        }),
        buildTextField({
          id: 'rentalHousingConditionInspectorName',
          title: m.housingCondition.independantInspectorNameLabel,
          placeholder: m.housingCondition.independantInspectorNamePlaceholder,
          condition: (answers) => {
            const { inspectorOptions } = getApplicationAnswers(answers)
            return (
              inspectorOptions ===
              rentalHousingConditionInspector.INDEPENDENT_PARTY
            )
          },
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
        }),
        buildFileUploadField({
          id: 'asdf',
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
