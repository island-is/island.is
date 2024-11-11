import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
  buildDescriptionField,
  buildTextField,
  buildFileUploadField,
} from '@island.is/application/core'
import { getApplicationAnswers, getInspectorOptions } from '../../lib/utils'
import { RentalHousingConditionInspector } from '../../lib/constants'
import { housingCondition } from '../../lib/messages'

export const RentalHousingCondition = buildSubSection({
  id: 'condition',
  title: housingCondition.subSectionName,
  children: [
    buildMultiField({
      id: 'condition.pageTitle',
      title: housingCondition.pageTitle,
      description: housingCondition.pageDescription,
      children: [
        buildDescriptionField({
          id: 'condition.inspectorTitle',
          title: housingCondition.inspectorTitle,
          titleVariant: 'h3',
          space: 1,
        }),
        buildRadioField({
          id: 'condition.inspector',
          title: '',
          description: housingCondition.inspectorDescription,
          options: getInspectorOptions(),
          defaultValue: RentalHousingConditionInspector.CONTRACT_PARTIES,
          width: 'half',
        }),
        buildTextField({
          id: 'condition.inspectorName',
          title: housingCondition.independentInspectorNameLabel,
          placeholder: housingCondition.independentInspectorNamePlaceholder,
          condition: (answers) => {
            const { inspectorOptions } = getApplicationAnswers(answers)
            return (
              inspectorOptions ===
              RentalHousingConditionInspector.INDEPENDENT_PARTY
            )
          },
          required: true,
        }),
        buildDescriptionField({
          id: 'condition.resultsTitle',
          title: housingCondition.inspectionResultsTitle,
          titleVariant: 'h3',
          space: 6,
        }),
        buildTextField({
          id: 'condition.resultsDescription',
          title: housingCondition.inspectionResultsInputLabel,
          description: housingCondition.inspectionResultsDescription,
          placeholder: housingCondition.inspectionResultsInputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
        buildFileUploadField({
          id: 'condition.resultsFiles',
          title: housingCondition.fileUploadTitle,
          uploadHeader: housingCondition.fileUploadTitle,
          uploadDescription: housingCondition.fileUploadDescription,
          uploadAccept: '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
          uploadMultiple: true,
          forImageUpload: true,
        }),
      ],
    }),
  ],
})
