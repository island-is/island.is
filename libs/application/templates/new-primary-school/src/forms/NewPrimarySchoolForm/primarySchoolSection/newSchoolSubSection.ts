import {
  buildAsyncSelectField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
} from '@island.is/application/core'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { ReasonForApplicationOptions } from '../../../lib/constants'
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
    // Only display section if "Moving abroad" is not selected as reason for application
    const { reasonForApplication } = getApplicationAnswers(answers)
    return reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD
  },
  children: [
    buildMultiField({
      id: 'school',
      title: newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
      children: [
        buildAsyncSelectField({
          id: 'schools.newSchool.municipality',
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
          id: 'schools.newSchool.school',
          title: newPrimarySchoolMessages.shared.school,
          placeholder: newPrimarySchoolMessages.shared.schoolPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'new-school-school',
          loadOptions: async ({ application, apolloClient }) => {
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
                ?.find(({ name }) => name === schoolMunicipality)
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
            const { schoolMunicipality, newSchoolHiddenInput } =
              getApplicationAnswers(answers)

            return (
              !!schoolMunicipality &&
              schoolMunicipality === newSchoolHiddenInput
            )
          },
        }),
        buildHiddenInputWithWatchedValue({
          // Needed to trigger an update on loadOptions in the async select above
          id: 'schools.newSchool.hiddenInput',
          watchValue: 'schools.newSchool.municipality',
        }),
      ],
    }),
  ],
})
