import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { removeCountryCode } from '@island.is/application/ui-components'
import { format as formatKennitala } from 'kennitala'
import { Passport, PersonalInfo, YES } from '../../lib/constants'
import { m } from '../../lib/messages'

export const personalInfo = buildMultiField({
  id: 'personalInfo',
  title: m.infoTitle,
  description: m.personalInfoSubtitle,
  condition: (answers) => (answers.passport as Passport)?.userPassport !== '',
  children: [
    buildTextField({
      id: 'personalInfo.name',
      title: m.name,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: (application: Application) =>
        (
          application.externalData.nationalRegistry?.data as {
            fullName?: string
          }
        )?.fullName ?? '',
    }),
    buildTextField({
      id: 'personalInfo.nationalId',
      title: m.nationalId,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: (application: Application) => {
        const nationalId =
          (
            application.externalData.nationalRegistry?.data as {
              nationalId?: string
            }
          )?.nationalId ?? ''

        return formatKennitala(nationalId)
      },
    }),
    buildTextField({
      id: 'personalInfo.email',
      title: m.email,
      width: 'half',
      required: true,
      defaultValue: (application: Application) =>
        (
          application.externalData.userProfile?.data as {
            email?: string
          }
        )?.email ?? '',
    }),
    buildTextField({
      id: 'personalInfo.phoneNumber',
      title: m.phoneNumber,
      width: 'half',
      variant: 'tel',
      format: '###-####',
      required: true,
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
    buildDescriptionField({
      id: 'personalInfo.space',
      title: '',
      space: 'containerGutter',
    }),
    buildCheckboxField({
      id: 'personalInfo.disabilityCheckbox',
      title: '',
      large: false,
      backgroundColor: 'white',
      defaultValue: [],
      options: [
        {
          value: YES,
          label: m.hasDisabilityDiscount,
        },
      ],
    }),
    buildCustomField({
      id: 'personalInfo.disabilityAlertMessage',
      title: '',
      component: 'HasDisabilityLicenseMessage',
      doesNotRequireAnswer: true,
      condition: (answers) => {
        return (
          (answers.personalInfo as PersonalInfo)?.disabilityCheckbox[0] === YES
        )
      },
    }),
  ],
})
