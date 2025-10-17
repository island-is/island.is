import { Application, OrganizationTypeEnum, Query } from '@island.is/api/schema'
import {
  buildAsyncSelectField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
  NO,
} from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../../graphql/queries'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { ApplicationType } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentAndNextGrade,
} from '../../../utils/newPrimarySchoolUtils'

export const newSchoolSubSection = buildSubSection({
  id: 'newSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
  condition: (answers) => {
    const { applyForPreferredSchool, applicationType } =
      getApplicationAnswers(answers)

    return (
      applicationType === ApplicationType.NEW_PRIMARY_SCHOOL ||
      (applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
        applyForPreferredSchool === NO)
    )
  },
  children: [
    buildMultiField({
      id: 'newSchool',
      title: newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
      children: [
        buildAsyncSelectField({
          id: 'newSchool.municipality',
          title: newPrimarySchoolMessages.shared.municipality,
          placeholder: newPrimarySchoolMessages.shared.municipalityPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          defaultValue: (application: Application) => {
            const { applicantMunicipalityCode } = getApplicationExternalData(
              application.externalData,
            )

            return applicantMunicipalityCode
          },
          loadOptions: async ({ apolloClient }) => {
            // const { childGradeLevel } = getApplicationExternalData(
            //   application.externalData,
            // )

            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
              variables: {
                input: {
                  type: OrganizationTypeEnum.Municipality,
                  //   gradeLevels: getCurrentAndNextGrade(childGradeLevel ?? ''), // TODO: Senda líka bekk fyrir ofan núverandi bekk!
                },
              },
            })

            return (
              data?.friggOrganizationsByType
                ?.map(({ name, unitId }) => ({
                  value: unitId || '',
                  label: name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) ?? []
            )
          },
        }),
        buildAsyncSelectField({
          id: 'newSchool.school',
          title: newPrimarySchoolMessages.shared.school,
          placeholder: newPrimarySchoolMessages.shared.schoolPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          updateOnSelect: ['newSchool.municipality'],
          loadOptions: async ({
            application,
            apolloClient,
            selectedValues,
          }) => {
            const municipalityCode = selectedValues?.[0]

            const { childGradeLevel } = getApplicationExternalData(
              application.externalData,
            )

            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
              variables: {
                input: {
                  type: OrganizationTypeEnum.School,
                  municipalityCode: municipalityCode,
                  gradeLevels: getCurrentAndNextGrade(childGradeLevel ?? ''), // TODO: Senda líka bekk fyrir ofan núverandi bekk!
                },
              },
            })

            // Piggyback the type as part of the value
            return (
              data?.friggOrganizationsByType
                ?.map(({ id, name, subType, sector }) => ({
                  value: `${id}::${subType ?? ''}::${sector ?? ''}`, // TODO: Skoða hvað á að setja hér! type, subType eða sector??
                  label: name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) ?? []
            )
          },
          condition: (answers) => {
            const { schoolMunicipality } = getApplicationAnswers(answers)

            return !!schoolMunicipality
          },
        }),
        buildHiddenInputWithWatchedValue({
          // TODO: Þarf þetta ef við erum að sækja þetta gildi í getApplicationAnswers() útfrá 'newSchool.school'?
          // TODO: Þarf að skoða betur - Þetta er ekki lengur sama týpa og var áður!
          id: 'newSchool.type',
          watchValue: 'newSchool.school',
          valueModifier: (value) => value?.toString()?.split('::')[1],
        }),
      ],
    }),
  ],
})
