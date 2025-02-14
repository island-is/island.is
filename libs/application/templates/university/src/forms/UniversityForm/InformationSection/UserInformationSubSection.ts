import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
  buildAlertMessageField,
} from '@island.is/application/core'
import { personal } from '../../../lib/messages'
import { Application, UserProfile } from '@island.is/api/schema'
import { NationalRegistryIndividual } from '@island.is/application/types'
import { Routes } from '../../../lib/constants'

export const UserInformationSubSection = buildSubSection({
  id: Routes.USERINFORMATION,
  title: personal.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.USERINFORMATION,
      title: personal.labels.userInformation.pageTitle,
      children: [
        buildDescriptionField({
          id: `${Routes.USERINFORMATION}.title`,
          title: personal.labels.userInformation.title,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: `${Routes.USERINFORMATION}.name`,
          title: personal.labels.userInformation.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return `${individual?.givenName} ${individual?.familyName}`
          },
        }),
        buildTextField({
          id: `${Routes.USERINFORMATION}.nationalId`,
          title: personal.labels.userInformation.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return individual?.nationalId
          },
        }),
        buildTextField({
          id: `${Routes.USERINFORMATION}.address`,
          title: personal.labels.userInformation.address,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return individual?.address?.streetAddress
          },
        }),
        buildTextField({
          id: `${Routes.USERINFORMATION}.postalCode`,
          title: personal.labels.userInformation.postalCodeAndCity,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'nationalRegistry.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return `${individual?.address?.postalCode} ${individual?.address?.city}`
          },
        }),
        buildAlertMessageField({
          id: 'userInformation.alert',
          alertType: 'info',
          doesNotRequireAnswer: true,
          message: personal.labels.userInformation.alertMessage,
          links: [
            {
              title: personal.labels.userInformation.alertMessageLinkTitle,
              url: personal.labels.userInformation.alertMessageLink,
              isExternal: false,
            },
          ],
        }),
        buildTextField({
          id: 'userInformation.email',
          title: personal.labels.userInformation.email,
          width: 'half',
          variant: 'email',
          required: true,
          readOnly: true,
          defaultValue: (application: Application) => {
            const userProfile = getValueViaPath(
              application.externalData,
              'userProfile.data',
              undefined,
            ) as UserProfile | undefined

            return userProfile?.email
          },
        }),
        buildTextField({
          id: 'userInformation.phone',
          title: personal.labels.userInformation.phone,
          width: 'half',
          variant: 'tel',
          format: '###-####',
          required: true,
          readOnly: true,
          defaultValue: (application: Application) => {
            const userProfile = getValueViaPath(
              application.externalData,
              'userProfile.data',
              undefined,
            ) as UserProfile | undefined

            return userProfile?.mobilePhoneNumber
          },
        }),
      ],
    }),
  ],
})
