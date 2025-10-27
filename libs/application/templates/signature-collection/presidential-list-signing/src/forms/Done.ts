import {
  buildForm,
  buildImageField,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { NationalRegistryLogo } from '@island.is/application/assets/institution-logos'
import Jobs from '@island.is/application/templates/signature-collection/assets/Jobs'

export const Done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  logo: NationalRegistryLogo,
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
              image: Jobs,
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
