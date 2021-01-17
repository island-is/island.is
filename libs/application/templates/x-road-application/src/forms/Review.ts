import {
  buildForm,
  buildMultiField,
  buildSection,
  buildRadioField,
  buildCheckboxField,
  buildTextField,
  Form,
  ApplicationTypes,
  FormValue,
  buildDividerField,
  buildSubmitField,
  FormModes,
  buildCustomField,
  buildIntroductionField,
} from '@island.is/application/core'
import { m } from './messages'

export const Review: Form = buildForm({
  id: ApplicationTypes.META_APPLICATION,
  name: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      name: 'Umsókn um aðild að Straumnum',
      children: [
        buildMultiField({
          id: 'general',
          name: '',
          children: [
            buildDividerField({ name: 'Stofnun' }),
            buildTextField({
              id: 'institution.institutionName',
              name: m.institutionName,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'institution.institutionSSN',
              name: m.institutionSSN,
              disabled: true,
              width: 'half',
              format: '######-####',
              placeholder: '000000-0000',
            }),

            buildDividerField({ name: 'Umsækjandi/rétthafi' }),
            buildTextField({
              id: 'applicant.contact',
              name: m.contactName,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.ssn',
              name: m.contactSsn,
              width: 'half',
              disabled: true,
              format: '######-####',
              placeholder: '000000-0000',
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.contactEmail,
              disabled: true,
              width: 'half',
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phone',
              name: m.contactPhone,
              disabled: true,
              width: 'half',
              variant: 'tel',
            }),
            buildCheckboxField({
              id: 'applicant.isValidApplicant',
              name: '',
              disabled: true,
              width: 'full',
              options: [
                {
                  value: 'isValidApplicant',
                  label: m.isValidApplicant,
                },
              ],
            }),
            buildDividerField({ name: 'Tengiliðir' }),
            buildCustomField({
              id: 'technicalContact',
              name: m.technicalContact,
              component: 'ContactTable',
            }),
            buildCustomField({
              id: 'businessContact',
              name: m.businessContact,
              component: 'ContactTable',
            }),
            buildCheckboxField({
              id: 'confirmation.isTermsAccepted',
              name: '',
              width: 'full',
              disabled: true,
              options: [
                {
                  value: 'isTermsAccepted',
                  label: m.acceptTerms,
                },
              ],
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              name: m.reviewQuestion,
              placement: 'screen',
              actions: [
                { event: 'APPROVE', name: m.approveOption, type: 'primary' },
                { event: 'REJECT', name: m.declineOption, type: 'reject' },
              ],
            }),
          ],
        }),
        buildIntroductionField({
          id: 'final',
          name: 'Takk fyrir',
          introduction:
            'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
        }),
      ],
    }),
  ],
})
