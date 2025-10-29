import { Application, OrganizationTypeEnum, Query } from '@island.is/api/schema'
import {
  buildAlertMessageField,
  buildAsyncSelectField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
  NO,
} from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../../graphql/queries'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  ApplicationType,
  NU_UNIT_ID,
  OrganizationSubType,
} from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentAndNextGrade,
  getSelectedSchoolSubType,
  getSelectedSchoolUnitId,
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
                  gradeLevels: getCurrentAndNextGrade(childGradeLevel ?? ''),
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
        buildAlertMessageField({
          id: 'newSchool.alertMessage',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message: newPrimarySchoolMessages.primarySchool.newSchoolAlertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          marginTop: 4,
          condition: (answers, externalData) => {
            const selectedSchoolId = getSelectedSchoolUnitId(
              answers,
              externalData,
            )

            return selectedSchoolId === NU_UNIT_ID
          },
        }),
        buildAlertMessageField({
          id: 'newSchool.specialSchoolOrDepartmentAlertMessage',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message:
            newPrimarySchoolMessages.primarySchool
              .newSchoolSpecialSchoolOrDepartmentAlertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          marginTop: 4,
          condition: (answers, externalData) => {
            const selectedSchoolSubType = getSelectedSchoolSubType(
              answers,
              externalData,
            )

            return (
              selectedSchoolSubType !== '' &&
              [
                OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
                OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL,
                OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_DEPARTMENT,
                OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_SCHOOL,
              ].includes(selectedSchoolSubType)
            )
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
