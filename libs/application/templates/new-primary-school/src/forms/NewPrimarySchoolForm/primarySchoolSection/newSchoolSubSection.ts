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
  getAllSchoolsByMunicipality,
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

            return getAllSchoolsByMunicipality(
              application,
              selectedValues?.[0],
              data,
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
