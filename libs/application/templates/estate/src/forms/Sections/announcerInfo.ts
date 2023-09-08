import { UserProfile, Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { EstateTypes } from '../../lib/constants'

export const announcerInfo = buildSection({
  id: 'information',
  title: (application) =>
    application.answers.selectedEstate === EstateTypes.estateWithoutAssets
      ? m.announcerNoAssets
      : application.answers.selectedEstate ===
        EstateTypes.permitForUndividedEstate
      ? m.announcerPTP
      : m.announcer,
  children: [
    buildMultiField({
      id: 'applicant',
      title: (application) =>
        application.answers.selectedEstate === EstateTypes.estateWithoutAssets
          ? m.announcerNoAssets
          : application.answers.selectedEstate ===
            EstateTypes.permitForUndividedEstate
          ? m.announcerPermitToPostpone
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
            return externalData.nationalRegistry?.data.address.streetAddress
          },
        }),
        buildPhoneField({
          id: 'applicant.phone',
          title: m.phone,
          width: 'half',
          required: true,
          disableDropdown: true,
          allowedCountryCodes: ['IS'],
          defaultValue: (application: Application) => {
            const phone =
              (
                application.externalData.userProfile?.data as {
                  mobilePhoneNumber?: string
                }
              )?.mobilePhoneNumber ?? ''

            return phone
          },
        }),
        buildTextField({
          id: 'applicant.email',
          title: m.email,
          width: 'half',
          required: true,
          defaultValue: ({ externalData }: Application) => {
            const data = externalData.userProfile?.data as UserProfile
            return data?.email
          },
        }),
      ],
    }),
  ],
})
