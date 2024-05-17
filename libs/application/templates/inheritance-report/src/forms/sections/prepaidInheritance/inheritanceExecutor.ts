import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import {
  Application,
  NationalRegistrySpouse,
  UserProfile,
} from '@island.is/api/schema'
import { removeCountryCode } from '@island.is/application/ui-components'
import {
  getSpouseFromExternalData,
  isApplicantMarried,
} from '../../../lib/utils/helpers'
import { applicant } from '../applicant'
import { application } from 'express'

export const inheritanceExecutor = buildSection({
  id: 'inheritanceExecutor',
  title: 'Arflátar',
  children: [
    buildMultiField({
      id: 'inheritanceExecutor',
      title: 'Arflátar',
      description:
        'Lorem ipsum foo bar beep boop meep morp lorem ipsum foo bar beep boop meep morp lorem ipsum foo bar beep boop meep morp.',
      children: [
        buildDescriptionField({
          id: 'executor1',
          title: 'Arfláti 1',
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'executorName',
          title: m.name,
          defaultValue: ({ externalData }: Application) =>
            (externalData.nationalRegistry?.data as any)?.fullName ?? '',
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'executorNationalId',
          title: m.nationalId,
          defaultValue: ({ externalData }: Application) =>
            formatNationalId(
              (externalData.nationalRegistry?.data as any)?.nationalId,
            ),
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'executorPhone',
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
          id: 'executorEmail',
          title: m.email,
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            const data = externalData.userProfile?.data as UserProfile
            return data?.email
          },
        }),
        //Todo: ef hjúskaparstaða er married
        buildDescriptionField({
          id: 'executor2',
          title: 'Arfláti 2',
          titleVariant: 'h3',
          space: 'containerGutter',
          condition: (_, externalData) => isApplicantMarried(externalData),
        }),
        buildTextField({
          id: 'executorSpouseName',
          title: m.name,
          defaultValue: ({ externalData }: Application) =>
            getSpouseFromExternalData(externalData)?.fullName,
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => isApplicantMarried(externalData),
        }),
        buildTextField({
          id: 'executorSpouseNationalId',
          title: m.nationalId,
          defaultValue: ({ externalData }: Application) =>
            formatNationalId(
              getSpouseFromExternalData(externalData)?.nationalId ?? '',
            ),
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => isApplicantMarried(externalData),
        }),
        buildTextField({
          id: 'executorSpouseEmail',
          title: m.email,
          width: 'half',
          variant: 'email',
          condition: (_, externalData) => isApplicantMarried(externalData),
        }),
        buildPhoneField({
          id: 'executorSpousePhone',
          title: m.phone,
          width: 'half',
          condition: (_, externalData) => isApplicantMarried(externalData),
        }),
      ],
    }),
  ],
})
