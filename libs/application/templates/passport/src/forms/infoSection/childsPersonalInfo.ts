import {
  buildDescriptionField,
  buildMultiField,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { removeCountryCode } from '@island.is/application/ui-components'
import { format as formatNationalId } from 'kennitala'
import { Passport } from '../../lib/constants'
import { m } from '../../lib/messages'
import { getChildPassport, hasSecondGuardian } from '../../lib/utils'

export const childsPersonalInfo = buildMultiField({
  id: 'childsPersonalInfo',
  title: m.infoTitle,
  description: m.personalInfoSubtitle,
  condition: (answers) => (answers.passport as Passport)?.childPassport !== '',
  children: [
    buildDescriptionField({
      id: 'childsPersonalInfo.child',
      title: m.child,
      titleVariant: 'h3',
      marginBottom: 'smallGutter',
    }),
    buildTextField({
      id: 'childsPersonalInfo.name',
      title: m.name,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: ({ answers, externalData }: Application) => {
        const child = getChildPassport(answers, externalData)
        return child?.childName ?? ''
      },
    }),
    buildTextField({
      id: 'childsPersonalInfo.nationalId',
      title: m.nationalId,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      format: '######-####',
      defaultValue: ({ answers, externalData }: Application) => {
        const child = getChildPassport(answers, externalData)
        return child?.childNationalId ?? ''
      },
    }),
    buildDescriptionField({
      id: 'childsPersonalInfo.guardian1',
      title: m.parent1,
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
        (
          application.externalData.nationalRegistry?.data as {
            fullName?: string
          }
        )?.fullName ?? '',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian1.nationalId',
      title: m.nationalId,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      defaultValue: (application: Application) =>
        formatNationalId(application.applicant),
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian1.email',
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
      id: 'childsPersonalInfo.guardian1.phoneNumber',
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
      id: 'childsPersonalInfo.guardian2',
      title: m.parent2,
      titleVariant: 'h3',
      space: 'containerGutter',
      marginBottom: 'smallGutter',
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.name',
      title: m.name,
      backgroundColor: 'white',
      width: 'half',
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
      defaultValue: ({ answers, externalData }: Application) => {
        const child = getChildPassport(answers, externalData)
        return child?.secondParentName ?? ''
      },
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.nationalId',
      title: m.nationalId,
      backgroundColor: 'white',
      width: 'half',
      readOnly: true,
      format: '######-####',
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
      defaultValue: ({ answers, externalData }: Application) => {
        const child = getChildPassport(answers, externalData)
        return child?.secondParent ?? ''
      },
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.email',
      title: m.email,
      width: 'half',
      defaultValue: '',
      backgroundColor: 'blue',
      required: true,
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.phoneNumber',
      title: m.phoneNumber,
      width: 'half',
      variant: 'tel',
      format: '###-####',
      backgroundColor: 'blue',
      defaultValue: '',
      required: true,
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
    }),
    buildSubmitField({
      id: 'childsPersonalInfo.submit',
      placement: 'footer',
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
