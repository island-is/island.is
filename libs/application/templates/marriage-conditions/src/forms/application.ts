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
  buildNationalIdWithNameField,
  buildPhoneField,
  buildHiddenInputWithWatchedValue,
  buildAlertMessageField,
  buildImageField,
  buildCheckboxField,
  buildHiddenInput,
  YES,
  NO,
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
  CeremonyPlaces,
  Religion,
} from '../lib/constants'
import { UserProfile } from '@island.is/api/schema'
import { fakeDataSection } from './fakeDataSection'
import { dataCollection } from './sharedSections/dataCollection'
import { removeCountryCode } from '@island.is/application/ui-components'
import DigitalServices from '../assets/DigitalServices'

export const getApplication = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'MarriageConditionsApplicationDraftForm',
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
                id: 'introSpace',
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
                    required: true,
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
                    required: true,
                    defaultValue: (application: Application) => {
                      const data = application.externalData.userProfile
                        .data as UserProfile
                      return data.email ?? ''
                    },
                  }),
                  buildHiddenInput({
                    id: 'applicant.hasBirthCertificate',
                    defaultValue: (application: Application) => {
                      const data = (
                        application.externalData.birthCertificate.data as {
                          hasBirthCertificate?: boolean
                        }
                      )?.hasBirthCertificate
                      return data ?? false
                    },
                  }),
                  buildDescriptionField({
                    id: 'header2',
                    title: m.informationSpouse2,
                    titleVariant: 'h4',
                    space: 'containerGutter',
                  }),
                  buildNationalIdWithNameField({
                    id: 'spouse.person',
                    required: true,
                    minAgePerson: 18,
                  }),
                  buildHiddenInputWithWatchedValue({
                    id: 'spouse.nationalIdValidatorApplicant',
                    watchValue: 'applicant.person.nationalId',
                  }),
                  buildCustomField(
                    {
                      id: 'spouse.phone',
                      title: m.phone,
                      component: 'PhoneWithElectronicId',
                      width: 'half',
                    },
                    {
                      nationalIdPath: 'spouse.person.nationalId',
                    },
                  ),
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
                  buildDescriptionField({
                    id: 'info',
                    space: 'gutter',
                    description: m.informationAlertMessage,
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
                        .data as { maritalStatus: string }
                      return status.maritalStatus
                    },
                  }),
                  buildDescriptionField({
                    id: 'statusSpace',
                    space: 'containerGutter',
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
                    largeButtons: true,
                    width: 'half',
                  }),
                  buildDescriptionField({
                    id: 'ceremonyPeriodDescription',
                    space: 'gutter',
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
                    // 12 weeks from now
                    maxDate: new Date(
                      new Date().setDate(new Date().getDate() + 12 * 7),
                    ),
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.hasDate') === NO,
                  }),
                  buildDateField({
                    id: 'ceremony.period.dateTo',
                    title: m.ceremonyPeriodTil,
                    placeholder: m.ceremonyDatePlaceholder,
                    width: 'half',
                    minDate: new Date(),
                    // 12 weeks from now
                    maxDate: new Date(
                      new Date().setDate(new Date().getDate() + 12 * 7),
                    ),
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.hasDate') === NO,
                  }),
                  buildDateField({
                    id: 'ceremony.date',
                    title: m.ceremonyDate,
                    placeholder: m.ceremonyDatePlaceholder,
                    width: 'full',
                    minDate: new Date(),
                    // 12 weeks from now
                    maxDate: new Date(
                      new Date().setDate(new Date().getDate() + 12 * 7),
                    ),
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.hasDate') === YES,
                  }),
                  buildDescriptionField({
                    id: 'dateSpace',
                    space: 'gutter',
                  }),
                  buildDescriptionField({
                    id: 'dateSpace1',
                    space: 'gutter',
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
                  buildNationalIdWithNameField({
                    id: 'witness1.person',
                    required: true,
                    minAgePerson: 18,
                  }),
                  buildHiddenInputWithWatchedValue({
                    id: 'witness1.nationalIdValidatorApplicant',
                    watchValue: 'applicant.person.nationalId',
                  }),
                  buildHiddenInputWithWatchedValue({
                    id: 'witness1.nationalIdValidatorSpouse',
                    watchValue: 'spouse.person.nationalId',
                  }),
                  buildCustomField(
                    {
                      id: 'witness1.phone',
                      title: m.phone,
                      component: 'PhoneWithElectronicId',
                      width: 'half',
                    },
                    {
                      nationalIdPath: 'witness1.person.nationalId',
                    },
                  ),
                  buildTextField({
                    id: 'witness1.email',
                    title: m.email,
                    variant: 'email',
                    width: 'half',
                    backgroundColor: 'blue',
                    required: true,
                  }),
                  buildDescriptionField({
                    id: 'header4',
                    title: m.informationWitness2,
                    titleVariant: 'h4',
                    space: 'containerGutter',
                  }),
                  buildNationalIdWithNameField({
                    id: 'witness2.person',
                    required: true,
                    minAgePerson: 18,
                  }),
                  buildHiddenInputWithWatchedValue({
                    id: 'witness2.nationalIdValidatorApplicant',
                    watchValue: 'applicant.person.nationalId',
                  }),
                  buildHiddenInputWithWatchedValue({
                    id: 'witness2.nationalIdValidatorSpouse',
                    watchValue: 'spouse.person.nationalId',
                  }),
                  buildHiddenInputWithWatchedValue({
                    id: 'witness2.nationalIdValidatorWitness',
                    watchValue: 'witness1.person.nationalId',
                  }),
                  buildCustomField(
                    {
                      id: 'witness2.phone',
                      title: m.phone,
                      component: 'PhoneWithElectronicId',
                      width: 'half',
                    },
                    {
                      nationalIdPath: 'witness2.person.nationalId',
                    },
                  ),
                  buildTextField({
                    id: 'witness2.email',
                    title: m.email,
                    variant: 'email',
                    width: 'half',
                    backgroundColor: 'blue',
                    required: true,
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
                id: 'imageSpace',
                space: 'gutter',
              }),
              buildAlertMessageField({
                id: 'missingInfoAlert',
                title: m.missingInformation,
                message: m.missingInformationAlertDescription,
                alertType: 'warning',
              }),
              buildCheckboxField({
                id: 'applicantConfirmMissingInfo',
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
                component: 'ApplicationOverview',
              }),
              buildSubmitField({
                id: 'submitApplication',
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
}
