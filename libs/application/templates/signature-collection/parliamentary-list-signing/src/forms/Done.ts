import {
  buildForm,
  buildMultiField,
  buildSection,
  buildMessageWithLinkButtonField,
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
    /* ------------------------ */
    buildSection({
      id: 'doneScreen',
      title: m.listSigned,
      children: [
        buildMultiField({
          id: 'doneScreen',
          title: m.listSigned,
          description: m.listSignedDescription,
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
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              title: '',
              url: '/minarsidur/min-gogn/listar/medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
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
