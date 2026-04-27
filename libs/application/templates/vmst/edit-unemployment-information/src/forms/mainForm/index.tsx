import {
  buildForm,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { application as applicationMessages } from '../../lib/messages'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  logo: DirectorateOfLabourLogo,
  title: applicationMessages.pageTitle,
  children: [
    buildMultiField({
      id: 'mainMultiField',
      children: [
        buildDescriptionField({
          id: 'mainFormTitle',
          title: applicationMessages.pageTitle,
          description: applicationMessages.pageDescription,
        }),
        buildCustomField({
          id: 'mainForm',
          component: 'AccordionFields',
        }),
        buildSubmitField({
          id: 'submit',
          title: applicationMessages.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: applicationMessages.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
