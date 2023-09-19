import {
  buildCustomField,
  buildDividerField,
  buildFileUploadField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  buildSelectField,
  buildAlertMessageField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  Comparators,
  FormValue,
} from '@island.is/application/types'
import { m } from './messages'
import { YES, NO, FILE_SIZE_LIMIT, StatusTypes } from '../shared'
import Logo from '../assets/Logo'
import {
  requireConfirmationOfResidency,
  requireWaitingPeriod,
} from '../healthInsuranceUtils'
import { Countries } from '../lib/Countries'
import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'

export const HealthInsuranceForm: Form = buildForm({
  id: 'HealthInsuranceDraft',
  title: m.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.applicantInfoSection,
      children: [applicantInformationMultiField()],
    }),
    buildSection({
      id: 'statusAndChildrenSection',
      title: m.statusAndChildren,
      children: [
        buildMultiField({
          id: 'statusAndChildren',
          title: m.statusAndChildren,
          children: [
            buildCustomField({
              id: 'citizenship',
              title: '',
              component: 'CitizenshipField',
            }),
            buildRadioField({
              id: 'status.type',
              title: '',
              description: m.statusDescription,
              width: 'half',
              required: true,
              largeButtons: true,
              options: [
                {
                  label: m.statusEmployed,
                  value: StatusTypes.EMPLOYED,
                  tooltip: m.statusEmployedInformation,
                },
                {
                  label: m.statusStudent,
                  value: StatusTypes.STUDENT,
                  tooltip: m.statusStudentInformation,
                },
                {
                  label: m.statusPensioner,
                  value: StatusTypes.PENSIONER,
                  tooltip: m.statusPensionerInformation,
                },
                {
                  label: m.statusOther,
                  value: StatusTypes.OTHER,
                  tooltip: m.statusOtherInformation,
                },
              ],
            }),
            buildDescriptionField({
              id: 'confirmationOfStudiesDescription',
              title: '',
              description: m.confirmationOfStudies,
              tooltip: m.confirmationOfStudiesTooltip,
              condition: (answers) =>
                (answers.status as { type: string })?.type ===
                StatusTypes.STUDENT,
            }),
            buildFileUploadField({
              id: 'status.confirmationOfStudies',
              title: '',
              introduction: '',
              maxSize: FILE_SIZE_LIMIT,
              uploadHeader: m.fileUploadHeader,
              uploadDescription: m.fileUploadDescription,
              uploadButtonLabel: m.fileUploadButton,
              condition: (answers) =>
                (answers.status as { type: string })?.type ===
                StatusTypes.STUDENT,
            }),
            buildRadioField({
              id: 'children',
              title: '',
              description: m.childrenDescription,
              width: 'half',
              largeButtons: true,
              required: true,
              options: [
                { label: m.noOptionLabel, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
            }),
            buildCustomField({
              id: 'childrenInfo',
              title: '',
              component: 'ChildrenInfoMessage',
              condition: (answers) => answers.children === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'formerInsuranceSection',
      title: m.formerInsuranceSection,
      children: [
        buildMultiField({
          id: 'formerInsurance',
          title: m.formerInsuranceTitle,
          children: [
            buildRadioField({
              id: 'formerInsurance.registration',
              title: '',
              description: m.formerInsuranceRegistration,
              largeButtons: true,
              required: true,
              options: [
                { label: m.formerInsuranceNoOption, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
            }),
            buildSelectField({
              id: 'formerInsurance.country',
              title: m.formerInsuranceCountry,
              description: m.formerInsuranceDetails,
              placeholder: m.formerInsuranceCountryPlaceholder,
              required: true,
              backgroundColor: 'blue',
              options: Countries.map(({ name, alpha2Code: countryCode }) => {
                const option = { name, countryCode }
                return {
                  label: name,
                  value: JSON.stringify(option),
                }
              }),
            }),
            buildTextField({
              id: 'formerInsurance.personalId',
              title: m.formerPersonalId,
              width: 'half',
              backgroundColor: 'blue',
              required: true,
            }),
            buildTextField({
              id: 'formerInsurance.institution',
              title: m.formerInsuranceInstitution,
              width: 'half',
              backgroundColor: 'blue',
              required: true,
            }),
            buildAlertMessageField({
              id: 'waitingPeriodInfo',
              title: m.waitingPeriodTitle,
              message: m.waitingPeriodDescription,
              alertType: 'error',
              condition: (answers: FormValue) => {
                const formerCountry = (
                  answers as {
                    formerInsurance: { country: string }
                  }
                )?.formerInsurance?.country
                const citizenship = (
                  answers as {
                    citizenship: string
                  }
                )?.citizenship
                return (
                  !!formerCountry &&
                  requireWaitingPeriod(formerCountry, citizenship)
                )
              },
            }),
            buildFileUploadField({
              id: 'formerInsurance.confirmationOfResidencyDocument',
              title: '',
              maxSize: FILE_SIZE_LIMIT,
              introduction: m.confirmationOfResidencyFileUpload,
              uploadHeader: m.fileUploadHeader,
              uploadDescription: m.fileUploadDescription,
              uploadButtonLabel: m.fileUploadButton,
              condition: (answers: FormValue) => {
                const formerCountry = (
                  answers as {
                    formerInsurance: { country: string }
                  }
                )?.formerInsurance?.country
                return requireConfirmationOfResidency(formerCountry)
              },
            }),
            buildDividerField({
              title: ' ',
              color: 'transparent',
            }),
            buildDescriptionField({
              id: 'formerInsurance.entitlementDescription',
              title: '',
              description: m.formerInsuranceEntitlement,
              tooltip: m.formerInsuranceEntitlementTooltip,
              condition: (answers: FormValue) => {
                const formerCountry = (
                  answers as {
                    formerInsurance: { country: string }
                  }
                )?.formerInsurance?.country
                const citizenship = (
                  answers as {
                    citizenship: string
                  }
                )?.citizenship
                return !requireWaitingPeriod(formerCountry, citizenship)
              },
            }),
            buildRadioField({
              id: 'formerInsurance.entitlement',
              title: '',
              width: 'half',
              largeButtons: true,
              options: [
                { label: m.noOptionLabel, value: NO },
                { label: m.yesOptionLabel, value: YES },
              ],
              condition: (answers: FormValue) => {
                const formerCountry = (
                  answers as {
                    formerInsurance: { country: string }
                  }
                )?.formerInsurance?.country
                const citizenship = (
                  answers as {
                    citizenship: string
                  }
                ).citizenship
                return !requireWaitingPeriod(formerCountry, citizenship)
              },
            }),
            buildTextField({
              id: 'formerInsurance.entitlementReason',
              title: m.formerInsuranceAdditionalInformation,
              placeholder: m.formerInsuranceAdditionalInformationPlaceholder,
              variant: 'textarea',
              rows: 4,
              backgroundColor: 'blue',
              condition: (answers: FormValue) => {
                const formerCountry = (
                  answers as {
                    formerInsurance: { country: string }
                  }
                )?.formerInsurance?.country
                const citizenship = (
                  answers as {
                    citizenship: string
                  }
                )?.citizenship
                return !requireWaitingPeriod(formerCountry, citizenship)
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: m.confirmationSection,
      children: [
        buildMultiField({
          id: '',
          title: m.confirmationTitle,
          children: [
            buildCustomField({
              id: 'review',
              title: '',
              component: 'Review',
            }),
            buildRadioField({
              id: 'hasAdditionalInfo',
              title: '',
              description: m.additionalInfo,
              largeButtons: true,
              width: 'half',
              options: [
                { value: NO, label: m.noOptionLabel },
                { value: YES, label: m.yesOptionLabel },
              ],
            }),
            buildTextField({
              id: 'additionalRemarks',
              title: m.additionalRemarks,
              variant: 'textarea',
              rows: 4,
              placeholder: m.additionalRemarksPlaceholder,
              backgroundColor: 'blue',
              condition: {
                questionId: 'hasAdditionalInfo',
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
            buildFileUploadField({
              id: 'additionalFiles',
              title: '',
              introduction: '',
              maxSize: FILE_SIZE_LIMIT,
              uploadHeader: m.fileUploadHeader,
              uploadDescription: m.fileUploadDescription,
              uploadButtonLabel: m.fileUploadButton,
              condition: {
                questionId: 'hasAdditionalInfo',
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
            buildDividerField({
              title: ' ',
              color: 'transparent',
              condition: {
                questionId: 'hasAdditionalInfo',
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
            buildCustomField({
              id: 'confirmCorrectInfo',
              title: '',
              component: 'ConfirmCheckbox',
            }),
            buildSubmitField({
              id: 'submit',
              title: m.submitLabel,
              placement: 'footer',
              actions: [
                { event: 'SUBMIT', name: m.submitLabel, type: 'primary' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: m.successfulSubmissionTitle,
      alertMessage: m.successfulSubmissionMessage,
      expandableHeader: m.successfulExpendableHeader,
      expandableDescription: m.nextStepReviewTime,
    }),
  ],
})
