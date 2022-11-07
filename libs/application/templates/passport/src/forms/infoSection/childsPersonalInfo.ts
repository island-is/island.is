import {
  buildDescriptionField,
  buildMultiField,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { removeCountryCode } from '@island.is/application/ui-components'
import { format as formatKennitala } from 'kennitala'
import { Passport } from '../../lib/constants'
import { m } from '../../lib/messages'

export const childsPersonalInfo = buildMultiField({
  id: 'childsPersonalInfo',
  title: m.infoTitle,
  description: m.personalInfoSubtitle,
  condition: (answers) => (answers.passport as Passport)?.childPassport !== '',
  children: [
    buildTextField({
      id: 'childsPersonalInfo.name',
      title: m.name,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: 'Adam Jónsson',
    }),
    buildTextField({
      id: 'childsPersonalInfo.nationalId',
      title: m.nationalId,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: '111111-1111',
    }),
    buildDescriptionField({
      id: 'childsPersonalInfo.guardian1',
      title: 'Forráðamaður 1',
      titleVariant: 'h3',
      space: 'containerGutter',
      marginBottom: 'smallGutter',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian1.name',
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
      id: 'childsPersonalInfo.guardian1.nationalId',
      title: m.nationalId,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: (application: Application) =>
        formatKennitala(
          (application.externalData.nationalRegistry?.data as {
            nationalId?: string
          })?.nationalId ?? '',
        ),
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian1.email',
      title: m.email,
      width: 'half',
      defaultValue: (application: Application) =>
        (application.externalData.userProfile?.data as {
          email?: string
        })?.email ?? '',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian1.phoneNumber',
      title: m.phoneNumber,
      width: 'half',
      variant: 'tel',
      format: '###-####',
      defaultValue: (application: Application) => {
        const phone =
          (application.externalData.userProfile?.data as {
            mobilePhoneNumber?: string
          })?.mobilePhoneNumber ?? ''

        return removeCountryCode(phone)
      },
    }),
    buildDescriptionField({
      id: 'childsPersonalInfo.guardian2',
      title: 'Forráðamaður 2',
      titleVariant: 'h3',
      space: 'containerGutter',
      marginBottom: 'smallGutter',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.name',
      title: m.name,
      backgroundColor: 'white',
      width: 'half',
      defaultValue: 'Gervimaður Útlönd',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.nationalId',
      title: m.nationalId,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: '010130-7789',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.email',
      title: m.email,
      width: 'half',
      defaultValue: '',
      backgroundColor: 'blue',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.phoneNumber',
      title: m.phoneNumber,
      width: 'half',
      variant: 'tel',
      format: '###-####',
      backgroundColor: 'blue',
      defaultValue: '',
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
