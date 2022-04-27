import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  Application,
  buildCustomField,
  buildDividerField,
  buildTextField,
  buildSubmitField,
  DefaultEvents,
  buildDescriptionField,
} from '@island.is/application/core'
import type { User } from '@island.is/api/domains/national-registry'
import { format as formatNationalId } from 'kennitala'
import { UserProfile } from '../types/schema'
import { Individual } from '../types'
import { m } from '../lib/messages'

export const getApplication = (): Form => {
  return buildForm({
    id: 'MarriageConditionsApplicationDraftForm',
    title: '',
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'externalData',
        title: m.dataCollectionTitle,
        children: [
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: m.dataCollectionTitle,
            subTitle: m.dataCollectionSubtitle,
            description: m.dataCollectionDescription,
            checkboxLabel: m.dataCollectionCheckboxLabel,
            dataProviders: [
              buildDataProviderItem({
                id: 'nationalRegistry',
                type: 'NationalRegistryProvider',
                title: m.dataCollectionNationalRegistryTitle,
                subTitle: m.dataCollectionNationalRegistrySubtitle,
              }),
              buildDataProviderItem({
                id: 'userProfile',
                type: 'UserProfileProvider',
                title: m.dataCollectionUserProfileTitle,
                subTitle: m.dataCollectionUserProfileSubtitle,
              }),
              buildDataProviderItem({
                id: 'birthCertificate',
                type: '',
                title: m.dataCollectionBirthCertificateTitle,
                subTitle: m.dataCollectionBirthCertificateDescription,
              }),
              buildDataProviderItem({
                id: 'maritalStatus',
                type: '',
                title: m.dataCollectionMaritalStatusTitle,
                subTitle: m.dataCollectionMaritalStatusDescription,
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'marriageSides',
        title: m.informationSectionTitle,
        children: [
          buildMultiField({
            id: 'sides',
            title: m.informationTitle,
            children: [
              buildDividerField({
                title: m.informationSpouse1,
                color: 'dark400',
              }),
              buildTextField({
                id: 'applicant.person.nationalId',
                title: m.nationalId,
                width: 'half',
                backgroundColor: 'white',
                format: '######-####',
                defaultValue: (application: Application) => {
                  return formatNationalId(application.applicant) ?? ''
                },
              }),
              buildTextField({
                id: 'applicant.person.name',
                title: 'Nafn',
                width: 'half',
                backgroundColor: 'white',
                defaultValue: (application: Application) => {
                  const nationalRegistry = application.externalData
                    .nationalRegistry.data as User
                  return nationalRegistry.fullName ?? ''
                },
              }),
              buildTextField({
                id: 'applicant.phone',
                title: m.phone,
                width: 'half',
                backgroundColor: 'blue',
                defaultValue: (application: Application) => {
                  const data = application.externalData.userProfile
                    .data as UserProfile
                  return data.mobilePhoneNumber ?? ''
                },
              }),
              buildTextField({
                id: 'applicant.email',
                title: m.email,
                variant: 'email',
                width: 'half',
                backgroundColor: 'blue',
                defaultValue: (application: Application) => {
                  const data = application.externalData.userProfile
                    .data as UserProfile
                  return data.email ?? ''
                },
              }),
              buildDividerField({
                title: m.informationSpouse2,
                color: 'dark400',
              }),
              buildCustomField({
                id: 'alert',
                title: '',
                component: 'InfoAlert',
              }),
              buildCustomField({
                id: 'spouse.person',
                title: '',
                component: 'NationalIdWithName',
              }),
              buildTextField({
                id: 'spouse.phone',
                title: m.phone,
                width: 'half',
                backgroundColor: 'blue',
                defaultValue: (application: Application) => {
                  const info = application.answers.spouse as Individual
                  return info?.phone ?? ''
                },
              }),
              buildTextField({
                id: 'spouse.email',
                title: m.email,
                variant: 'email',
                width: 'half',
                backgroundColor: 'blue',
                defaultValue: (application: Application) => {
                  const info = application.answers.spouse as Individual
                  return info?.email ?? ''
                },
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'marriageWitnesses',
        title: m.informationWitnessTitle,
        children: [
          buildMultiField({
            id: 'witnesses',
            title: m.informationWitnessTitle,
            description: m.informationMaritalSidesDescription,
            children: [
              buildDividerField({
                title: m.informationWitness1,
                color: 'dark400',
              }),
              buildCustomField({
                id: 'witness1.person',
                title: '',
                component: 'NationalIdWithName',
              }),
              buildTextField({
                id: 'witness1.phone',
                title: m.phone,
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildTextField({
                id: 'witness1.email',
                title: m.email,
                variant: 'email',
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildDividerField({
                title: m.informationWitness2,
                color: 'dark400',
              }),
              buildCustomField({
                id: 'witness2.person',
                title: '',
                component: 'NationalIdWithName',
              }),
              buildTextField({
                id: 'witness2.phone',
                title: m.phone,
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildTextField({
                id: 'witness2.email',
                title: m.email,
                variant: 'email',
                width: 'half',
                backgroundColor: 'blue',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'marriageWitnesses',
        title: '',
        children: [
          buildMultiField({
            id: 'applicationOverview',
            title: 'Yfirlit umsóknar',
            description: m.informationSubtitle,
            children: [
              buildCustomField({
                id: 'overview',
                title: '',
                component: 'ApplicationOverview',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'paymentTotal',
        title: 'Greiðsla',
        children: [
          buildMultiField({
            id: 'payment',
            title: '',
            children: [
              buildCustomField({
                id: 'payment',
                title: '',
                component: 'PaymentInfo',
              }),
              buildSubmitField({
                id: 'submitPayment',
                title: '',
                placement: 'footer',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.PAYMENT,
                    name: 'Áfram í greiðslu',
                    type: 'primary',
                  },
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
