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
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const InReview: Form = buildForm({
  id: 'inReview',
  title: m.ministryOfJustice.steps,
  mode: FormModes.REVIEW,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: m.ministryOfJustice.step1,
      children: [
        buildMultiField({
          id: 'ministryMultiField',
          title: m.ministryOfJustice.title,
          description: m.ministryOfJustice.description,
          children: [
            buildCustomField({
              id: 'ministryOverview',
              title: '',
              component: 'MinistryOfJusticeOverview',
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
                  name: m.ministryOfJustice.rejectButton,
                  type: 'reject',
                  event: DefaultEvents.REJECT,
                },
                {
                  name: m.ministryOfJustice.approveButton,
                  type: 'primary',
                  event: DefaultEvents.APPROVE,
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'endorsementsApproved',
          title: m.ministryOfJustice.approvedTitle,
          description: m.ministryOfJustice.approvedDescription,
        }),
      ],
    }),
  ],
})
