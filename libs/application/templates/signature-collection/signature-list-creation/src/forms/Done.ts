import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildMessageWithLinkButtonField,
  coreMessages,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const Done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.COMPLETED,
  children: [
    /* Sections for the stepper */
    buildSection({
      id: 'screen1',
      title: m.dataCollection,
      children: [],
    }),
    buildSection({
      id: 'screen2',
      title: m.information,
      children: [],
    }),
    buildSection({
      id: 'screen3',
      title: m.overview,
      children: [],
    }),
    /* ------------------------ */
    buildSection({
      id: 'doneScreen',
      title: m.listCreated,
      children: [
        buildMultiField({
          id: 'doneScreen',
          title: m.listCreated,
          description: m.listCreatedDescription,
          children: [
            buildDescriptionField({
              id: 'nextStepsTitle',
              title: m.nextSteps,
              titleVariant: 'h3',
              marginBottom: 1,
            }),
            //Set up separately for even spacing
            buildDescriptionField({
              id: 'nextStepsDescription',
              title: '',
              description: m.nextStepsDescription,
              titleVariant: 'h3',
              marginBottom: 5,
            }),
            buildCustomField({
              id: 'doneScreen',
              title: 'test',
              component: 'ListCreated',
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              title: '',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'containerGutter',
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'containerGutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
