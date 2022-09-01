import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildCustomField,
  buildTextField,
  buildSubmitField,
  buildDescriptionField,
  buildSubSection,
  buildRadioField,
  buildSelectField,
  getValueViaPath,
  buildDateField,
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
import { MarriageTermination, NO, YES } from '../lib/constants'
import { allowFakeCondition } from '../lib/utils'
import { MaritalStatus } from '../types/schema'

export const getApplication = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'MarriageConditionsApplicationDraftForm',
    title: '',
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      ...(allowFakeData
        ? [
            buildSection({
              id: 'fakeDataSection',
              title: 'Gervigögn',
              children: [
                buildMultiField({
                  id: 'fakeData',
                  title: 'Gervigögn',
                  children: [
                    buildDescriptionField({
                      id: 'gervigognDesc',
                      title: 'Viltu nota gervigögn?',
                      titleVariant: 'h5',
                      // Note: text is rendered by a markdown component.. and when
                      // it sees the indented spaces it seems to assume this is code
                      // and so it will wrap the text in a <code> block when the double
                      // spaces are not removed.
                      description: `
                  Ath. gervigögn eru eingöngu notuð í stað þess að sækja
                  forsendugögn í staging umhverfi (dev x-road) hjá Þjóðskrá.
                  Öll önnur gögn eru ekki gervigögn og er þetta eingöngu gert
                  til að hægt sé að prófa ferlið.
                `.replace(/\s{1,}/g, ' '),
                    }),
                    buildRadioField({
                      id: 'fakeData.useFakeData',
                      title: '',
                      width: 'half',
                      options: [
                        {
                          value: YES,
                          label: 'Já',
                        },
                        {
                          value: NO,
                          label: 'Nei',
                        },
                      ],
                    }),
                    buildSelectField({
                      id: 'fakeData.maritalStatus',
                      title: 'Hjúskaparstaða',
                      description: 'Núverandi hjúskaparstaða umsækjanda',
                      width: 'half',
                      condition: allowFakeCondition(YES),
                      options: [
                        { value: '1', label: MaritalStatus.Unmarried },
                        { value: '3', label: MaritalStatus.Married },
                        { value: '4', label: MaritalStatus.Widowed },
                        { value: '5', label: MaritalStatus.Separated },
                        { value: '6', label: MaritalStatus.Divorced },
                        {
                          value: '7',
                          label: MaritalStatus.MarriedLivingSeparately,
                        },
                        {
                          value: '8',
                          label: MaritalStatus.MarriedToForeignLawPerson,
                        },
                        { value: '9', label: MaritalStatus.Unknown },
                        {
                          value: '0',
                          label:
                            MaritalStatus.ForeignResidenceMarriedToUnregisteredPerson,
                        },
                        {
                          value: 'L',
                          label:
                            MaritalStatus.IcelandicResidenceMarriedToUnregisteredPerson,
                        },
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ]
        : []),
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
            title: m.informationMaritalSides,
            children: [
              buildMultiField({
                id: 'sides',
                title: m.informationTitle,
                children: [
                  buildDescriptionField({
                    id: 'header1',
                    title: m.informationSpouse1,
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
                    title: m.name,
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
                    title: m.informationSpouse2,
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
            title: m.personalInformationTitle,
            children: [
              buildMultiField({
                id: 'personalInfo',
                title: m.personalInformationTitle,
                description: m.personalInformationDescription,
                children: [
                  buildTextField({
                    id: 'personalInfo.address',
                    title: m.address,
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
                    title: m.citizenship,
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
                    title: m.maritalStatus,
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
                    title: m.previousMarriageTermination,
                    options: [
                      {
                        value: MarriageTermination.divorce,
                        label: m.terminationByDivorce,
                      },
                      {
                        value: MarriageTermination.lostSpouse,
                        label: m.terminationByLosingSpouse,
                      },
                      {
                        value: MarriageTermination.annulment,
                        label: m.terminationByAnnulment,
                      },
                    ],
                    largeButtons: false,
                    condition: (answers) => {
                      return (
                        (answers.personalInfo as any)?.maritalStatus ===
                          'DIVORCED' ||
                        (answers.fakeData as any)?.maritalStatus === '6'
                      )
                    },
                  }),
                ],
              }),
            ],
          }),
          buildSubSection({
            id: 'info',
            title: m.ceremony,
            children: [
              buildMultiField({
                id: 'ceremonyInfo',
                title: m.ceremony,
                description: m.ceremonyDescription,
                children: [
                  buildDateField({
                    id: 'ceremony.date',
                    title: m.ceremonyDate,
                    placeholder: m.ceremonyDatePlaceholder,
                    width: 'half',
                  }),
                  buildDescriptionField({
                    id: 'space',
                    space: 'containerGutter',
                    title: '',
                  }),
                  buildRadioField({
                    id: 'ceremony.ceremonyPlace',
                    title: m.ceremonyPlace,
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
            title: m.informationWitnessTitle,
            children: [
              buildMultiField({
                id: 'witnesses',
                title: m.informationWitnessTitle,
                description: m.informationMaritalSidesDescription,
                children: [
                  buildDescriptionField({
                    id: 'header3',
                    title: m.informationWitness1,
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
                    title: m.informationWitness1,
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
        title: m.overview,
        children: [
          buildMultiField({
            id: 'applicationOverview',
            title: m.applicationOverview,
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
        title: m.payment,
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
                    name: m.proceedToPayment,
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
