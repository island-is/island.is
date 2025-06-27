import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTitleField,
  YES,
  NO,
  buildFileUploadField,
  getValueViaPath,
  YesOrNoEnum,
  buildRadioField
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { YesOrNoOptions } from '../../../lib/utils'

const disabilityEvaluationRoute = 'disabilityEvaluation'

export const disabilityEvaluationSubSection =
    buildSubSection({
      id: disabilityEvaluationRoute,
      title: disabilityPensionFormMessage.disabilityEvaluation.tabTitle,
      children: [
        buildMultiField({
          id: disabilityEvaluationRoute,
          title: disabilityPensionFormMessage.disabilityEvaluation.title,
          description: disabilityPensionFormMessage.disabilityEvaluation.description,
          space: 'containerGutter',
          children: [
            buildRadioField({
              id: `${disabilityEvaluationRoute}.appliedBefore`,
              title: disabilityPensionFormMessage.disabilityEvaluation.appliedBeforeTitle,
              description: disabilityPensionFormMessage.disabilityEvaluation.appliedBeforeDescription,
              required: true,
              width: 'half',
              options: YesOrNoOptions,
            }),
            buildFileUploadField({
              id: `${disabilityEvaluationRoute}.fileUpload`,
              title: disabilityPensionFormMessage.basicInfo.disabilityEvaluationTitle,
              uploadButtonLabel: disabilityPensionFormMessage.disabilityEvaluation.uploadButtonLabel,
              condition: (formValue) => {
                const isWorking = getValueViaPath<YesOrNoEnum>(
                  formValue,
                  `${disabilityEvaluationRoute}.appliedBefore`,
                )

                return isWorking === YES
              },
            })
          ],
        }),
      ],
    })
