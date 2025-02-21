import {
  buildAsyncSelectField,
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../../lib/messages'
import { ABOUTIDS } from '../../../utils/constants'
import { Identity } from '@island.is/api/schema'
import { getAuditConfig } from '../../../graphql'
import { AuditConfig } from '../../../types/types'
import { getYearOptions } from '../../../utils/helpers'

export const clientInfoSection = buildSection({
  id: 'info',
  title: m.info,
  children: [
    buildMultiField({
      id: 'about',
      title: m.info,
      description: m.reviewContact,
      children: [
        buildAsyncSelectField({
          id: ABOUTIDS.operatingYear,
          title: m.operatingYear,
          placeholder: m.selectOperatingYear,
          width: 'half',
          loadOptions: async ({ apolloClient }) => {
            const { data } = await apolloClient.query<AuditConfig>({
              query: getAuditConfig,
            })
            return getYearOptions(data)
          },
        }),
        buildDescriptionField({
          id: 'about.description',
        }),
        buildTextField({
          id: 'about.nationalId',
          title: m.clientNationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => application.applicant,
        }),
        buildTextField({
          id: 'about.fullName',
          title: m.clientName,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const nationalRegistry = application.externalData.identity
              .data as Identity
            return nationalRegistry.name
          },
        }),
        buildTextField({
          id: ABOUTIDS.powerOfAttorneyNationalId,
          title: m.powerOfAttorneyNationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'identity.data.actor.nationalId',
            ),
        }),
        buildTextField({
          id: ABOUTIDS.powerOfAttorneyName,
          title: m.powerOfAttorneyName,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'identity.data.actor.name',
            ),
        }),
        buildTextField({
          id: 'about.email',
          title: m.email,
          width: 'half',
          variant: 'email',
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.email',
            ),
        }),
        buildPhoneField({
          id: 'about.phoneNumber',
          title: m.phoneNumber,
          width: 'half',
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ),
        }),
      ],
    }),
  ],
})
