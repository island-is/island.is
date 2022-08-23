import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildCustomField,
  buildDividerField,
  buildTextField,
  buildSubmitField,
  buildDescriptionField,
  buildSubSection,
  buildRadioField,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import type { User } from '@island.is/api/domains/national-registry'
import { format as formatNationalId } from 'kennitala'
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
        id: 'introSection',
        title: m.introTitle,
        children: [
          buildMultiField({
            id: 'intro',
            title: m.introSectionTitle,
            description: m.introSectionDescription,
            children: [
              buildDescriptionField({
                id: 'space',
                title: '',
              }),
            ],
          }),
        ],
      }),
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
                type: 'NationalRegistryMaritalStatusProvider',
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
          buildSubSection({
            id: 'sides',
            title: 'Hjónaefni',
            children: [
              buildMultiField({
                id: 'sides',
                title: m.informationTitle,
                children: [
                  buildDescriptionField({
                    id: 'header1',
                    title: 'Hjónaefni 1',
                    titleVariant: 'h4',
                  }),
                  buildTextField({
                    id: 'applicant.person.nationalId',
                    title: m.nationalId,
                    width: 'half',
                    backgroundColor: 'white',
                    readOnly: true,
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
                    readOnly: true,
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
                        .data as any
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
                        .data as any
                      return data.email ?? ''
                    },
                  }),
                  buildDescriptionField({
                    id: 'header2',
                    title: 'Hjónaefni 2',
                    titleVariant: 'h4',
                    space: 'gutter',
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
          buildSubSection({
            id: 'info',
            title: 'Persónuupplýsingar',
            children: [
              buildMultiField({
                id: 'personalInfo',
                title: 'Persónuupplýsingar',
                description:
                  'Veita þarf nánari persónuupplýsingar auk upplýsinga um hjúskaparstöðu fyrir vígslu. Hjónaefni ábyrgjast að þær upplýsingar sem eru gefnar séu réttar.',
                children: [
                  buildTextField({
                    id: 'personalInfo.address',
                    title: 'Lögheimili',
                    backgroundColor: 'white',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const nationalRegistry = application.externalData
                        .nationalRegistry.data as User
                      return nationalRegistry.address.streetAddress
                    },
                  }),
                  buildTextField({
                    id: 'personalInfo.citizenship',
                    title: 'IS',
                    backgroundColor: 'white',
                    width: 'half',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const nationalRegistry = application.externalData
                        .nationalRegistry.data as User
                      return nationalRegistry.citizenship.code
                    },
                  }),
                  buildTextField({
                    id: 'personalInfo.maritalStatus',
                    title: 'Hjúskaparstaða fyrir vígslu',
                    backgroundColor: 'white',
                    width: 'half',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const status = application.externalData.maritalStatus
                        .data as any
                      return status.maritalStatus
                    },
                  }),
                  buildDescriptionField({
                    id: 'space',
                    space: 'containerGutter',
                    title: '',
                  }),
                  buildRadioField({
                    id: 'personalInfo.previousMarriageTermination',
                    title: 'Hvernig lauk síðasta hjúskap?',
                    options: [
                      { value: 'divorce', label: 'Með lögskilnaði' },
                      { value: 'lostSpouse', label: 'Með láti maka' },
                      { value: 'annulment', label: 'Með ógildingu' },
                    ],
                    largeButtons: false,
                  }),
                ],
              }),
            ],
          }),
          buildSubSection({
            id: 'info',
            title: 'Vígsla',
            children: [
              buildMultiField({
                id: 'ceremonyInfo',
                title: 'Vígsla',
                description:
                  'Veita þarf nánari persónuupplýsingar auk upplýsinga um hjúskaparstöðu fyrir vígslu. Hjónaefni ábyrgjast að þær upplýsingar sem eru gefnar séu réttar.',
                children: [
                  buildTextField({
                    id: 'ceremony.date',
                    title: 'Áætlaður vígsludagur eða tímabil',
                    placeholder: 'Skráðu inn dag eða tímabil',
                  }),
                  buildDescriptionField({
                    id: 'space',
                    space: 'containerGutter',
                    title: '',
                  }),
                  buildRadioField({
                    id: 'ceremony.ceremonyPlace',
                    title: 'Hvar er vígsla áformuð?',
                    options: [
                      { value: 'office', label: 'Embætti sýslumanns' },
                      {
                        value: 'religious',
                        label: 'Trú- eða lífsskoðunarfélagi',
                      },
                    ],
                    largeButtons: false,
                    width: 'half',
                  }),
                  buildSelectField({
                    id: 'office',
                    title: 'Embætti sýslumanns',
                    placeholder: 'Veldu embætti sýslumanns úr lista',
                    options: [
                      { value: '1', label: '1' },
                      { value: '2', label: '2' },
                      { value: '3', label: '3' },
                      { value: '4', label: '4' },
                      { value: '5', label: '5' },
                    ],
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.ceremonyPlace') ===
                      'office',
                  }),
                  buildSelectField({
                    id: 'religious',
                    title: 'Trú- eða lífsskoðunarfélag',
                    placeholder: 'Veldu trú- eða lífsskoðunarfélag úr lista',
                    options: [
                      { value: '1', label: '1' },
                      { value: '2', label: '2' },
                      { value: '3', label: '3' },
                      { value: '4', label: '4' },
                      { value: '5', label: '5' },
                    ],
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.ceremonyPlace') ===
                      'religious',
                  }),
                ],
              }),
            ],
          }),
          buildSubSection({
            id: 'info2',
            title: 'Svaramenn',
            children: [
              buildMultiField({
                id: 'witnesses',
                title: m.informationWitnessTitle,
                description: m.informationMaritalSidesDescription,
                children: [
                  buildDescriptionField({
                    id: 'header3',
                    title: 'Svaramaður 1',
                    titleVariant: 'h4',
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
                  buildDescriptionField({
                    id: 'header4',
                    title: 'Svaramaður 2',
                    titleVariant: 'h4',
                    space: 'gutter',
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
        ],
      }),
      buildSection({
        id: 'marriageOverview',
        title: 'Yfirlit',
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
