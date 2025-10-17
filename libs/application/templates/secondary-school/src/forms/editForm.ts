import {
  buildAlertMessageField,
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { userInformationSection } from './secondarySchoolForm/userInformationSection'
import { schoolSection } from './secondarySchoolForm/schoolSection'
import { extraInformationSection } from './secondarySchoolForm/extraInformationSection'
import { MmsLogo } from '@island.is/application/assets/institution-logos'
import { conclusionSection } from './secondarySchoolForm/conclusionSection'
import { error, overview } from '../lib/messages'
import { getEndOfDayUTCDate, getFirstRegistrationEndDate } from '../utils'

// Note: This form is identical to SecondarySchoolForm, except added ABORT action in buildSubmitField and custom field HandleBeforeSubmitInEdit
export const Edit: Form = buildForm({
  id: 'SecondarySchoolForm',
  logo: MmsLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  renderLastScreenBackButton: true,
  children: [
    userInformationSection,
    schoolSection,
    extraInformationSection,
    buildSection({
      id: 'overviewSection',
      title: overview.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'overviewMultiField',
          title: overview.general.pageTitle,
          description: overview.general.description,
          children: [
            buildAlertMessageField({
              id: 'alertPastRegistrationEndDate',
              alertType: 'error',
              title: error.errorPastRegistrationDateTitle,
              message: error.errorPastRegistrationDateDescription,
              condition: (answers) => {
                return (
                  getEndOfDayUTCDate(getFirstRegistrationEndDate(answers)) <
                  new Date()
                )
              },
            }),
            buildCustomField({
              component: 'Overview',
              id: 'overview',
              description: '',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: (event) => {
                return event === DefaultEvents.ABORT
              },
              actions: [
                {
                  event: DefaultEvents.ABORT,
                  name: overview.buttons.abort,
                  type: 'rejectGhost',
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.buttons.reSubmit,
                  type: 'primary',
                },
              ],
            }),
            buildCustomField({
              component: 'HandleBeforeSubmitInEdit',
              id: 'handleBeforeSubmitInEdit',
              description: '',
            }),
          ],
        }),
      ],
    }),
    // Note: The conclusion section will appear after submit, but then on refresh the
    // conclusionForm is visible (overview)
    conclusionSection,
  ],
})
