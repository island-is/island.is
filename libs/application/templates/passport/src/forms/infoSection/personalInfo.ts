import {
  Application,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSubmitField,
  buildTextField,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { format as formatKennitala } from 'kennitala'
import { YES, Passport } from '../../lib/constants'

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
        (application.externalData.nationalRegistry?.data as {
          fullName?: string
        })?.fullName ?? '',
    }),
    buildTextField({
      id: 'personalInfo.nationalId',
      title: m.nationalId,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: (application: Application) => {
        const nationalId =
          (application.externalData.nationalRegistry?.data as {
            nationalId?: string
          })?.nationalId ?? ''

        return formatKennitala(nationalId)
      },
    }),
    buildTextField({
      id: 'personalInfo.email',
      title: m.email,
      width: 'half',
      defaultValue: (application: Application) =>
        (application.externalData.userProfile?.data as {
          email?: string
        })?.email ?? '',
    }),
    buildTextField({
      id: 'personalInfo.phoneNumber',
      title: m.phoneNumber,
      width: 'half',
      variant: 'tel',
      format: '###-####',
      defaultValue: (application: Application) =>
        (application.externalData.userProfile?.data as {
          mobilePhoneNumber?: string
        })?.mobilePhoneNumber ?? '',
    }),
    buildDescriptionField({
      id: 'personalInfo.space',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildCheckboxField({
      id: 'personalInfo.hasDisabilityDiscount',
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
    buildSubmitField({
      id: 'approveCheckForDisability',
      placement: 'footer',
      title: '',
      actions: [
        {
          event: DefaultEvents.SUBMIT,
          name: 'Staðfesta',
          type: 'primary',
        },
      ],
    }),
  ],
})
