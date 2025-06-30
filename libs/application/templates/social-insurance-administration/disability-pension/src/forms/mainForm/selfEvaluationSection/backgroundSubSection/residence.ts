import {
  buildMultiField,
  buildRadioField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { backgroundRoute } from './index'
import { ResidenceEnum } from '../../../../lib/constants'

export const residenceField =
  buildMultiField({
    id: `${backgroundRoute}.residence`,
    children: [
      buildRadioField({
        id: `${backgroundRoute}.residence.status`,
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
        id: `${backgroundRoute}.residence.other`,
        title: disabilityPensionFormMessage.questions.other,
        variant: 'textarea',
        condition: (formValue) => {
          const residenceStatus = getValueViaPath<ResidenceEnum>(
            formValue,
            `${backgroundRoute}.residence.status`,
          )
          return residenceStatus === ResidenceEnum.other
        },
      })
    ]
  })
