import {
  buildMultiField,
  buildRadioField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { ResidenceEnum } from '../../../../lib/constants'
import { SectionRouteEnum } from '../../../../lib/routes'

export const residenceField =
  buildMultiField({
    id: SectionRouteEnum.BACKGROUND_INFO_RESIDENCE,
    children: [
      buildRadioField({
        id: `${SectionRouteEnum.BACKGROUND_INFO_RESIDENCE}.status`,
        title: disabilityPensionFormMessage.questions.residenceTitle,
        options: [
          {
            value: ResidenceEnum.ownHome,
            label: disabilityPensionFormMessage.questions.residenceOwnHome,
          },
          {
            value: ResidenceEnum.rentalMarket,
            label: disabilityPensionFormMessage.questions.residenceRentalMarket,
          },
          {
            value: ResidenceEnum.socialHousing,
            label: disabilityPensionFormMessage.questions.residenceSocialHousing,
          },
          {
            value: ResidenceEnum.homeless,
            label: disabilityPensionFormMessage.questions.residenceHomeless,
          },
          {
            value: ResidenceEnum.withFamily,
            label: disabilityPensionFormMessage.questions.residenceWithFamily,
          },
          {
            value: ResidenceEnum.other,
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
          return residenceStatus === ResidenceEnum.other
        },
      })
    ]
  })
