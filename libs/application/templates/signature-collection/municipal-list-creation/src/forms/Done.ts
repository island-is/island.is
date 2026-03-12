import {
  buildForm,
  buildMultiField,
  buildSection,
  buildMessageWithLinkButtonField,
  buildDescriptionField,
  buildImageField,
  buildCopyLinkField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
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
          title: m.listCreated,
          description: m.listCreatedDescription,
          children: [
            buildImageField({
              id: 'doneImage',
              image: ClipboardAndPencil,
              imageWidth: 'auto',
              imagePosition: 'center',
              marginTop: 'none',
            }),
            buildDescriptionField({
              id: 'nextStepsTitle',
              description: m.nextStepsDescription,
              titleVariant: 'h4',
              marginBottom: 'gutter',
            }),
            buildCopyLinkField({
              id: 'copyLink',
              link: ({ externalData }) => {
                const slug =
                  getValueViaPath(externalData, 'submit.data.slug') ??
                  'https://island.is/'
                return `${document.location.origin}${slug}`
              },
              semiBoldLink: true,
              marginBottom: 'none',
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              url: '/minarsidur/min-gogn/listar/sveitarstjornar-medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
              messageColor: 'blue600',
              marginBottom: 'containerGutter',
            }),
            buildDescriptionField({
              id: 'doneScreenBottomSpace',
              space: 'containerGutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
