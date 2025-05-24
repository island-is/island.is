import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDateField,
  buildDescriptionField,
  buildDividerField,
  buildFileUploadField,
  buildForm,
  buildHiddenInput,
  buildKeyValueField,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildStaticTableField,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/types'
import * as m from '../lib/messages'
import Logo from '../assets/Logo'
import {
  getChildrenAsOptions,
  getCommentFromExternalData,
  getContinentNameFromCode,
  getContinentsAsOption,
  getCountriesAsOption,
  getCountryNameFromCode,
  getFullNameFromExternalData,
  getInsuranceStatus,
  getSelectedApplicants,
  getApplicantAsOption,
  getSpouseAsOptions,
  hasFamilySelected,
} from '../utils'
import { HealthInsuranceDeclaration } from '../lib/dataSchema'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import { HealthInsuranceDeclarationApplication } from '../types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import format from 'date-fns/format'
import sub from 'date-fns/sub'
import { ApplicantType } from '../shared/constants'

export const HealthInsuranceDeclarationForm: Form = buildForm({
  id: 'HealthInsuranceDeclarationDraft',
  title: m.application.general.name,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
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
            buildHiddenInput({
              id: 'isHealthInsuredComment',
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) => getCommentFromExternalData(application.externalData),
            }),
            buildHiddenInput({
              id: 'hasSpouse',
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) => getSpouseAsOptions(application.externalData).length > 0,
            }),
            buildHiddenInput({
              id: 'hasChildren',
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) => getChildrenAsOptions(application.externalData).length > 0,
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
              description:
                m.application.notHealthInusred.descriptionFieldDescription,
            }),
            buildAlertMessageField({
              id: 'notHealthInsuredAlertMessage',
              alertType: 'warning',
              message: ({ externalData }) =>
                getCommentFromExternalData(externalData),
              condition: (answers) => {
                return (answers?.isHealthInsuredComment as string)?.length > 0
              },
            }),
            buildCheckboxField({
              id: 'notHealthInsuredCheckboxField',
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
        return (answers.isHealthInsured !== undefined &&
          !answers.isHealthInsured) as boolean
      },
    }),
    buildSection({
      id: 'studentOrTourist',
      title: m.application.studentOrTourist.sectionTitle,
      children: [
        buildMultiField({
          id: 'studentOrTouristMultiField',
          title: m.application.studentOrTourist.sectionDescription,
          children: [
            buildRadioField({
              id: 'studentOrTouristRadioFieldTourist',
              required: true,
              options: [
                {
                  label: m.application.studentOrTourist.touristRadioFieldText,
                  value: ApplicantType.TOURIST,
                },
                {
                  label: m.application.studentOrTourist.studentRadioFieldText,
                  value: ApplicantType.STUDENT,
                },
              ],
            }),
            buildAlertMessageField({
              id: 'studentOrTouristAlertMessage',
              alertType: 'warning',
              title: 'Athugið',
              message:
                m.application.studentOrTourist.studentOrTouristAlertMessageText,
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
              id: 'selectedApplicants.registerPersonsApplicantCheckboxField',
              title: m.application.registerPersons.applicantTitle,
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) => [getApplicantAsOption(application.externalData)[0]?.value],
              options: ({ externalData }) => getApplicantAsOption(externalData),
            }),
            buildCheckboxField({
              id: 'selectedApplicants.registerPersonsSpouseCheckboxField',
              title: m.application.registerPersons.spousetitle,
              options: ({ externalData }) => getSpouseAsOptions(externalData),
              condition: (answers) => {
                return answers?.hasSpouse as boolean
              },
            }),
            buildCheckboxField({
              id: 'selectedApplicants.registerPersonsChildrenCheckboxField',
              title: m.application.registerPersons.childrenTitle,
              options: ({ externalData }) => getChildrenAsOptions(externalData),
              condition: (answers) => {
                return answers?.hasChildren as boolean
              },
            }),
            buildHiddenInput({
              id: 'selectedApplicants.isHealthInsured',
              defaultValue: (
                application: HealthInsuranceDeclarationApplication,
              ) => getInsuranceStatus(application.externalData),
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'residencySectionTourist',
      title: m.application.residency.sectionTitle,
      children: [
        buildMultiField({
          id: 'residencyMultiField',
          title: m.application.residency.touristSectionDescription,
          children: [
            buildRadioField({
              id: 'residencyTouristRadioField',
              required: true,
              options: ({ externalData }) =>
                getContinentsAsOption(externalData),
              width: 'half',
            }),
          ],
        }),
      ],
      condition: (answers: FormValue) =>
        answers.studentOrTouristRadioFieldTourist === ApplicantType.TOURIST,
    }),
    buildSection({
      id: 'residencySectionStudent',
      title: m.application.residency.sectionTitle,
      children: [
        buildMultiField({
          id: 'residencyMultiField',
          title: m.application.residency.studentSectionDescription,
          children: [
            buildSelectField({
              id: 'residencyStudentSelectField',
              title: m.application.residency.studentSectionSelectionTitle,
              required: true,
              options: ({ externalData }) => getCountriesAsOption(externalData),
              defaultValue: '',
              placeholder:
                m.application.residency.studentSectionPlaceholderText,
            }),
          ],
        }),
      ],
      condition: (answers: FormValue) =>
        answers.studentOrTouristRadioFieldTourist === ApplicantType.STUDENT,
    }),
    buildSection({
      id: 'educationConfirmationSection',
      title: m.application.educationConfirmation.sectionTitle,
      children: [
        buildMultiField({
          id: 'educationConfirmaitonMultifield',
          title: m.application.educationConfirmation.sectionTitle,
          children: [
            buildDescriptionField({
              id: 'educationConfirmationDescriptionField',
              description:
                m.application.educationConfirmation.SectionDescription,
            }),
            buildFileUploadField({
              id: 'educationConfirmationFileUploadField',
              title: m.application.educationConfirmation.UploadFieldTitle,
              uploadDescription:
                m.application.educationConfirmation.UploadFieldDescription,
              uploadAccept: '.pdf, .docx, .rtf',
              uploadMultiple: true,
            }),
          ],
        }),
      ],
      condition: (answers: FormValue) =>
        answers.studentOrTouristRadioFieldTourist === ApplicantType.STUDENT,
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
              id: 'period.dateFieldFrom',
              minDate: (application) =>
                application.answers.studentOrTouristRadioFieldTourist ===
                ApplicantType.STUDENT
                  ? sub(new Date(), { years: 1 })
                  : new Date(0),
              title: m.application.date.dateFromTitle,
              placeholder: m.application.date.datePlaceholderText,
              required: true,
              width: 'half',
              defaultValue: '',
            }),
            buildDateField({
              id: 'period.dateFieldTo',
              title: m.application.date.dateToTitle,
              placeholder: m.application.date.datePlaceholderText,
              required: true,
              width: 'half',
              defaultValue: '',
            }),
            buildAlertMessageField({
              id: 'dateAlertMessage',
              alertType: 'warning',
              title: m.application.date.studentMinDateWarningTitle,
              message: m.application.date.studentMinDateWarning,
              condition: (answers) =>
                answers.studentOrTouristRadioFieldTourist ===
                ApplicantType.STUDENT,
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
              id: 'overviewStudentOrTouristTtile',
              title: m.application.overview.studentOrTouristTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: '',
              value: ({ answers }) =>
                (answers as HealthInsuranceDeclaration)
                  .studentOrTouristRadioFieldTourist === ApplicantType.TOURIST
                  ? m.application.overview.studentOrTouristTouristText
                  : m.application.overview.studentOrTouristStudentText,
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
            // Applicants table
            buildStaticTableField({
              title: m.application.overview.applicantsTableTitle,
              rows: ({ answers, externalData }) =>
                getSelectedApplicants(
                  answers as HealthInsuranceDeclaration,
                  externalData,
                ),
              header: [
                applicantInformationMessages.labels.name,
                applicantInformationMessages.labels.nationalId,
                'Tengsl',
              ],
            }),
            buildDividerField({
              condition: (answers) =>
                hasFamilySelected(answers as HealthInsuranceDeclaration),
            }),
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
                    (
                      answers as HealthInsuranceDeclaration
                    ).period.dateFieldFrom,
                  ),
                  'dd.MM.yyyy',
                )} - ${format(
                  new Date(
                    (answers as HealthInsuranceDeclaration).period.dateFieldTo,
                  ),
                  'dd.MM.yyyy',
                )} `,
            }),
            buildDividerField({
              condition: (answers) =>
                (answers as HealthInsuranceDeclaration)
                  ?.studentOrTouristRadioFieldTourist === ApplicantType.STUDENT,
            }),
            buildKeyValueField({
              label: m.application.overview.residencyTitle,
              colSpan: '9/12',
              condition: (answers) =>
                (answers as HealthInsuranceDeclaration)
                  ?.studentOrTouristRadioFieldTourist === ApplicantType.STUDENT,
              value: ({ answers, externalData }) =>
                getCountryNameFromCode(
                  (answers as HealthInsuranceDeclaration)
                    .residencyStudentSelectField || '',
                  externalData,
                ),
            }),
            buildKeyValueField({
              label: m.application.overview.residencyTitle,
              colSpan: '9/12',
              condition: (answers) =>
                (answers as HealthInsuranceDeclaration)
                  ?.studentOrTouristRadioFieldTourist === ApplicantType.TOURIST,
              value: ({ answers, externalData }) =>
                getContinentNameFromCode(
                  (answers as HealthInsuranceDeclaration)
                    .residencyTouristRadioField || '',
                  externalData,
                ),
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.application.overview.fileUploadListTitle,
              colSpan: '9/12',
              condition: (answers) =>
                (answers as HealthInsuranceDeclaration)
                  ?.studentOrTouristRadioFieldTourist === ApplicantType.STUDENT,
              value: ({ answers }) =>
                (
                  answers as HealthInsuranceDeclaration
                ).educationConfirmationFileUploadField.map((file) => file.name),
            }),
            buildSubmitField({
              id: 'submit',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.application.overview.submitButtonText,
                  type: 'primary',
                },
              ],
              refetchApplicationAfterSubmit: true,
            }),
          ],
        }),
      ],
    }),
  ],
})
