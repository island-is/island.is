import {
  buildAlertMessageField,
  buildAsyncSelectField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  coreErrorMessages,
  NO,
  YES,
} from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../../graphql/queries'
import { ApplicationType } from '../../../utils/constants'
import { primarySchoolMessages, sharedMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'
import { Query, OrganizationTypeEnum } from '@island.is/api/schema'

export const currentNurserySubSection = buildSubSection({
  id: 'currentNurserySubSection',
  title: primarySchoolMessages.currentNursery.subSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Enrollment in primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'currentNursery',
      title: primarySchoolMessages.currentNursery.subSectionTitle,
      description: primarySchoolMessages.currentNursery.description,
      children: [
        buildRadioField({
          id: 'currentNursery.hasCurrentNursery',
          title: primarySchoolMessages.currentNursery.hasCurrentNursery,
          width: 'half',
          required: true,
          space: 0,
          options: [
            {
              label: sharedMessages.yes,
              value: YES,
            },
            {
              label: sharedMessages.no,
              value: NO,
            },
          ],
        }),
        buildAsyncSelectField({
          id: 'currentNursery.municipality',
          title: sharedMessages.municipality,
          placeholder: sharedMessages.municipalityPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'current-nursery-municipality',
          marginTop: 2,
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
                ?.map(({ unitId, name }) => ({
                  value: unitId || '',
                  label: name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) ?? []
            )
          },
          condition: (answers) => {
            const { hasCurrentNursery } = getApplicationAnswers(answers)

            return hasCurrentNursery === YES
          },
        }),
        buildAsyncSelectField({
          id: 'currentNursery.nursery',
          title: primarySchoolMessages.currentNursery.nursery,
          placeholder: primarySchoolMessages.currentNursery.nurseryPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'current-nursery-nursery',
          updateOnSelect: ['currentNursery.municipality'],
          loadOptions: async ({ apolloClient, selectedValues }) => {
            const municipalityCode = selectedValues?.[0]

            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
              variables: {
                input: {
                  type: OrganizationTypeEnum.ChildCare,
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
          condition: (answers) => {
            const { currentNurseryMunicipality, hasCurrentNursery } =
              getApplicationAnswers(answers)

            return !!currentNurseryMunicipality && hasCurrentNursery === YES
          },
        }),
        buildAlertMessageField({
          id: 'currentNursery.nurseryAlertMessage',
          title: sharedMessages.alertTitle,
          message: primarySchoolMessages.currentNursery.alertMessage,
          doesNotRequireAnswer: true,
          alertType: 'warning',
          marginTop: 4,
          condition: (answers) => {
            const { currentNursery, hasCurrentNursery } =
              getApplicationAnswers(answers)

            return !!currentNursery && hasCurrentNursery === YES
          },
        }),
      ],
    }),
  ],
})
