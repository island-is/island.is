import {
  buildMultiField,
  buildSelectField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { UserProfile, Application } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import { removeCountryCode } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { HEIR, LIQUIDATOR, POWER_OF_ATTORNEY } from '../../lib/constants'

export const applicant = buildSection({
  id: 'applicantsInformation',
  title: m.applicantsInfo,
  children: [
    buildMultiField({
      id: 'applicant',
      title: m.applicantsInfo,
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
        buildTextField({
          id: 'applicant.phone',
          title: m.phone,
          width: 'half',
          format: '###-####',
          defaultValue: (application: Application) => {
            const phone =
              (
                application.externalData.userProfile?.data as {
                  mobilePhoneNumber?: string
                }
              )?.mobilePhoneNumber ?? ''

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
        buildSelectField({
          id: 'applicant.relation',
          title: m.applicantsRelation,
          placeholder: m.applicantsRelationPlaceholder,
          width: 'half',
          options: [
            {
              value: HEIR,
              label: m.applicantsRelationHeir,
            },
            {
              value: POWER_OF_ATTORNEY,
              label: m.applicantsRelationPowerOfAttorney,
            },
            {
              value: LIQUIDATOR,
              label: m.applicantsRelationLiquidator,
            },
          ],
        }),
      ],
    }),
  ],
})
