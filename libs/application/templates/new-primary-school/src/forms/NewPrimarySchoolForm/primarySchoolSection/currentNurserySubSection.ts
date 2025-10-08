import {
  buildAsyncSelectField,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
} from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../../graphql/queries'
import { ApplicationType } from '../../../utils/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'
import { Query } from '@island.is/api/schema'

export const currentNurserySubSection = buildSubSection({
  id: 'currentNurserySubSection',
  title: newPrimarySchoolMessages.primarySchool.currentNurserySubSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Enrollment in primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'currentNursery',
      title:
        newPrimarySchoolMessages.primarySchool.currentNurserySubSectionTitle,
      children: [
        buildAsyncSelectField({
          id: 'currentNursery.municipality',
          title: newPrimarySchoolMessages.shared.municipality,
          placeholder: newPrimarySchoolMessages.shared.municipalityPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'current-nursery-municipality',
          loadOptions: async ({ apolloClient }) => {
            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
            })

            return (
              data?.friggOrganizationsByType?.map(({ name }) => ({
                value: name,
                label: name,
              })) ?? []
            )
          },
        }),
        buildAsyncSelectField({
          id: 'currentNursery.nursery',
          title: newPrimarySchoolMessages.primarySchool.nursery,
          placeholder:
            newPrimarySchoolMessages.primarySchool.nurseryPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'current-nursery-nursery',
          updateOnSelect: ['currentNursery.municipality'],
          loadOptions: async ({ apolloClient, selectedValues }) => {
            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
            })

            return (
              data?.friggOrganizationsByType
                ?.find(({ name }) => name === selectedValues?.[0])
                ?.managing?.map((nursery) => ({
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
