import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { formerEducation } from '../../../../lib/messages/formerEducation'
import { Routes } from '../../../../lib/constants'
import { FormValue } from '@island.is/application/types'
import { InlineResponse200Items } from '@island.is/clients/inna'
import { ApplicationTypes } from '@island.is/university-gateway'

export const FinishedEducationSubSection = buildSubSection({
  id: `${Routes.EDUCATIONDETAILS}.finishedDetails`,
  title: formerEducation.labels.educationDetails.pageTitle,
  condition: (answers: FormValue, externalData) => {
    const optionAnswers = getValueViaPath(answers, 'educationOptions')

    const predefinedInnaData = getValueViaPath(
      externalData,
      'innaEducation.data',
      [],
    ) as Array<InlineResponse200Items>

    return (
      optionAnswers === ApplicationTypes.DIPLOMA ||
      predefinedInnaData.length > 0
    )
  },
  children: [
    buildMultiField({
      id: `${Routes.EDUCATIONDETAILS}.finishedDetailsMultiField`,
      title: formerEducation.labels.educationDetails.pageTitle,
      description: formerEducation.labels.educationDetails.pageDescription,
      children: [
        buildCustomField({
          id: `${Routes.EDUCATIONDETAILS}.finishedDetails`,
          title: '',
          component: 'EducationDetails',
        }),
      ],
    }),
  ],
})
