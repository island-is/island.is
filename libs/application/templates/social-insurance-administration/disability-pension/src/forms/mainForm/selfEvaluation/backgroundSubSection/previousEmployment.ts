import {
  buildAsyncSelectField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildTitleField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { getYears } from '../../../../utils/dates'
import { Locale } from '@island.is/shared/types'
import { EmploymentStatusResponse } from '../../../../types/interfaces'
import {
  siaGeneralProfessionActivities,
  siaGeneralProfessions,
} from '../../../../graphql/queries'
import {
  SocialInsuranceGeneralProfessionActivitiesQuery,
  SocialInsuranceGeneralProfessionsQuery,
} from '../../../../types/schema'

export const previousEmploymentField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
      title: disabilityPensionFormMessage.questions.previousEmploymentTitle,
      width: 'half',
      options: (application: Application, _, locale: Locale) => {
        const responses =
          getValueViaPath<Array<EmploymentStatusResponse>>(
            application.externalData,
            'socialInsuranceAdministrationEmploymentStatuses.data',
          ) ?? []

        const localResponse = responses.find(
          (r) => r.languageCode === locale.toUpperCase(),
        )

        return (
          localResponse?.employmentStatuses.map(({ value, displayName }) => ({
            value: value.toString(),
            label: displayName,
          })) ?? []
        )
      },
    }),

    buildTitleField({
      title: disabilityPensionFormMessage.questions.previousEmploymentWhen,
      titleVariant: 'h5',
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
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
        const hasPreviousEmployment = getValueViaPath<string>(
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
        const hasPreviousEmployment = getValueViaPath<string>(
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
      placeholder: disabilityPensionFormMessage.questions.chooseProfession,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
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
          data.socialInsuranceGeneral?.professions
            ?.filter((p) => p.value)
            .map(({ value, description }) => ({
              value,
              label: description ?? '',
            })) ?? []
        )
      },
    }),

    buildTitleField({
      title: disabilityPensionFormMessage.questions.previousEmploymentField,
      titleVariant: 'h5',
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
    }),
    buildAsyncSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.field`,
      title: disabilityPensionFormMessage.questions.profession,
      width: 'full',
      placeholder: disabilityPensionFormMessage.questions.chooseProfession,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
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
          data.socialInsuranceGeneral?.professionActivities
            ?.filter((p) => p.value)
            .map(({ value, description }) => ({
              value,
              label: description ?? '',
            })) ?? []
        )
      },
    }),
  ],
})
