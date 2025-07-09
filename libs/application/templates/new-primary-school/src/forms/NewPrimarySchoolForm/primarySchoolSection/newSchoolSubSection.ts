import {
  buildAsyncSelectField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
  NO,
} from '@island.is/application/core'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { ApplicationType, SchoolType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getMunicipalityCodeBySchoolUnitId,
} from '../../../lib/newPrimarySchoolUtils'
import {
  Application,
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
          defaultValue: (application: Application) => {
            const { applicantMunicipalityCode } = getApplicationExternalData(
              application.externalData,
            )

            return applicantMunicipalityCode
          },
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
                  ({ type, managing }) =>
                    type === OrganizationModelTypeEnum.Municipality &&
                    managing &&
                    managing.length > 0 &&
                    managing.filter(({ gradeLevels }) =>
                      gradeLevels?.includes(childGradeLevel),
                    )?.length > 0,
                )
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
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            const municipalityCode = selectedValues?.[0]

            // Since the data from Frigg is not structured for international schools, we need to manually identify them
            const internationalSchoolsIds = [
              'G-2250-A',
              'G-2250-B',
              'G-1157-A',
              'G-1157-B',
            ] //Alþjóðaskólinn G-2250-x & Landkotsskóli G-1157-x

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
                  ({ managing }) =>
                    managing
                      ?.filter(
                        ({ type, gradeLevels, unitId }) =>
                          gradeLevels?.includes(childGradeLevel) &&
                          unitId &&
                          getMunicipalityCodeBySchoolUnitId(unitId) ===
                            municipalityCode &&
                          type === OrganizationModelTypeEnum.School,
                      )
                      ?.map((school) => ({
                        ...school,
                        type: internationalSchoolsIds.some(
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
                  ({ type, gradeLevels }) =>
                    type === OrganizationModelTypeEnum.School &&
                    gradeLevels?.includes(childGradeLevel),
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
        }),
        buildHiddenInputWithWatchedValue({
          id: 'newSchool.type',
          watchValue: 'newSchool.school',
          valueModifier: (value) => value?.toString()?.split('::')[1],
        }),
      ],
    }),
  ],
})
