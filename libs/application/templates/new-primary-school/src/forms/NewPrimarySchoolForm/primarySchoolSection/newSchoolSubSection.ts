import {
  buildAsyncSelectField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
} from '@island.is/application/core'
import { ReasonForApplicationOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getMunicipalityOptions,
  getSchoolsByMunicipalityOptions,
} from '../../../lib/newPrimarySchoolUtils'

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
            return getMunicipalityOptions(apolloClient)
          },
        }),
        buildAsyncSelectField({
          id: 'schools.newSchool.school',
          title: newPrimarySchoolMessages.shared.school,
          placeholder: newPrimarySchoolMessages.shared.schoolPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'new-school-school',
          loadOptions: async ({ application, apolloClient }) => {
            return getSchoolsByMunicipalityOptions(apolloClient, application)
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
