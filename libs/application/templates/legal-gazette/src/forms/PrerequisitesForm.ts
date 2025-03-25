import {
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
  buildMultiField,
  buildCheckboxField,
  buildDescriptionField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesDraft',
  title: 'Forkröfur',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      title: '', // If this is empty, we will not have a visible stepper on the right side of the screen.
      tabTitle: 'Forkröfur', // If there is no stepper, add tabTitle to have a title on the browser tab.
      children: [
        buildMultiField({
          id: 'prerequisites',
          title: 'Forkröfur',
          children: [
            buildDescriptionField({
              id: 'prerequisites',
              title: 'Forkröfur',
              description: 'Til að halda áfram þarftu að samþykkja skilyrði',
            }),
            buildCheckboxField({
              id: 'prerequisites',
              title: 'Ég hef lesið og samþykki skilyrðin',
              options: [
                { value: 'yes', label: 'Ég hef lesið og samþykki skilyrðin' },
              ],
            }),
            buildSubmitField({
              id: 'submit',
              title: 'Staðfesta',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: coreMessages.buttonSubmit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
