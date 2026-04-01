import {
  buildForm,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubmitField,
  buildHiddenInput,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, FormModes } from '@island.is/application/types'
import { application as applicationMessages } from '../../lib/messages'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
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
        buildHiddenInput({
          id: 'otherAddress.currentAddressIsDifferent',
          defaultValue: (application: Application) => {
            const currentAddressIsDifferent = getValueViaPath<string>(
              application.externalData,
              'currentApplicationInformation.data.currentApplication.currentAddressIsDifferent',
            )
            return currentAddressIsDifferent === 'true' ? 'true' : 'false'
          },
        }),
        buildSubmitField({
          id: 'submit',
          title: 'todo submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'TODO submit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
