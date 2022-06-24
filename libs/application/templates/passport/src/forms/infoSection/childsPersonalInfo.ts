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
import { YES } from '../../lib/constants'

export const childsPersonalInfo = buildMultiField({
  id: 'childsPersonalInfo',
  title: m.infoTitle,
  description: m.personalInfoSubtitle,
  condition: (answers) => (answers.passport as any)?.childPassport !== '',
  children: [
    buildTextField({
      id: 'childsPersonalInfo.name',
      title: m.name,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: 'Þitt Barn',
    }),
    buildTextField({
      id: 'childsPersonalInfo.nationalId',
      title: m.nationalId,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: '111111-1111',
    }),
    buildCheckboxField({
      id: 'childsPersonalInfo.hasDisabilityDiscount',
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
    buildDescriptionField({
      id: 'childsPersonalInfo.guardian1',
      title: 'Forráðamaður 1',
      titleVariant: 'h3',
      space: 'gutter',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian1.name',
      title: m.name,
      backgroundColor: 'blue',
      width: 'half',
      defaultValue: (application: Application) =>
        (application.externalData.nationalRegistry?.data as {
          fullName?: string
        })?.fullName,
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian1.email',
      title: m.email,
      width: 'half',
      defaultValue: (application: Application) =>
        (application.externalData.userProfile?.data as {
          email?: string
        })?.email,
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian1.phoneNumber',
      title: m.phoneNumber,
      width: 'half',
      variant: 'tel',
      format: '###-####',
      defaultValue: (application: Application) =>
        (application.externalData.userProfile?.data as {
          mobilePhoneNumber?: string
        })?.mobilePhoneNumber,
    }),
    buildDescriptionField({
      id: 'childsPersonalInfo.guardian2',
      title: 'Forráðamaður 2',
      titleVariant: 'h3',
      space: 'gutter',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.name',
      title: m.name,
      backgroundColor: 'blue',
      width: 'half',
      defaultValue: '',
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
