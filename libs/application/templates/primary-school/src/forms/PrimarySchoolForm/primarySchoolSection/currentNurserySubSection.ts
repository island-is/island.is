import {
  buildAsyncSelectField,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
} from '@island.is/application/core'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { ApplicationType } from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/primarySchoolUtils'
import { FriggSchoolsByMunicipalityQuery } from '../../../types/schema'

export const currentNurserySubSection = buildSubSection({
  id: 'currentNurserySubSection',
  title: primarySchoolMessages.primarySchool.currentNurserySubSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Enrollment in primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'currentNursery',
      title: primarySchoolMessages.primarySchool.currentNurserySubSectionTitle,
      children: [
        buildAsyncSelectField({
          id: 'currentNursery.municipality',
          title: primarySchoolMessages.shared.municipality,
          placeholder: primarySchoolMessages.shared.municipalityPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'current-nursery-municipality',
          loadOptions: async ({ apolloClient }) => {
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            return (
              data?.friggSchoolsByMunicipality?.map(({ name }) => ({
                value: name,
                label: name,
              })) ?? []
            )
          },
        }),
        buildAsyncSelectField({
          id: 'currentNursery.nursery',
          title: primarySchoolMessages.primarySchool.nursery,
          placeholder: primarySchoolMessages.primarySchool.nurseryPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'current-nursery-nursery',
          updateOnSelect: 'currentNursery.municipality',
          loadOptions: async ({ apolloClient, selectedValue }) => {
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            return (
              data?.friggSchoolsByMunicipality
                ?.find(({ name }) => name === selectedValue)
                ?.children?.map((nursery) => ({
                  value: nursery.id,
                  label: nursery.name,
                })) ?? []
            )
          },
          condition: (answers) => {
            const { currentNurseryMunicipality } =
              getApplicationAnswers(answers)

            return !!currentNurseryMunicipality
          },
        }),
      ],
    }),
  ],
})
