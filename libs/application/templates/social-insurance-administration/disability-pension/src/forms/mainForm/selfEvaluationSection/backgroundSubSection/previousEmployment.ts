import {
  buildMultiField,
  buildRadioField,
  buildTextField,
  getValueViaPath,
  YES,
  NO,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { FormValue } from '@island.is/application/types'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'



export const previousEmploymentField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT,
  title: disabilityPensionFormMessage.questions.previousEmploymentTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
      width: 'half',
      options: [
        {
          value: YES,
          label: socialInsuranceAdministrationMessage.shared.yes,
        },
        {
          value: NO,
          label: socialInsuranceAdministrationMessage.shared.no,
        },
      ]
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.when`,
      title: disabilityPensionFormMessage.questions.previousEmploymentWhen,
      placeholder: '20XX',
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
      width: 'full',
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.field`,
      title: disabilityPensionFormMessage.questions.previousEmploymentField,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
      width: 'full',
    }),
  ],
})
