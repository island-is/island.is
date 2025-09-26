import {
  buildCheckboxField,
  buildMultiField,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { Application } from '@island.is/application/types'
import { OTHER_STATUS_VALUE } from '../../../../types/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../../utils'

export const employmentField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildCheckboxField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.status`,
      title: m.questions.employmentStatusTitle,
      width: 'full',
      options: (application: Application) => {
        const { employmentTypes = [] } = getApplicationExternalData(
          application.externalData,
        )
        return [
          ...employmentTypes
            .filter((t) => !t.needsFurtherInformation)
            .map(({ value, label }) => ({
              value,
              label,
            })),
          ...employmentTypes
            .filter((t) => t.needsFurtherInformation)
            .map(({ value, label }) => ({
              value,
              label,
            })),
        ]
      },
    }),
    buildTitleField({
      title: m.questions.employmentStatusOtherWhat,
      titleVariant: 'h5',
      marginTop: 2,
      marginBottom: 0,
      condition: (formValue) => {
        const { employmentStatus } = getApplicationAnswers(formValue)
        return employmentStatus?.includes(OTHER_STATUS_VALUE) ?? false
      },
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.other`,
      variant: 'textarea',
      rows: 3,
      condition: (formValue) => {
        const { employmentStatus } = getApplicationAnswers(formValue)
        return employmentStatus?.includes(OTHER_STATUS_VALUE) ?? false
      },
    }),
  ],
})
