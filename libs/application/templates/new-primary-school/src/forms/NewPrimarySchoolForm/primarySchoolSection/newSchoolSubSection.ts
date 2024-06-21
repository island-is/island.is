import {
  buildAsyncSelectField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { ReasonForApplicationOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

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
          // TODO: get data from Juni
          loadOptions: async ({ apolloClient }) => {
            return [{ value: 'Reykjavík', label: 'Reykjavík' }]
            /*const { municipalities } = getApplicationExternalData(
              application.externalData,
            )

            return municipalities.map(
              (municipality: NationalRegistryMunicipality) => ({
                value: municipality?.code || '',
                label: municipality.name || '',
              }),
            )*/
          },

          placeholder: newPrimarySchoolMessages.shared.municipalityPlaceholder,
          dataTestId: 'new-school-municipality',
        }),

        buildAsyncSelectField({
          id: 'schools.newSchool.school',
          title: newPrimarySchoolMessages.shared.school,
          condition: (answers) => {
            const { schoolMunicipality } = getApplicationAnswers(answers)
            return !!schoolMunicipality
          },
          // TODO: get data from Juni
          loadOptions: async ({ apolloClient }) => {
            return [
              {
                value: 'Ártúnsskóli',
                label: 'Ártúnsskóli',
              },
              {
                value: 'Árbæjarskóli',
                label: 'Árbæjarskóli',
              },
            ]
          },
          placeholder: newPrimarySchoolMessages.shared.schoolPlaceholder,
          dataTestId: 'new-school-school',
        }),
      ],
    }),
  ],
})
