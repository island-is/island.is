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
import { disabilityPensionFormMessage } from '../../../../lib/messages'
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
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
      title: disabilityPensionFormMessage.questions.previousEmploymentTitle,
      width: 'half',
      options: yesOrNoOptions,
    }),
    buildTitleField({
      title: disabilityPensionFormMessage.questions.previousEmploymentWhen,
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
      title: disabilityPensionFormMessage.shared.year,
      width: 'half',
      placeholder: disabilityPensionFormMessage.shared.chooseYear,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<YesOrNo>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
      options: () => {
        //TODO: Validate that the user is not selecting more than two years (calculate months as well)
        const years = getYears(20)
        return years.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }))
      },
    }),

    buildTitleField({
      title: disabilityPensionFormMessage.questions.previousEmploymentJob,
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
      title: disabilityPensionFormMessage.questions.profession,
      width: 'full',
      placeholder: disabilityPensionFormMessage.questions.chooseJob,
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
      title: disabilityPensionFormMessage.questions.previousEmploymentField,
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
      title: disabilityPensionFormMessage.questions.professionActivity,
      width: 'full',
      placeholder: disabilityPensionFormMessage.questions.chooseProfessionActivity,
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
