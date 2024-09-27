import {
  buildForm,
  buildMultiField,
  buildSection,
  buildMessageWithLinkButtonField,
  buildDescriptionField,
  buildImageField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { infer as zinfer } from 'zod'
import { dataSchema } from '../lib/dataSchema'
import { ManOnBenchIllustration } from '../../assets/ManOnBenchIllustration'
type Answers = zinfer<typeof dataSchema>

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
          children: [
            buildAlertMessageField({
              id: 'doneAlertMessage',
              title: '',
              message: (application: Application) => ({
                ...m.listSignedDescription,
                values: {
                  name: (application.answers as Answers).list.name,
                },
              }),
              alertType: 'success',
            }),
            buildImageField({
              id: 'doneImage',
              title: '',
              image: ManOnBenchIllustration,
              imageWidth: '50%',
              imagePosition: 'center',
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'containerGutter',
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              title: '',
              url: '/minarsidur/min-gogn/listar/althingis-medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
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
