import {
  buildAsyncSelectField,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
} from '@island.is/application/core'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { ApplicationType } from '../../../utils/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'
import {
  FriggSchoolsByMunicipalityQuery,
  OrganizationModelTypeEnum,
} from '../../../types/schema'

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
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            const options =
              data?.friggSchoolsByMunicipality
                ?.filter(
                  ({ type, managing, unitId }) =>
                    type === OrganizationModelTypeEnum.Municipality &&
                    Boolean(unitId) &&
                    Array.isArray(managing) &&
                    managing.length > 0,
                )
                ?.map(({ name, unitId }) => ({
                  value: unitId as string,
                  label: name,
                })) ?? []

            return options.sort((a, b) => a.label.localeCompare(b.label))
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
            const { data } =
              await apolloClient.query<FriggSchoolsByMunicipalityQuery>({
                query: friggSchoolsByMunicipalityQuery,
              })

            const selectedMunicipalityUnitId = selectedValues?.[0]

            const nurseries =
              data?.friggSchoolsByMunicipality
                ?.find(({ unitId }) => unitId === selectedMunicipalityUnitId)
                ?.managing?.filter(
                  ({ type }) => type === OrganizationModelTypeEnum.ChildCare,
                )
                ?.map(({ id, name }) => ({
                  value: id,
                  label: name,
                })) ?? []

            return nurseries.sort((a, b) => a.label.localeCompare(b.label))
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
