import { UserProfile, Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { removeCountryCode } from '@island.is/application/ui-components'
import { EstateTypes } from '../../lib/constants'

export const announcerInfo = buildSection({
  id: 'information',
  title: (application) =>
    application.answers.selectedEstate === EstateTypes.noPropertyEstate
      ? m.announcerNoProperty
      : application.answers.selectedEstate === EstateTypes.residencePermit
      ? m.announcerRP
      : m.announcer,
  children: [
    buildMultiField({
      id: 'applicant',
      title: (application) =>
        application.answers.selectedEstate === EstateTypes.noPropertyEstate
          ? m.announcerNoProperty
          : application.answers.selectedEstate === EstateTypes.residencePermit
          ? m.announcerResidencePermit
          : m.announcer,
      description: m.applicantsInfoSubtitle,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: m.name,
          readOnly: true,
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            return externalData.nationalRegistry?.data.fullName
          },
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: m.nationalId,
          readOnly: true,
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            return formatNationalId(
              externalData.nationalRegistry?.data.nationalId,
            )
          },
        }),
        buildTextField({
          id: 'applicant.address',
          title: m.address,
          readOnly: true,
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            return externalData.nationalRegistry?.data.address.streetName
          },
        }),
        buildTextField({
          id: 'applicant.phone',
          title: m.phone,
          width: 'half',
          format: '###-####',
          defaultValue: (application: Application) => {
            const phone =
              (application.externalData.userProfile?.data as {
                mobilePhoneNumber?: string
              })?.mobilePhoneNumber ?? ''

            return removeCountryCode(phone)
          },
        }),
        buildTextField({
          id: 'applicant.email',
          title: m.email,
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            const data = externalData.userProfile?.data as UserProfile
            return data?.email
          },
        }),
      ],
    }),
  ],
})
