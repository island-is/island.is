import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildDescriptionField,
  Form,
  FormModes,
  buildCustomField,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const InReview: Form = buildForm({
  id: 'inReview',
  title: m.supremeCourt.steps,
  mode: FormModes.REVIEW,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: m.supremeCourt.step1,
      children: [
        buildMultiField({
          id: 'supremeMultiField',
          title: m.supremeCourt.title,
          description: m.supremeCourt.description,
          children: [
            buildCustomField({
              id: 'supremeCourtOverview',
              title: '',
              component: 'SupremeCourtOverview',
            }),
            buildTextField({
              id: 'reasonForReject',
              title: 'Athugasemdir',
              variant: 'textarea',
              backgroundColor: 'blue',
              rows: 6,
              defaultValue: () => '',
            }),
            buildSubmitField({
              id: 'submit',
              title: 'Submit',
              placement: 'footer',
              actions: [
                {
                  name: m.supremeCourt.rejectButton,
                  type: 'reject',
                  event: 'REJECT',
                },
                {
                  name: m.supremeCourt.approveButton,
                  type: 'primary',
                  event: 'APPROVE',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'endorsementsApproved',
          title: m.supremeCourt.approvedTitle,
          description: m.supremeCourt.approvedDescription,
        }),
      ],
    }),
  ],
})
