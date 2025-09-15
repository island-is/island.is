import {
  buildAsyncSelectField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildTitleField,
  getValueViaPath,
  YES,
  YesOrNo,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import * as m from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { getYears } from '../../../../utils/dates'
import {
  siaGeneralProfessionActivities,
  siaGeneralProfessions,
} from '../../../../graphql/queries'
import {
  SocialInsuranceGeneralProfessionActivitiesQuery,
  SocialInsuranceGeneralProfessionsQuery,
} from '../../../../types/schema'
import { yesOrNoOptions } from '../../../../utils'

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
        const hasPreviousEmployment = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
    }),
    buildSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.when`,
      title: m.shared.year,
      width: 'half',
      placeholder: m.shared.chooseYear,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
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
        const hasPreviousEmployment = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
    }),
    buildAsyncSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.job`,
      title: m.questions.profession,
      width: 'full',
      placeholder: m.questions.chooseProfession,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
      loadOptions: async ({ apolloClient }) => {
        const { data } =
          await apolloClient.query<SocialInsuranceGeneralProfessionsQuery>({
            query: siaGeneralProfessions,
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
        const hasPreviousEmployment = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
    }),
    buildAsyncSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.field`,
      title: m.questions.professionActivity,
      width: 'full',
      placeholder: m.questions.chooseProfessionActivity,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
      loadOptions: async ({ apolloClient }) => {
        const { data } =
          await apolloClient.query<SocialInsuranceGeneralProfessionActivitiesQuery>(
            {
              query: siaGeneralProfessionActivities,
            },
          )

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
