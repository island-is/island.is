import {
  buildMultiField,
  buildRadioField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { Application } from '@island.is/application/types'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../../utils'

export const residenceField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_RESIDENCE,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.status`,
      title: m.questions.residenceTitle,
      options: (application: Application) => {
        const { residenceTypes = [] } = getApplicationExternalData(
          application.externalData,
        )
        return residenceTypes.map(({ value, label }) => ({
          value: value.toString(),
          label,
        }))
      },
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.other`,
      title: m.questions.residenceOtherWhat,
      variant: 'textarea',
      condition: (formValue, externalData) => {
        const { residence } = getApplicationAnswers(formValue)
        const { residenceTypes } = getApplicationExternalData(externalData)

        const otherType = residenceTypes?.find(
          (type) => type.value.toString() === residence,
        )
        return otherType?.needsFurtherInformation ?? false
      },
    }),
  ],
})
