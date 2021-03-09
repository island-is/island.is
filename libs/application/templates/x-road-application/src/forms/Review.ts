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
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from './messages'

export const Review: Form = buildForm({
  id: ApplicationTypes.X_ROAD,
  title: 'Úrvinnsla',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      title: 'Umsókn um aðild að Straumnum',
      children: [
        buildMultiField({
          id: 'general',
          title: '',
          children: [
            buildDividerField({ title: 'Stofnun' }),
            buildTextField({
              id: 'institution.institutionName',
              title: m.institutionName,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'institution.institutionSSN',
              title: m.institutionSSN,
              disabled: true,
              width: 'half',
              format: '######-####',
              placeholder: '000000-0000',
            }),

            buildDividerField({ title: 'Umsækjandi/rétthafi' }),
            buildTextField({
              id: 'applicant.contact',
              title: m.contactName,
              disabled: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.ssn',
              title: m.contactSsn,
              width: 'half',
              disabled: true,
              format: '######-####',
              placeholder: '000000-0000',
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.contactEmail,
              disabled: true,
              width: 'half',
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phone',
              title: m.contactPhone,
              disabled: true,
              width: 'half',
              variant: 'tel',
            }),
            buildCheckboxField({
              id: 'applicant.isValidApplicant',
              title: '',
              disabled: true,
              width: 'full',
              options: [
                {
                  value: 'isValidApplicant',
                  label: m.isValidApplicant,
                },
              ],
            }),
            buildDividerField({ title: 'Upplýsingar fyrir vefþjón' }),
            buildTextField({
              id: 'information.ipAddress',
              title: m.ipAddress,
              width: 'full',
            }),
            buildTextField({
              id: 'information.domainName',
              title: m.domainName,
              width: 'full',
            }),
            buildCheckboxField({
              id: 'confirmation.isTermsAccepted',
              title: '',
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
              title: m.reviewQuestion,
              placement: 'screen',
              actions: [
                { event: 'APPROVE', name: m.approveOption, type: 'primary' },
                { event: 'REJECT', name: m.declineOption, type: 'reject' },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk fyrir',
          description:
            'Úrvinnslu þinni er lokið. Umsókn er komin áfram í ferlinu.',
          // Vantar meiri upplýsingar
        }),
      ],
    }),
  ],
})
