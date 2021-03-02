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
} from '@island.is/application/core'
import { NO, YES } from '../shared'
import { section } from '../lib/messages/application'
import { delimitation } from '../lib/messages/delimitation'
import { errorCards } from '../lib/messages/error'

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
