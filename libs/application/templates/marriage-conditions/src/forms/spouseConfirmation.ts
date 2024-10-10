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
} from '@island.is/application/core'
import { YES } from '../lib/constants'
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
import { UserProfile } from '../types/schema'
import { fakeDataSection } from './fakeDataSection'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { removeCountryCode } from '@island.is/application/ui-components'
import { dataCollection } from './sharedSections/dataCollection'

export const spouseConfirmation = ({ allowFakeData = false }): Form =>
  buildForm({
    id: 'spouseConfirmation',
    title: '',
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
                // application was created the day spouse1 completed payment
                applicationDate: format(
                  new Date(application.externalData.createCharge.date),
                  'dd. MMMM, yyyy',
                  { locale: is },
                ).toLowerCase(),
              },
            }),
            children: [
              buildCheckboxField({
                id: 'spouseApprove',
                title: '',
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
                description:
                  'Beiðni um könnun hjónavígsluskilyrða mun ekki hljóta efnismeðeferð fyrr en hjónaefni hafa bæði veitt rafræna undirskrift. Vinsamlegast gangið því úr skugga um að símanúmer og netföng séu rétt rituð.',
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
                  buildTextField({
                    id: 'applicant.phone',
                    title: m.phone,
                    width: 'half',
                    backgroundColor: 'blue',
                    readOnly: true,
                    format: '###-####',
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
                    space: 'gutter',
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
                  buildTextField({
                    id: 'spouse.phone',
                    title: m.phone,
                    width: 'half',
                    backgroundColor: 'blue',
                    format: '###-####',
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
                    title: '',
                  }),
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
                title: '',
                component: 'ApplicationOverview',
              }),
              buildSubmitField({
                id: 'submitApplication',
                title: '',
                placement: 'footer',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: m.submitApplication,
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
