import {
  buildForm,
  buildMultiField,
  buildSection,
  buildMessageWithLinkButtonField,
  buildDescriptionField,
  buildCopyLinkField,
  getValueViaPath,
  buildImageField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import Logo from '@island.is/application/templates/signature-collection/assets/Logo'
import Jobs from '@island.is/application/templates/signature-collection/assets/Jobs'

export const Done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  logo: Logo,
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
              image: Jobs,
              imageWidth: 'auto',
              imagePosition: 'center',
              marginTop: 'none',
            }),
            buildDescriptionField({
              id: 'nextStepsDescription',
              description: m.nextStepsDescription,
              titleVariant: 'h4',
              marginBottom: 5,
            }),
            buildCopyLinkField({
              id: 'copyLink',
              link: ({ externalData }) => {
                const slug =
                  getValueViaPath(externalData, 'createLists.data.slug') ??
                  'https://island.is/'
                return `${document.location.origin}${slug}`
              },
              semiBoldLink: true,
              marginBottom: 'none',
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              url: '/minarsidur/min-gogn/listar/medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
              marginBottom: 'containerGutter',
              messageColor: 'blue600',
            }),
            buildDescriptionField({
              id: 'space',
              space: 'containerGutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
