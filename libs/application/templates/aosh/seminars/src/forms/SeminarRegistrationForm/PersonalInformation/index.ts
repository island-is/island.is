import {
  buildMultiField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'

import { personal as personalMessages } from '../../../lib/messages'
import { Application } from '@island.is/application/types'

export const personalInformationSection = buildSection({
  id: 'personalInformation',
  title: personalMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'personalInformationMultiField',
      title: personalMessages.general.pageTitle,
      description: personalMessages.general.pageDescription,
      children: [
        buildTextField({
          id: 'applicant.nationalId',
          title: personalMessages.labels.userNationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => {
            const nationalId = getValueViaPath(
              application.externalData,
              'identity.data.nationalId',
              undefined,
            ) as string | undefined

            return nationalId
          },
        }),
        buildTextField({
          id: 'applicant.name',
          title: personalMessages.labels.userName,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const name = getValueViaPath(
              application.externalData,
              'identity.data.name',
              undefined,
            ) as string | undefined

            return name
          },
        }),
      ],
    }),
  ],
})
