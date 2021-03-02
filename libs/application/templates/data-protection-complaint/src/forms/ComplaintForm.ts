import {
  buildForm,
  buildDescriptionField,
  buildSection,
  Form,
  FormModes,
  buildRadioField,
  buildTextField,
  buildMultiField,
  buildRepeater,
  buildCustomField,
  FormValue,
  buildSubSection,
} from '@island.is/application/core'
import { NO, YES } from '../shared'
import { section, delimitation, errorCards, info } from '../lib/messages'
import { OnBehalf } from '../lib/dataSchema'

const yesOption = { value: 'yes', label: 'Já' }
const noOption = { value: 'no', label: 'Nei' }

export const ComplaintForm: Form = buildForm({
  id: 'DataProtectionComplaintForm',
  title: 'Atvinnuleysisbætur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'delimitation',
      title: section.delimitation.defaultMessage,
      children: [
        buildMultiField({
          id: 'delimitationFields',
          title: delimitation.general.pageTitle,
          description: delimitation.general.description,
          children: [
            buildRadioField({
              id: 'delimitation.inCourtProceedings',
              title: delimitation.labels.inCourtProceedings,
              options: [noOption, yesOption],
              largeButtons: true,
              width: 'half',
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'delimitation.inCourtProceedingsAlert',
              title: errorCards.inCourtProceedingsTitle,
              description: errorCards.inCourtProceedingsDescription,
              condition: (formValue) =>
                (formValue.delimitation as FormValue)?.inCourtProceedings ===
                YES,
            }),
            buildRadioField({
              id: 'delimitation.concernsMediaCoverage',
              title: delimitation.labels.concernsMediaCoverage,
              options: [noOption, yesOption],
              largeButtons: true,
              width: 'half',
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'delimitation.concernsMediaCoverageAlert',
              title: errorCards.concernsMediaCoverageTitle,
              description: errorCards.concernsMediaCoverageDescription,
              condition: (formValue) =>
                (formValue.delimitation as FormValue)?.concernsMediaCoverage ===
                YES,
            }),
            buildRadioField({
              id: 'delimitation.concernsBanMarking',
              title: delimitation.labels.concernsBanMarking,
              options: [noOption, yesOption],
              largeButtons: true,
              width: 'half',
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'delimitation.concernsBanMarkingAlert',
              title: errorCards.concernsBanMarkingTitle,
              description: errorCards.concernsBanMarkingDescription,
              condition: (formValue) =>
                (formValue.delimitation as FormValue)?.concernsBanMarking ===
                YES,
            }),
            buildRadioField({
              id: 'delimitation.concernsLibel',
              title: delimitation.labels.concernsLibel,
              options: [noOption, yesOption],
              largeButtons: true,
              width: 'half',
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'delimitation.concernsLibelAlert',
              title: errorCards.concernsLibelTitle,
              description: errorCards.concernsLibelDescription,
              condition: (formValue) =>
                (formValue.delimitation as FormValue)?.concernsLibel === YES,
            }),
            buildRadioField({
              id: 'delimitation.concernsPersonalLettersOrSocialMedia',
              title: delimitation.labels.concernsPersonalLettersOrSocialMedia,
              options: [noOption, yesOption],
              largeButtons: true,
              width: 'half',
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'delimitation.concernsPersonalLettersOrSocialMediaAlert',
              title: errorCards.concernsPersonalLettersOrSocialMediaTitle,
              description:
                errorCards.concernsPersonalLettersOrSocialMediaDescription,
              condition: (formValue) =>
                (formValue.delimitation as FormValue)
                  ?.concernsPersonalLettersOrSocialMedia === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: section.info.defaultMessage,
      children: [
        buildSubSection({
          id: 'type',
          title: section.onBehalf.defaultMessage,
          children: [
            buildMultiField({
              id: 'onBehalfFields',
              title: info.general.pageTitle,
              description: info.general.description,
              children: [
                buildRadioField({
                  id: 'info.onBehalf',
                  title: '',
                  options: [
                    { value: OnBehalf.MYSELF, label: info.labels.myself },
                    {
                      value: OnBehalf.MYSELF_AND_OR_OTHERS,
                      label: info.labels.myselfAndOrOthers,
                    },
                    { value: OnBehalf.COMPANY, label: info.labels.company },
                    {
                      value: OnBehalf.ORGANIZATION_OR_INSTITUTION,
                      label: info.labels.organizationInstitution,
                    },
                  ],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField({
                  component: 'FieldAlertMessage',
                  id: 'info.onBehalfOfACompanyAlertMessage',
                  title: errorCards.onBehalfOfACompanyTitle,
                  description: errorCards.onBehalfOfACompanyDescription,
                  condition: (formValue) => {
                    console.log(formValue)
                    return (
                      (formValue.info as FormValue)?.onBehalf ===
                      OnBehalf.COMPANY
                    )
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'last',
      title: 'Búinn skref',
      children: [
        buildDescriptionField({
          id: 'field',
          title: "I guess the journey's never really over",
          description: (application) => ({
            defaultMessage: 'Done',
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            values: { name: application.answers.name },
          }),
        }),
      ],
    }),
  ],
})
