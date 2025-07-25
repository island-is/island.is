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
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { ApplicationType, SchoolType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  formatGrade,
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentSchoolName,
  getInternationalSchoolsIds,
  getMunicipalityCodeBySchoolUnitId,
} from '../../../lib/newPrimarySchoolUtils'
import {
  FriggSchoolsByMunicipalityQuery,
  OrganizationModelTypeEnum,
} from '../../../types/schema'
import { isCurrentSchoolRegistered } from '../../../utils/conditionUtils'

export const currentSchoolSubSection = buildSubSection({
  id: 'currentSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.currentSchoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Application for a new primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'currentSchool',
      title:
        newPrimarySchoolMessages.primarySchool.currentSchoolSubSectionTitle,
      children: [
        buildDescriptionField({
          id: 'currentSchool.description',
          title: newPrimarySchoolMessages.primarySchool.currentSchool,
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
            getCurrentSchoolName(application),
        }),
        buildCustomField(
          {
            id: 'currentSchool.grade',
            title: newPrimarySchoolMessages.primarySchool.grade,
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
                ...newPrimarySchoolMessages.primarySchool.currentGrade,
                values: {
                  grade: formatGrade(childGradeLevel, lang),
                },
              }
            },
          },
        ),
        buildAsyncSelectField({
          id: 'currentSchool.municipality',
          title: newPrimarySchoolMessages.shared.municipality,
          placeholder: newPrimarySchoolMessages.shared.municipalityPlaceholder,
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
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            return (
              data?.friggSchoolsByMunicipality
                ?.filter(
                  ({ type, managing }) =>
                    type === OrganizationModelTypeEnum.Municipality &&
                    managing &&
                    managing.length > 0,
                )
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
          title: newPrimarySchoolMessages.shared.school,
          placeholder: newPrimarySchoolMessages.shared.schoolPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          updateOnSelect: ['currentSchool.municipality'],
          loadOptions: async ({ apolloClient, selectedValues }) => {
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            const municipalityCode = selectedValues?.[0]

            // Find all private owned schools by municipality
            const privateOwnedSchools =
              data?.friggSchoolsByMunicipality
                ?.filter(
                  ({ type }) => type === OrganizationModelTypeEnum.PrivateOwner,
                )
                ?.flatMap(
                  ({ managing }) =>
                    managing
                      ?.filter(
                        ({ type, unitId }) =>
                          unitId &&
                          getMunicipalityCodeBySchoolUnitId(unitId) ===
                            municipalityCode &&
                          type === OrganizationModelTypeEnum.School,
                      )
                      ?.map((school) => ({
                        ...school,
                        type: getInternationalSchoolsIds().some(
                          (id) => id === school.unitId, // Hack to identify international schools from private ownded schools
                        )
                          ? SchoolType.INTERNATIONAL_SCHOOL
                          : SchoolType.PRIVATE_SCHOOL,
                      })) || [],
                ) || []

            // Find all municipality schools
            const municipalitySchools =
              data?.friggSchoolsByMunicipality
                ?.find(({ unitId }) => unitId === municipalityCode)
                ?.managing?.filter(
                  ({ type }) => type === OrganizationModelTypeEnum.School,
                )
                ?.map((school) => ({
                  ...school,
                  type: SchoolType.PUBLIC_SCHOOL,
                })) || []

            // Merge the private owned schools and the municipality schools together
            const allMunicipalitySchools = [
              ...municipalitySchools,
              ...privateOwnedSchools,
            ]

            return (
              allMunicipalitySchools
                .map(({ id, name }) => ({
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
