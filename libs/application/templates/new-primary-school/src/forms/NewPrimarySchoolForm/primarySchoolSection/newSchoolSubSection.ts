import {
  buildAsyncSelectField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
  NO,
} from '@island.is/application/core'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { ApplicationType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  setOnChangeSchool,
} from '../../../lib/newPrimarySchoolUtils'
import {
  FriggSchoolsByMunicipalityQuery,
  OrganizationModelTypeEnum,
} from '../../../types/schema'

export const newSchoolSubSection = buildSubSection({
  id: 'newSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
  condition: (answers) => {
    const { applyForNeighbourhoodSchool, applicationType } =
      getApplicationAnswers(answers)
    return (
      applicationType === ApplicationType.NEW_PRIMARY_SCHOOL ||
      (applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
        applyForNeighbourhoodSchool === NO)
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
          loadOptions: async ({ application, apolloClient }) => {
            const { childGradeLevel } = getApplicationExternalData(
              application.externalData,
            )

            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            return (
              data?.friggSchoolsByMunicipality
                ?.filter(
                  ({ type, children }) =>
                    type === OrganizationModelTypeEnum.Municipality &&
                    children &&
                    children.length > 0 &&
                    children.filter(({ gradeLevels }) =>
                      gradeLevels?.includes(childGradeLevel),
                    )?.length > 0,
                )
                ?.map(({ name }) => ({
                  value: name,
                  label: name,
                }))
                .sort((a, b) => a.value.localeCompare(b.value)) ?? []
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
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            const municipality = selectedValues?.[0]

            const { childGradeLevel } = getApplicationExternalData(
              application.externalData,
            )

            // Find all private owned schools by municipality
            const privateOwnedSchools =
              data?.friggSchoolsByMunicipality
                ?.filter(
                  ({ type }) => type === OrganizationModelTypeEnum.PrivateOwner,
                )
                ?.flatMap(
                  ({ children }) =>
                    children
                      ?.filter(
                        ({ address, type, gradeLevels }) =>
                          gradeLevels?.includes(childGradeLevel) &&
                          address?.municipality === municipality &&
                          type === OrganizationModelTypeEnum.School,
                      )
                      ?.map((school) => ({
                        ...school,
                        type: OrganizationModelTypeEnum.PrivateOwner,
                      })) || [],
                ) || []

            // Find all municipality schools
            const municipalitySchools =
              data?.friggSchoolsByMunicipality
                ?.find(({ name }) => name === municipality)
                ?.children?.filter(
                  ({ type, gradeLevels }) =>
                    type === OrganizationModelTypeEnum.School &&
                    gradeLevels?.includes(childGradeLevel),
                ) || []

            // Merge the private owned schools and the municipality schools together
            const allMunicipalitySchools = [
              ...municipalitySchools,
              ...privateOwnedSchools,
            ]

            // Piggyback the type as part of the value
            return (
              allMunicipalitySchools
                .map(({ id, type, name }) => ({
                  value: `${id}::${type}`,
                  label: name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) ?? []
            )
          },
          condition: (answers) => {
            const { schoolMunicipality } = getApplicationAnswers(answers)

            return !!schoolMunicipality
          },
          setOnChange: (option) => setOnChangeSchool(option),
        }),
        buildHiddenInput({
          id: 'newSchool.type',
        }),
      ],
    }),
  ],
})
