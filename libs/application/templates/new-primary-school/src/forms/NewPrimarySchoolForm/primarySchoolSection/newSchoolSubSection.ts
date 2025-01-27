import {
  buildAsyncSelectField,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
  NO,
} from '@island.is/application/core'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../lib/newPrimarySchoolUtils'
import { FriggSchoolsByMunicipalityQuery } from '../../../types/schema'

export const newSchoolSubSection = buildSubSection({
  id: 'newSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if not seleting neighbourhood school
    const { applyForNeighbourhoodSchool } = getApplicationAnswers(answers)
    return applyForNeighbourhoodSchool === NO
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
          dataTestId: 'new-school-municipality',
          loadOptions: async ({ apolloClient }) => {
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            return (
              data?.friggSchoolsByMunicipality?.map((municipality) => ({
                value: municipality.name,
                label: municipality.name,
              })) ?? []
            )
          },
        }),
        buildAsyncSelectField({
          id: 'newSchool.school',
          title: newPrimarySchoolMessages.shared.school,
          placeholder: newPrimarySchoolMessages.shared.schoolPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'new-school-school',
          updateOnSelect: ['newSchool.municipality'],
          loadOptions: async ({ application, apolloClient, selectedValue }) => {
            const { schoolMunicipality } = getApplicationAnswers(
              application.answers,
            )
            const { childGradeLevel } = getApplicationExternalData(
              application.externalData,
            )

            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            return (
              data?.friggSchoolsByMunicipality
                ?.find(
                  ({ name }) => name === (selectedValue || schoolMunicipality),
                )
                ?.children?.filter((school) =>
                  school.gradeLevels?.includes(childGradeLevel),
                )
                ?.map((school) => ({
                  value: school.id,
                  label: school.name,
                })) ?? []
            )
          },
          condition: (answers) => {
            const { schoolMunicipality } = getApplicationAnswers(answers)

            return !!schoolMunicipality
          },
        }),
      ],
    }),
  ],
})
