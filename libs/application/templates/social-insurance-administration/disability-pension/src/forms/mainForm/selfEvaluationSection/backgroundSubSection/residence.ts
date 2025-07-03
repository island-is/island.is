import {
  buildMultiField,
  buildRadioField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { ResidenceEnum, SectionRouteEnum } from '../../../../types'

export const residenceField =
  buildMultiField({
    id: SectionRouteEnum.BACKGROUND_INFO_RESIDENCE,
    title: disabilityPensionFormMessage.selfEvaluation.title,
    description: disabilityPensionFormMessage.selfEvaluation.description,
    children: [
      buildRadioField({
        id: `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.status`,
        title: disabilityPensionFormMessage.questions.residenceTitle,
        options: [
          {
            value: ResidenceEnum.OWN_HOME,
            label: disabilityPensionFormMessage.questions.residenceOwnHome,
          },
          {
            value: ResidenceEnum.RENTAL_MARKET,
            label: disabilityPensionFormMessage.questions.residenceRentalMarket,
          },
          {
            value: ResidenceEnum.SOCIAL_HOUSING,
            label: disabilityPensionFormMessage.questions.residenceSocialHousing,
          },
          {
            value: ResidenceEnum.HOMELESS,
            label: disabilityPensionFormMessage.questions.residenceHomeless,
          },
          {
            value: ResidenceEnum.WITH_FAMILY,
            label: disabilityPensionFormMessage.questions.residenceWithFamily,
          },
          {
            value: ResidenceEnum.OTHER,
            label: disabilityPensionFormMessage.questions.residenceOther,
          },
        ]
      }),
      buildTextField({
        id: `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.other`,
        title: disabilityPensionFormMessage.questions.residenceOther,
        variant: 'textarea',
        condition: (formValue) => {
          const residenceStatus = getValueViaPath<ResidenceEnum>(
            formValue,
            `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.status`,
          )
          return residenceStatus === ResidenceEnum.OTHER
        },
      })
    ]
  })
