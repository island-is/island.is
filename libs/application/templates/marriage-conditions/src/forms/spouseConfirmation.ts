import {
  buildForm,
  buildCustomField,
  buildDescriptionField,
  buildCheckboxField,
  buildSection,
  buildMultiField,
  buildSubmitField,
  buildTextField,
  buildSubSection,
  buildExternalDataProvider,
  buildPhoneField,
  buildImageField,
  buildAlertMessageField,
  YES,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import {
  Form,
  FormModes,
  DefaultEvents,
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { Individual } from '../types'
import { format as formatNationalId } from 'kennitala'
import { UserProfile } from '@island.is/api/schema'
import { fakeDataSection } from './fakeDataSection'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { removeCountryCode } from '@island.is/application/ui-components'
import { dataCollection } from './sharedSections/dataCollection'
import DigitalServices from '../assets/DigitalServices'

export const spouseConfirmation = ({ allowFakeData = false }): Form =>
  buildForm({
    id: 'spouseConfirmation',
    mode: FormModes.IN_PROGRESS,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'spouse',
        title: m.entrance,
        children: [
          buildMultiField({
            id: 'spouse',
            title: m.introSectionTitle,
            description: (application: Application) => ({
              ...m.spouseIntroDescription,
              values: {
                applicantsName: (application.answers.applicant as Individual)
                  ?.person.name,
                // application was created the day spouse1 submitted it
                applicationDate: format(
                  new Date(application.created),
                  'dd. MMMM, yyyy',
                  { locale: is },
                ).toLowerCase(),
              },
            }),
            children: [
              buildCheckboxField({
                id: 'spouseApprove',
                options: [
                  { value: YES, label: m.spouseContinue },
                  //followup: { value: NO, label: m.spouseDecline },
                ],
              }),
            ],
          }),
        ],
      }),
      ...(allowFakeData ? [fakeDataSection] : []),
      buildSection({
        id: 'externalData',
        title: m.dataCollectionTitle,
        children: [
          buildExternalDataProvider({
            id: 'spouseApproveExternalData',
            title: m.dataCollectionTitle,
            subTitle: m.dataCollectionSubtitle,
            description: m.dataCollectionDescription,
            checkboxLabel: m.dataCollectionCheckboxLabel,
            dataProviders: dataCollection,
            enableMockPayment: true,
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
                description: m.informationDescription,
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
                        .nationalRegistry.data as NationalRegistryIndividual
                      return nationalRegistry.fullName ?? ''
                    },
                  }),
                  buildPhoneField({
                    id: 'applicant.phone',
                    title: m.phone,
                    width: 'half',
                    backgroundColor: 'blue',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const data = application.externalData.userProfile
                        .data as UserProfile
                      return removeCountryCode(data.mobilePhoneNumber ?? '')
                    },
                  }),
                  buildTextField({
                    id: 'applicant.email',
                    title: m.email,
                    variant: 'email',
                    width: 'half',
                    backgroundColor: 'blue',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const data = application.externalData.userProfile
                        .data as UserProfile
                      return data.email ?? ''
                    },
                  }),
                  buildDescriptionField({
                    id: 'header2',
                    title: m.informationSpouse2,
                    titleVariant: 'h4',
                    space: 'containerGutter',
                  }),
                  buildTextField({
                    id: 'spouse.person.nationalId',
                    title: m.nationalId,
                    width: 'half',
                    backgroundColor: 'white',
                    format: '######-####',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const info = application.answers.spouse as Individual
                      return formatNationalId(info?.person.nationalId) ?? ''
                    },
                  }),
                  buildTextField({
                    id: 'spouse.person.name',
                    title: m.name,
                    width: 'half',
                    backgroundColor: 'white',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const info = application.answers.spouse as Individual
                      return info?.person.name ?? ''
                    },
                  }),
                  buildPhoneField({
                    id: 'spouse.phone',
                    title: m.phone,
                    width: 'half',
                    backgroundColor: 'blue',
                    required: true,
                    defaultValue: (application: Application) => {
                      const info = application.answers.spouse as Individual
                      return removeCountryCode(info?.phone ?? '')
                    },
                  }),
                  buildTextField({
                    id: 'spouse.email',
                    title: m.email,
                    variant: 'email',
                    width: 'half',
                    backgroundColor: 'blue',
                    required: true,
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
            title: m.dataCollectionNationalRegistryTitle,
            children: [
              buildMultiField({
                id: 'spousePersonalInfo',
                title: m.dataCollectionNationalRegistryTitle,
                description: m.personalInformationDescription,
                children: [
                  buildTextField({
                    id: 'spousePersonalInfo.address',
                    title: m.address,
                    backgroundColor: 'white',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const nationalRegistry = application.externalData
                        .nationalRegistry.data as NationalRegistryIndividual
                      return nationalRegistry?.address?.streetAddress
                    },
                  }),
                  buildTextField({
                    id: 'spousePersonalInfo.citizenship',
                    title: m.citizenship,
                    backgroundColor: 'white',
                    width: 'half',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const nationalRegistry = application.externalData
                        .nationalRegistry.data as NationalRegistryIndividual
                      return nationalRegistry?.citizenship?.code
                    },
                  }),
                  buildTextField({
                    id: 'spousePersonalInfo.maritalStatus',
                    title: m.maritalStatus,
                    backgroundColor: 'white',
                    width: 'half',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const status = application.externalData.maritalStatus
                        .data as { maritalStatus: string }
                      return status.maritalStatus
                    },
                  }),
                  buildDescriptionField({
                    id: 'space',
                    space: 'containerGutter',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      buildSection({
        condition: (_, externalData) => {
          const data = (
            externalData?.birthCertificate?.data as {
              hasBirthCertificate?: boolean
            }
          )?.hasBirthCertificate
          return !data
        },
        id: 'missingInformation',
        title: m.missingInformation,
        children: [
          buildMultiField({
            id: 'missingInfo',
            title: m.missingInformationTitle,
            description: m.missingInformationDescription,
            children: [
              buildImageField({
                id: 'image',
                image: DigitalServices,
                imageWidth: '50%',
                imagePosition: 'center',
              }),
              buildDescriptionField({
                id: 'space',
                space: 'gutter',
              }),
              buildAlertMessageField({
                id: 'missingInfoAlert',
                title: m.missingInformation,
                message: m.missingInformationAlertDescription,
                alertType: 'warning',
              }),
              buildCheckboxField({
                id: 'spouseConfirmMissingInfo',
                large: true,
                defaultValue: [],
                options: [
                  {
                    value: YES,
                    label: m.applicantConfirmMissingInformation,
                  },
                ],
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'spouseConfirmationOverview',
        title: m.overview,
        children: [
          buildMultiField({
            id: 'applicationOverview',
            title: m.applicationOverview,
            children: [
              buildCustomField({
                id: 'spouseOverview',
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
            children: [
              buildCustomField(
                {
                  id: 'payment',
                  title: '',
                  component: 'PaymentInfo',
                },
                {
                  allowFakeData,
                },
              ),
              buildSubmitField({
                id: 'submitPayment',
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
