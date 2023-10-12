import {
  buildForm,
  buildSection,
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
  buildExternalDataProvider,
  buildAlertMessageField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  Application,
  DefaultEvents,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { Individual } from '../types'
import { m } from '../lib/messages'
import {
  DistrictCommissionerAgencies,
  NO,
  YES,
  CeremonyPlaces,
  Religion,
} from '../lib/constants'
import { UserProfile } from '../types/schema'
import { fakeDataSection } from './fakeDataSection'
import { dataCollection } from './sharedSections/dataCollection'
import { removeCountryCode } from '@island.is/application/ui-components'

export const getApplication = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'MarriageConditionsApplicationDraftForm',
    title: '',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      ...(allowFakeData ? [fakeDataSection] : []),
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
                    format: '###-####',
                    defaultValue: (application: Application) => {
                      const data = application.externalData.userProfile
                        .data as UserProfile
                      return removeCountryCode(data?.mobilePhoneNumber ?? '')
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
                  buildDescriptionField({
                    id: 'header2',
                    title: m.informationSpouse2,
                    titleVariant: 'h4',
                    space: 'gutter',
                  }),
                  buildAlertMessageField({
                    id: 'alert',
                    title: '',
                    alertType: 'info',
                    message: m.informationAlertMessage,
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
                        .nationalRegistry.data as NationalRegistryIndividual
                      return nationalRegistry.address?.streetAddress
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
                        .nationalRegistry.data as NationalRegistryIndividual
                      return nationalRegistry?.citizenship?.code
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
                ],
              }),
            ],
          }),
          buildSubSection({
            id: 'infoCeremony',
            title: m.ceremony,
            children: [
              buildMultiField({
                id: 'ceremonyInfo',
                title: m.ceremony,
                description: m.ceremonyDescription,
                children: [
                  buildRadioField({
                    id: 'ceremony.hasDate',
                    title: m.hasCeremonyDate,
                    options: [
                      { value: YES, label: 'Já' },
                      {
                        value: NO,
                        label: 'Nei',
                      },
                    ],
                    largeButtons: false,
                    width: 'half',
                  }),
                  buildDescriptionField({
                    id: 'ceremonyPeriodDescription',
                    space: 'gutter',
                    title: '',
                    description: m.ceremonyPeriodDescription,
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.hasDate') === NO,
                  }),
                  buildDateField({
                    id: 'ceremony.period.dateFrom',
                    title: m.ceremonyPeriodFrom,
                    placeholder: m.ceremonyDatePlaceholder,
                    width: 'half',
                    minDate: new Date(),
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.hasDate') === NO,
                  }),
                  buildDateField({
                    id: 'ceremony.period.dateTo',
                    title: m.ceremonyPeriodTil,
                    placeholder: m.ceremonyDatePlaceholder,
                    width: 'half',
                    minDate: new Date(),
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.hasDate') === NO,
                  }),
                  buildDateField({
                    id: 'ceremony.date',
                    title: m.ceremonyDate,
                    placeholder: m.ceremonyDatePlaceholder,
                    width: 'half',
                    minDate: new Date(),
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.hasDate') === YES,
                  }),
                  buildDescriptionField({
                    id: 'space',
                    space: 'containerGutter',
                    title: '',
                  }),
                  buildRadioField({
                    id: 'ceremony.place.ceremonyPlace',
                    title: m.ceremonyPlace,
                    options: [
                      {
                        value: CeremonyPlaces.office,
                        label: m.ceremonyAtDistrictsOffice,
                      },
                      {
                        value: CeremonyPlaces.society,
                        label: m.ceremonyAtReligiousLifeViewingSociety,
                      },
                      {
                        value: 'none',
                        label: m.ceremonyPlaceNone,
                      },
                    ],
                    largeButtons: false,
                    width: 'full',
                  }),
                  buildSelectField({
                    id: 'ceremony.place.office',
                    title: m.ceremonyAtDistrictsOffice,
                    placeholder: m.ceremonyChooseDistrict,
                    options: ({
                      externalData: {
                        districtCommissioners: { data },
                      },
                    }) => {
                      return (data as DistrictCommissionerAgencies[])?.map(
                        ({ name, place, address }) => ({
                          value: `${name}, ${place}`,
                          label: `${name}, ${place}`,
                          tooltip: `${address}`,
                        }),
                      )
                    },
                    condition: (answers) =>
                      getValueViaPath(
                        answers,
                        'ceremony.place.ceremonyPlace',
                      ) === CeremonyPlaces.office &&
                      !!getValueViaPath(answers, 'ceremony.hasDate'),
                  }),
                  buildSelectField({
                    id: 'ceremony.place.society',
                    title: m.ceremonyAtReligiousLifeViewingSociety,
                    placeholder: m.ceremonyChooseSociety,
                    options: ({
                      externalData: {
                        religions: { data },
                      },
                    }) => {
                      return (data as Religion[]).map((society) => ({
                        value: society.name,
                        label: society.name,
                      }))
                    },
                    condition: (answers) =>
                      getValueViaPath(
                        answers,
                        'ceremony.place.ceremonyPlace',
                      ) === CeremonyPlaces.society &&
                      !!getValueViaPath(answers, 'ceremony.hasDate'),
                  }),
                ],
              }),
            ],
          }),
          buildSubSection({
            id: 'infoWitnesses',
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
                    format: '###-####',
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
                    title: m.informationWitness2,
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
                    format: '###-####',
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
