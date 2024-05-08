import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { newPrimarySchoolMessages } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const NewPrimarySchoolForm: Form = buildForm({
  id: 'newPrimarySchoolDraft',
  title: newPrimarySchoolMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: newPrimarySchoolMessages.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'TBD',
      title: 'TBD',
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: newPrimarySchoolMessages.confirm.overviewTitle,
      children: [
        buildSubSection({
          id: '',
          title: '',
          children: [
            buildMultiField({
              id: 'confirmation',
              title: '',
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'confirmationScreen',
                    title: newPrimarySchoolMessages.confirm.overviewTitle,
                    component: 'Review',
                  },
                  {
                    editable: true,
                  },
                ),
                buildSubmitField({
                  id: 'submit',
                  placement: 'footer',
                  title: newPrimarySchoolMessages.confirm.submitButton,
                  actions: [
                    {
                      event: DefaultEvents.SUBMIT,
                      name: newPrimarySchoolMessages.confirm.submitButton,
                      type: 'primary',
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: newPrimarySchoolMessages.conclusionScreen.alertTitle,
      expandableHeader:
        newPrimarySchoolMessages.conclusionScreen.nextStepsLabel,
      expandableDescription:
        newPrimarySchoolMessages.conclusionScreen.accordionText,
    }),
  ],
})
