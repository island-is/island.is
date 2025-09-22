import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
  buildDescriptionField,
  buildTextField,
  buildFileUploadField,
} from '@island.is/application/core'
import { applicationAnswers } from '../../../shared'
import { Routes, RentalHousingConditionInspector } from '../../../utils/enums'
import { getInspectorOptions } from '../../../utils/options'
import * as m from '../../../lib/messages'

export const conditionSubsection = buildSubSection({
  id: Routes.CONDITION,
  title: m.housingCondition.subSectionName,
  children: [
    buildMultiField({
      id: Routes.CONDITION,
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
          description: m.housingCondition.inspectorDescription,
          options: getInspectorOptions(),
          clearOnChange: ['condition.inspectorName'],
          defaultValue: RentalHousingConditionInspector.CONTRACT_PARTIES,
          width: 'half',
        }),
        buildTextField({
          id: 'condition.inspectorName',
          title: m.misc.fullName,
          placeholder: m.housingCondition.independentInspectorNamePlaceholder,
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
        }),
      ],
    }),
  ],
})
