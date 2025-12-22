import { OrganizationTypeEnum, Query } from '@island.is/api/schema'
import {
  buildAsyncSelectField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  coreErrorMessages,
  coreMessages,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { friggOrganizationsByTypeQuery } from '../../../graphql/queries'
import { primarySchoolMessages, sharedMessages } from '../../../lib/messages'
import { isCurrentSchoolRegistered } from '../../../utils/conditionUtils'
import { ApplicationType } from '../../../utils/constants'
import {
  formatGrade,
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentSchoolName,
} from '../../../utils/newPrimarySchoolUtils'

export const currentSchoolSubSection = buildSubSection({
  id: 'currentSchoolSubSection',
  title: primarySchoolMessages.currentSchool.subSectionTitle,
  condition: (answers) => {
    // Display section if application type is "Application for a new primary school" or "Continuing enrollment"
    const { applicationType } = getApplicationAnswers(answers)
    return (
      applicationType === ApplicationType.NEW_PRIMARY_SCHOOL ||
      applicationType === ApplicationType.CONTINUING_ENROLLMENT
    )
  },
  children: [
    buildMultiField({
      id: 'currentSchool',
      title: primarySchoolMessages.currentSchool.subSectionTitle,
      children: [
        buildDescriptionField({
          id: 'currentSchool.description',
          title: primarySchoolMessages.currentSchool.currentSchool,
          titleVariant: 'h4',
          condition: (_, externalData) => {
            return isCurrentSchoolRegistered(externalData)
          },
        }),
        buildTextField({
          id: 'currentSchool.name',
          title: coreMessages.name,
          width: 'half',
          disabled: true,
          condition: (_, externalData) => {
            return isCurrentSchoolRegistered(externalData)
          },
          defaultValue: (application: Application) =>
            getCurrentSchoolName(application.externalData),
        }),
        buildCustomField(
          {
            id: 'currentSchool.grade',
            title: primarySchoolMessages.currentSchool.grade,
            width: 'half',
            component: 'DynamicDisabledText',
            condition: (_, externalData) => {
              return isCurrentSchoolRegistered(externalData)
            },
          },
          {
            value: (application: Application, lang: Locale) => {
              const { childGradeLevel } = getApplicationExternalData(
                application.externalData,
              )
              return {
                ...primarySchoolMessages.currentSchool.currentGrade,
                values: {
                  grade: formatGrade(childGradeLevel ?? '', lang),
                },
              }
            },
          },
        ),
        buildAsyncSelectField({
          id: 'currentSchool.municipality',
          title: sharedMessages.municipality,
          placeholder: sharedMessages.municipalityPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          isClearable: true,
          isSearchable: true,
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
          condition: (_, externalData) => {
            const { primaryOrgId } = getApplicationExternalData(externalData)
            return !primaryOrgId
          },
        }),
        buildAsyncSelectField({
          id: 'currentSchool.school',
          title: sharedMessages.school,
          placeholder: sharedMessages.schoolPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          updateOnSelect: ['currentSchool.municipality'],
          loadOptions: async ({ apolloClient, selectedValues }) => {
            const municipalityCode = selectedValues?.[0]

            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
              variables: {
                input: {
                  type: OrganizationTypeEnum.School,
                  municipalityCode: municipalityCode,
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
          condition: (_, externalData) => {
            const { primaryOrgId } = getApplicationExternalData(externalData)
            return !primaryOrgId
          },
        }),
      ],
    }),
  ],
})
