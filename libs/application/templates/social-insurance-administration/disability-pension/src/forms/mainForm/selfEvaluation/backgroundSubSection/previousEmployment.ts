import {
  buildAsyncSelectField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildTitleField,
  YES,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types/routes'
import { getYears } from '../../../../utils/dates'
import {
  siaGeneralProfessionActivitiesQuery,
  siaGeneralProfessionsQuery,
} from '../../../../graphql/queries'
import { getApplicationAnswers, yesOrNoOptions } from '../../../../utils'
import { Query } from '@island.is/api/schema'

export const previousEmploymentField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT,
  title: m.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
      title: m.questions.previousEmploymentTitle,
      width: 'half',
      options: yesOrNoOptions,
    }),
    buildTitleField({
      title: m.questions.previousEmploymentWhen,
      titleVariant: 'h5',
      condition: (formValue: FormValue) => {
        const { previousEmployment } = getApplicationAnswers(formValue)
        return previousEmployment?.hasEmployment === YES
      },
    }),
    buildSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.when`,
      title: m.shared.year,
      width: 'half',
      placeholder: m.shared.chooseYear,
      condition: (formValue: FormValue) => {
        const { previousEmployment } = getApplicationAnswers(formValue)
        return previousEmployment?.hasEmployment === YES
      },
      options: () => {
        const years = getYears(20)
        return years.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }))
      },
    }),

    buildTitleField({
      title: m.questions.previousEmploymentJob,
      titleVariant: 'h5',
      condition: (formValue: FormValue) => {
        const { previousEmployment } = getApplicationAnswers(formValue)
        return previousEmployment?.hasEmployment === YES
      },
    }),
    buildAsyncSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.job`,
      title: m.questions.profession,
      width: 'full',
      placeholder: m.questions.chooseProfession,
      condition: (formValue: FormValue) => {
        const { previousEmployment } = getApplicationAnswers(formValue)
        return previousEmployment?.hasEmployment === YES
      },
      loadOptions: async ({ apolloClient }) => {
        const { data } = await apolloClient.query<Query>({
          query: siaGeneralProfessionsQuery,
        })

        return (
          data.socialInsuranceGeneral?.professions?.map(({ value, label }) => ({
            value,
            label,
          })) ?? []
        )
      },
    }),

    buildTitleField({
      title: m.questions.previousEmploymentField,
      titleVariant: 'h5',
      condition: (formValue: FormValue) => {
        const { previousEmployment } = getApplicationAnswers(formValue)
        return previousEmployment?.hasEmployment === YES
      },
    }),
    buildAsyncSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.field`,
      title: m.questions.professionActivity,
      width: 'full',
      placeholder: m.questions.chooseProfessionActivity,
      condition: (formValue: FormValue) => {
        const { previousEmployment } = getApplicationAnswers(formValue)
        return previousEmployment?.hasEmployment === YES
      },
      loadOptions: async ({ apolloClient }) => {
        const { data } = await apolloClient.query<Query>({
          query: siaGeneralProfessionActivitiesQuery,
        })

        return (
          data.socialInsuranceGeneral?.professionActivities?.map(
            ({ value, label }) => ({
              value,
              label,
            }),
          ) ?? []
        )
      },
    }),
  ],
})
