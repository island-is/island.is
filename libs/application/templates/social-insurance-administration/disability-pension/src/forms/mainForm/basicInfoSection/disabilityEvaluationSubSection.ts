import {
  buildMultiField,
  buildSubSection,
  YES,
  buildFileUploadField,
  getValueViaPath,
  YesOrNoEnum,
  buildRadioField
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import { yesOrNoOptions } from '../../../utils'

export const disabilityEvaluationSubSection =
    buildSubSection({
      id: SectionRouteEnum.DISABILITY_EVALUATION,
      title: disabilityPensionFormMessage.disabilityEvaluation.tabTitle,
      children: [
        buildMultiField({
          id: SectionRouteEnum.DISABILITY_EVALUATION,
          title: disabilityPensionFormMessage.disabilityEvaluation.title,
          description: disabilityPensionFormMessage.disabilityEvaluation.description,
          space: 'containerGutter',
          children: [
            buildRadioField({
              id: `${SectionRouteEnum.DISABILITY_EVALUATION}.appliedBefore`,
              title: disabilityPensionFormMessage.disabilityEvaluation.appliedBeforeTitle,
              description: disabilityPensionFormMessage.disabilityEvaluation.appliedBeforeDescription,
              required: true,
              width: 'half',
              options: yesOrNoOptions,
            }),
            buildFileUploadField({
              id: `${SectionRouteEnum.DISABILITY_EVALUATION}.fileUpload`,
              title: disabilityPensionFormMessage.basicInfo.disabilityEvaluationTitle,
              uploadButtonLabel: disabilityPensionFormMessage.disabilityEvaluation.uploadButtonLabel,
              condition: (formValue) => {
                const isWorking = getValueViaPath<YesOrNoEnum>(
                  formValue,
                  `${SectionRouteEnum.DISABILITY_EVALUATION}.appliedBefore`,
                )

                return isWorking === YES
              },
            })
          ],
        }),
      ],
    })
