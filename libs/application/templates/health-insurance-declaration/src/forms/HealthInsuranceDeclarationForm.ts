import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDateField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildHiddenInput,
  buildKeyValueField,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildStaticTableField,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes, FormValue } from '@island.is/application/types'
import * as m from '../lib/messages'
import Logo from '../assets/Logo'
import {
  getChildrenAsOptions,
  getFullNameFromExternalData,
  getInsuranceStatus,
  getSelectedFamiliy,
} from '../utils'
import { HealthInsuranceDeclaration } from '../lib/dataSchema'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import { HealthInsuranceDeclarationApplication } from '../types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import format from 'date-fns/format'
import { ApplicantType } from '../shared/constants'

export const HealthInsuranceDeclarationForm: Form = buildForm({
  id: 'HealthInsuranceDeclarationDraft',
  title: m.application.general.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.application.applicant.sectionTitle,
      children: [
        buildMultiField({
          id: 'applicant',
          title: applicantInformationMessages.general.title,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: applicantInformationMessages.labels.name,
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) =>
                application.externalData?.nationalRegistry?.data?.fullName ??
                '',
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: applicantInformationMessages.labels.nationalId,
              format: '######-####',
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) =>
                application.externalData?.nationalRegistry?.data?.nationalId ??
                '',
            }),
            buildTextField({
              id: 'applicant.address',
              title: applicantInformationMessages.labels.address,
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) =>
                application.externalData?.nationalRegistry?.data?.address
                  ?.streetAddress ?? '',
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: applicantInformationMessages.labels.postalCode,
              width: 'half',
              format: '###',
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) => {
                return (
                  application.externalData?.nationalRegistry?.data?.address
                    ?.postalCode ?? ''
                )
              },
            }),
            buildTextField({
              id: 'applicant.city',
              title: applicantInformationMessages.labels.city,
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) =>
                application.externalData?.nationalRegistry?.data?.address
                  ?.city ?? '',
            }),
            buildTextField({
              id: 'applicant.email',
              title: applicantInformationMessages.labels.email,
              width: 'half',
              variant: 'email',
              backgroundColor: 'blue',
              required: true,
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) => application.externalData?.userProfile?.data?.email ?? '',
              maxLength: 100,
            }),
            buildPhoneField({
              id: 'applicant.phoneNumber',
              title: applicantInformationMessages.labels.tel,
              width: 'half',
              backgroundColor: 'blue',
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) =>
                application.externalData?.userProfile?.data
                  ?.mobilePhoneNumber ?? '',
              required: true,
            }),
            buildHiddenInput({
              id: 'isHealthInsured',
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) => getInsuranceStatus(application.externalData),
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'notHealthInsuredSection',
      title: m.application.notHealthInusred.sectionTitle,
      children: [
        buildMultiField({
          id: 'notHealthInsuredMultiField',
          title: m.application.notHealthInusred.sectionDescription,
          children: [
            buildDescriptionField({
              id: 'notHealthInsuredDescriptionField',
              title: '',
              description:
                m.application.notHealthInusred.descriptionFieldDescription,
            }),
            buildCheckboxField({
              id: 'notHealthInsuredCheckboxField',
              title: '',
              disabled: true,
              options: () => [
                {
                  value: '',
                  label: ({ externalData }) =>
                    getFullNameFromExternalData(externalData),
                },
              ],
            }),
          ],
        }),
      ],
      condition: (answers: FormValue) => {
        console.log(answers.isHealthInsured)
        return !answers.isHealthInsured as boolean
      },

      // condition: (answers: FormValue) => {
      //   return true
      // },
    }),
    buildSection({
      id: 'studentOrTravellerSection',
      title: m.application.studentOrTraveller.sectionTitle,
      children: [
        buildMultiField({
          id: 'studentOrTravellerMultiField',
          title: m.application.studentOrTraveller.sectionDescription,
          children: [
            buildRadioField({
              id: 'studentOrTravellerRadioFieldTraveller',
              title: '',
              required: true,
              options: [
                {
                  label:
                    m.application.studentOrTraveller.travellerRadioFieldText,
                  value: ApplicantType.TRAVELLER,
                },
                {
                  label: m.application.studentOrTraveller.studentRadioFieldText,
                  value: ApplicantType.STUDENT,
                },
              ],
            }),
            buildAlertMessageField({
              id: 'studentOrTravellerAlertMessage',
              alertType: 'warning',
              title: 'Athugið',
              message:
                m.application.studentOrTraveller
                  .studentOrTravellerAlertMessageText,
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'registerPersonsSection',
      title: m.application.registerPersons.sectionTitle,
      children: [
        buildMultiField({
          id: 'registerPersonsMultiFiled',
          title: m.application.registerPersons.sectionDescription,
          children: [
            buildCheckboxField({
              id: 'registerPersonsSpouseCheckboxField',
              title: m.application.registerPersons.spousetitle,
              options: [
                {
                  value: '1201345850',
                  label: 'Lísa Jónsdóttir',
                  subLabel: 'Kennitala 120134-5850',
                },
              ],
            }),
            buildCheckboxField({
              id: 'registerPersonsChildrenCheckboxField',
              title: m.application.registerPersons.childrenTitle,
              options: ({ externalData }) => getChildrenAsOptions(externalData),
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'residencySection',
      title: m.application.residency.sectionTitle,
      children: [
        buildMultiField({
          id: 'residencyMultiField',
          title: m.application.residency.sectionDescription,
          children: [
            buildRadioField({
              id: 'residencyTravellerRadioField',
              title: '',
              options: [
                { label: 'Evrópa', value: 'Evrópa' },
                { label: 'Norður Ameríka', value: 'Norður Ameríka' },
                { label: 'Suður Ameríka', value: 'Suður Ameríka' },
                { label: 'Asía', value: 'Asía' },
                { label: 'Afríka', value: 'Afríka' },
                { label: 'Ástralía', value: 'Ástralía' },
                { label: 'Sðurskautslandið', value: 'Sðurskautslandið' },
              ],
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'dateSection',
      title: m.application.date.sectionTitle,
      children: [
        buildMultiField({
          id: 'dateMultifield',
          title: m.application.date.sectionDescription,
          children: [
            buildDateField({
              id: 'dateFieldFrom',
              title: m.application.date.dateFromTitle,
              placeholder: m.application.date.datePlaceholderText,
              width: 'half',
            }),
            buildDateField({
              id: 'dateFieldTo',
              title: m.application.date.dateToTitle,
              placeholder: m.application.date.datePlaceholderText,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    // Overview Screen
    buildSection({
      id: 'overview',
      title: m.application.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'overviewMultiField',
          title: m.application.overview.sectionTitle,
          description: m.application.overview.sectionDescription,
          space: 3,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewStudentOrTravellerTtile',
              title: m.application.overview.studentOrTravellerTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: '',
              value: ({ answers }) =>
                (answers as HealthInsuranceDeclaration)
                  .studentOrTravellerRadioFieldTraveller ===
                ApplicantType.TRAVELLER
                  ? m.application.overview.studentOrTravellerTravellerText
                  : m.application.overview.studentOrTravellerStudentText,
            }),
            buildDividerField({}),
            // Applicant Info
            buildDescriptionField({
              id: 'overviewApplicantInfoTitile',
              title: m.application.overview.applicantInfoTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.name,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as HealthInsuranceDeclaration).applicant.name,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.nationalId,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as HealthInsuranceDeclaration).applicant.nationalId,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.address,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as HealthInsuranceDeclaration).applicant.address,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.postalCode,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as HealthInsuranceDeclaration).applicant.postalCode,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.email,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as HealthInsuranceDeclaration).applicant.email,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.tel,
              colSpan: '6/12',
              condition: (answers) =>
                !!(answers as HealthInsuranceDeclaration)?.applicant
                  ?.phoneNumber,
              value: ({ answers }) =>
                formatPhoneNumber(
                  removeCountryCode(
                    (answers as HealthInsuranceDeclaration).applicant
                      .phoneNumber,
                  ),
                ),
            }),
            buildDividerField({}),
            // Family table
            buildStaticTableField({
              title: m.application.overview.familyTableTitle,
              rows: ({ answers, externalData }) =>
                getSelectedFamiliy(
                  answers as HealthInsuranceDeclaration,
                  externalData,
                ),
              header: [
                applicantInformationMessages.labels.name,
                applicantInformationMessages.labels.nationalId,
                'Tengsl',
              ],
            }),
            buildDividerField({}),
            // Date period
            buildDescriptionField({
              id: 'overviewDatePeriodTitle',
              title: m.application.overview.dateTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: '',
              value: ({ answers }) =>
                `${format(
                  new Date(
                    (answers as HealthInsuranceDeclaration).dateFieldFrom,
                  ),
                  'dd.MM.yyyy',
                )} - ${format(
                  new Date((answers as HealthInsuranceDeclaration).dateFieldTo),
                  'dd.MM.yyyy',
                )} `,
            }),
            buildDividerField({}),
          ],
        }),
      ],
    }),
  ],
})
