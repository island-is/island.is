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
  YesOrNoEnum
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { EmploymentEnum } from '../../../lib/constants'

const disabilityEvaluationRoute = 'disabilityEvaluation'

export const disabilityEvaluationSubSection =
    buildSubSection({
      id: disabilityEvaluationRoute,
      tabTitle: disabilityPensionFormMessage.disabilityEvaluation.tabTitle,
      children: [
        buildMultiField({
          id: disabilityEvaluationRoute,
          space: 'containerGutter',
          children: [
            buildTitleField({
              title: disabilityPensionFormMessage.disabilityEvaluation.title,
              titleVariant: 'h2',
              marginBottom: 'p2',
            }),
            buildDescriptionField({
              id: `${disabilityEvaluationRoute}.description`,
              description: disabilityPensionFormMessage.disabilityEvaluation.description,
            }),
            buildCheckboxField({
              id: `${disabilityEvaluationRoute}.appliedBefore`,
              title: disabilityPensionFormMessage.disabilityEvaluation.appliedBeforeTitle,
              description: disabilityPensionFormMessage.disabilityEvaluation.appliedBeforeDescription,
              required: true,
              options: [
                {
                  value: YES,
                  label: disabilityPensionFormMessage.disabilityEvaluation.yes,
                },
                {
                  value: NO,
                  label: disabilityPensionFormMessage.disabilityEvaluation.no,
                },
              ],
            }),
            buildFileUploadField({
              id: `${disabilityEvaluationRoute}.fileUpload`,
              title: disabilityPensionFormMessage.disabilityEvaluation.fileUploadTitle,
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
