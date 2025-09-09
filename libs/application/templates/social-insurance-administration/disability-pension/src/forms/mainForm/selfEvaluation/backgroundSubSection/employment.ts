import {
  buildCheckboxField,
  buildMultiField,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { EmploymentStatusResponse } from '../../../../types/interfaces'
import { Application } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'

export const employmentField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildCheckboxField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.status`,
      width: 'full',
      options: (application: Application, _, locale: Locale) => {
        const responses =
          getValueViaPath<Array<EmploymentStatusResponse>>(
            application.externalData,
            'socialInsuranceAdministrationEmploymentStatuses.data',
          ) ?? []

        const types = responses.find(
          (res) => res.languageCode === locale.toUpperCase(),
        )

        if (!types || !types.employmentStatuses) {
          return []
        }

        return types.employmentStatuses.map(({ value, displayName }) => ({
            value: value.toString(),
            label: displayName,
          }))
      },
    }),
    buildTitleField({
      title: disabilityPensionFormMessage.questions.employmentStatusOtherWhat,
      titleVariant: 'h5',
      marginTop: 2,
      marginBottom: 0,
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.other`,
      variant: 'textarea',
      rows: 3,
    }),
  ],
})
