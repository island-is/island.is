import {
  buildMultiField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'

import { personal as personalMessages } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { isCompanyType } from '../../../utils'

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
            const nationalIdPath = isCompanyType(application.externalData)
              ? 'identity.data.actor.nationalId'
              : 'identity.data.nationalId'
            const nationalId = getValueViaPath<string>(
              application.externalData,
              nationalIdPath,
              undefined,
            )

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
            const namePath = isCompanyType(application.externalData)
              ? 'identity.data.actor.name'
              : 'identity.data.name'
            const name = getValueViaPath<string>(
              application.externalData,
              namePath,
              undefined,
            )

            return name
          },
        }),
      ],
    }),
  ],
})
