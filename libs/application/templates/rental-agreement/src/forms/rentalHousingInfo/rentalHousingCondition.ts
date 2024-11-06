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
import * as m from '../../lib/messages'

export const RentalHousingCondition = buildSubSection({
  id: 'condition',
  title: m.housingCondition.subSectionName,
  children: [
    buildMultiField({
      id: 'condition.pageTitle',
      title: m.housingCondition.pageTitle,
      description: m.housingCondition.pageDescription,
      children: [
        buildDescriptionField({
          id: 'condition.inspectorTitle',
          title: m.housingCondition.inspectorTitle,
          titleVariant: 'h3',
          space: 1,
        }),
        buildRadioField({
          id: 'condition.inspector',
          title: '',
          description: m.housingCondition.inspectorDescription,
          options: getInspectorOptions(),
          defaultValue: RentalHousingConditionInspector.CONTRACT_PARTIES,
          width: 'half',
        }),
        buildTextField({
          id: 'condition.inspectorName',
          title: m.housingCondition.independentInspectorNameLabel,
          placeholder: m.housingCondition.independentInspectorNamePlaceholder,
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
          title: m.housingCondition.inspectionResultsTitle,
          titleVariant: 'h3',
          space: 6,
        }),
        buildTextField({
          id: 'condition.resultsDescription',
          title: m.housingCondition.inspectionResultsInputLabel,
          description: m.housingCondition.inspectionResultsDescription,
          placeholder: m.housingCondition.inspectionResultsInputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
        buildFileUploadField({
          id: 'condition.resultsFiles',
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
