import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { personal } from '../../../lib/messages'
import { Application, UserProfile } from '@island.is/api/schema'
import { NationalRegistryIndividual } from '@island.is/application/types'
import { Routes } from '../../../lib/constants'

export const UserInformationSubSection = buildSubSection({
  id: Routes.USERINFORMATION,
  title: personal.labels.userInformation.subSectionTitle,
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
          id: 'userInformation.name',
          title: personal.labels.userInformation.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return `${individual?.givenName} ${individual?.familyName}`
          },
        }),
        buildTextField({
          id: 'userInformation.nationalId',
          title: personal.labels.userInformation.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return individual?.nationalId
          },
        }),
        buildTextField({
          id: 'userInformation.address',
          title: personal.labels.userInformation.address,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return individual?.address?.streetAddress
          },
        }),
        buildTextField({
          id: 'userInformation.postalCode',
          title: personal.labels.userInformation.postalCodeAndCity,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const individual = getValueViaPath(
              application.externalData,
              'individual.data',
              undefined,
            ) as NationalRegistryIndividual | undefined

            return `${individual?.address?.postalCode} ${individual?.address?.city}`
          },
        }),
        buildTextField({
          id: 'userInformation.email',
          title: personal.labels.userInformation.email,
          width: 'half',
          variant: 'email',
          required: true,
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
