import {
  buildForm,
  buildMultiField,
  buildSection,
  buildMessageWithLinkButtonField,
  buildDescriptionField,
  buildImageField,
  buildAlertMessageField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import Jobs from '@island.is/application/templates/signature-collection/assets/Jobs'

export const Done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'doneScreen',
      children: [
        buildMultiField({
          id: 'doneScreen',
          title: m.listSigned,
          children: [
            buildAlertMessageField({
              id: 'doneAlertMessage',
              message: ({ answers }: Application) => ({
                ...m.listSignedDescription,
                values: {
                  name: getValueViaPath(answers, 'list.name'),
                },
              }),
              alertType: 'success',
            }),
            buildImageField({
              id: 'doneImage',
              image: Jobs,
              imageWidth: 'auto',
              imagePosition: 'center',
              marginBottom: 'none',
              marginTop: 'none',
            }),
            buildDescriptionField({
              id: 'space',
              space: 'containerGutter',
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              url: '/minarsidur/min-gogn/listar/althingis-medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
            }),
            buildDescriptionField({
              id: 'space1',
              space: 'containerGutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
