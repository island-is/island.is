import {
  buildForm,
  buildImageField,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { NationalElectoralCommissionLogo } from '@island.is/application/assets/institution-logos'
import { ClipboardAndPencil } from '@island.is/application/assets/graphics'

export const Done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  logo: NationalElectoralCommissionLogo,
  children: [
    buildSection({
      id: 'doneScreen',
      children: [
        buildMultiField({
          id: 'doneScreen',
          title: m.listSigned,
          description: (application: Application) => ({
            ...m.listSignedDescription,
            values: {
              name: application.answers.candidateName,
            },
          }),
          children: [
            buildImageField({
              id: 'doneImage',
              image: ClipboardAndPencil,
              imageWidth: 'auto',
              imagePosition: 'center',
              marginTop: 'none',
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              url: '/minarsidur/min-gogn/listar/medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
              messageColor: 'blue600',
              marginBottom: 'containerGutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
