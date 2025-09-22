import {
  buildAsyncSelectField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
  NO,
} from '@island.is/application/core'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { ApplicationType, SchoolType } from '../../../utils/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getInternationalSchoolsIds,
  getMunicipalityCodeBySchoolUnitId,
} from '../../../utils/newPrimarySchoolUtils'
import {
  Application,
  OrganizationModelTypeEnum,
  Query,
} from '@island.is/api/schema'

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

            const { data } = await apolloClient.query<Query>({
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
                      !childGradeLevel
                        ? true
                        : gradeLevels?.includes(childGradeLevel),
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
            const { data } = await apolloClient.query<Query>({
              query: friggSchoolsByMunicipalityQuery,
            })

            const municipalityCode = selectedValues?.[0]

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
                          unitId &&
                          getMunicipalityCodeBySchoolUnitId(unitId) ===
                            municipalityCode &&
                          type === OrganizationModelTypeEnum.School &&
                          (!childGradeLevel
                            ? true
                            : gradeLevels?.includes(childGradeLevel)),
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
                  ({ type, gradeLevels }) =>
                    // if no childGradeLevel then skip grade level check. This is the case if student is not registered in Frigg
                    type === OrganizationModelTypeEnum.School &&
                    (!childGradeLevel
                      ? true
                      : gradeLevels?.includes(childGradeLevel)),
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
