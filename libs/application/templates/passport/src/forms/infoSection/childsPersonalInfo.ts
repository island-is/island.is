import {
  buildDescriptionField,
  buildMultiField,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { removeCountryCode } from '@island.is/application/ui-components'
import { format as formatKennitala } from 'kennitala'
import { IdentityDocumentData, Passport } from '../../lib/constants'
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
      defaultValue: (application: Application) => {
        const child = (application.externalData.identityDocument
          ?.data as IdentityDocumentData).childPassports.find((child) => {
          return (
            child.childNationalId ===
            (application.answers.passport as Passport)?.childPassport
          )
        })
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
      defaultValue: (application: Application) => {
        const child = (application.externalData.identityDocument
          ?.data as IdentityDocumentData).childPassports.find((child) => {
          return (
            child.childNationalId ===
            (application.answers.passport as Passport)?.childPassport
          )
        })
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
        formatKennitala(application.applicant),
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian1.email',
      title: m.email,
      width: 'half',
      required: true,
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
      required: true,
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
      title: m.parent2,
      titleVariant: 'h3',
      space: 'containerGutter',
      marginBottom: 'smallGutter',
    }),
    buildTextField({
      id: 'childsPersonalInfo.guardian2.name',
      title: m.name,
      backgroundColor: 'white',
      width: 'half',
      defaultValue: (application: Application) => {
        const child = (application.externalData.identityDocument
          ?.data as IdentityDocumentData).childPassports.find((child) => {
          return (
            child.childNationalId ===
            (application.answers.passport as Passport)?.childPassport
          )
        })
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
      defaultValue: (application: Application) => {
        const child = (application.externalData.identityDocument
          ?.data as IdentityDocumentData).childPassports.find((child) => {
          return (
            child.childNationalId ===
            (application.answers.passport as Passport)?.childPassport
          )
        })
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
