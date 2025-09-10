import {
  buildCheckboxField,
  buildMultiField,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { Application } from '@island.is/application/types'
import { EmploymentDto} from '@island.is/clients/social-insurance-administration'

export const employmentField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildCheckboxField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.status`,
      title: disabilityPensionFormMessage.questions.employmentStatusTitle,
      width: 'full',
      options: (application: Application) => {
        const types =
          getValueViaPath<Array<EmploymentDto>>(
            application.externalData,
            'socialInsuranceAdministrationEmploymentStatuses.data',
          ) ?? []

        return [
          ...types.filter(t => !t.needsFurtherInformation).map(({value, label}) => ({
            value,
            label,
          })),
          //"other" should be at the bottom
        ...types.filter(t => t.needsFurtherInformation).map(({value, label}) => ({
              value,
              label,
            }))]
      },
    }),
    buildTitleField({
      title: disabilityPensionFormMessage.questions.employmentStatusOtherWhat,
      titleVariant: 'h5',
      marginTop: 2,
      marginBottom: 0,
      condition: (formValue) => {
        const statuses = getValueViaPath<Array<string>>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.status`,
        ) ?? []

        return statuses.includes("ANNAD")
      }
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.other`,
      variant: 'textarea',
      rows: 3,
      condition: (formValue) => {
        const statuses = getValueViaPath<Array<string>>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.status`,
        ) ?? []

        return statuses.includes("ANNAD")
      }
    }),
  ],
})
