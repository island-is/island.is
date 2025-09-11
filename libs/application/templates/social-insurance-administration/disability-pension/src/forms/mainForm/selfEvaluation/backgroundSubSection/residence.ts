import {
  buildMultiField,
  buildRadioField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { Application } from '@island.is/application/types'
import { ResidenceDto } from '@island.is/clients/social-insurance-administration'

export const residenceField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_RESIDENCE,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.status`,
      title: disabilityPensionFormMessage.questions.residenceTitle,
      options: (application: Application) => {
        const residenceTypes =
          getValueViaPath<Array<ResidenceDto>>(
            application.externalData,
            'socialInsuranceAdministrationResidence.data',
          ) ?? []

        return residenceTypes.map(({ value, label }) => ({
          value: value.toString(),
          label,
        }))
      },
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.other`,
      title: disabilityPensionFormMessage.questions.residenceOtherWhat,
      variant: 'textarea',
      condition: (formValue) => {
        const residenceStatus = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.status`,
        )
        //Todo: more explicit for the "other" option
        return residenceStatus === '6'
      },
    }),
  ],
})
