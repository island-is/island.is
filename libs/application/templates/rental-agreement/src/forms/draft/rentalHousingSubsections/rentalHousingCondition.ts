import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
  buildDescriptionField,
  buildTextField,
  buildFileUploadField,
} from '@island.is/application/core'
import { applicationAnswers } from '../../../shared'
import { getInspectorOptions } from '../../../utils/utils'
import { Routes, RentalHousingConditionInspector } from '../../../utils/enums'
import { housingCondition } from '../../../lib/messages'

export const RentalHousingCondition = buildSubSection({
  id: Routes.CONDITION,
  title: housingCondition.subSectionName,
  children: [
    buildMultiField({
      id: Routes.CONDITION,
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
          description: housingCondition.inspectorDescription,
          options: getInspectorOptions(),
          clearOnChange: ['condition.inspectorName'],
          defaultValue: RentalHousingConditionInspector.CONTRACT_PARTIES,
          width: 'half',
        }),
        buildTextField({
          id: 'condition.inspectorName',
          title: housingCondition.independentInspectorNameLabel,
          placeholder: housingCondition.independentInspectorNamePlaceholder,
          condition: (answers) => {
            const { inspector } = applicationAnswers(answers)
            return (
              inspector === RentalHousingConditionInspector.INDEPENDENT_PARTY
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
        }),
      ],
    }),
  ],
})
