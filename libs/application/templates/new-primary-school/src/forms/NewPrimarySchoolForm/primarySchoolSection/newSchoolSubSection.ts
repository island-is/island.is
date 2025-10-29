import { Application, OrganizationTypeEnum, Query } from '@island.is/api/schema'
import {
  buildAsyncSelectField,
  buildHiddenInput,
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
            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
              variables: {
                input: {
                  type: OrganizationTypeEnum.Municipality,
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
                  ...(childGradeLevel && {
                    gradeLevels: getCurrentAndNextGrade(childGradeLevel),
                  }),
                },
              },
            })

            return (
              data?.friggOrganizationsByType
                ?.map(({ id, name }) => ({
                  value: id,
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
        buildHiddenInput({
          id: 'newSchool.triggerHiddenInput',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
