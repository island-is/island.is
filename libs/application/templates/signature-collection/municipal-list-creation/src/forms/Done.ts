import {
  buildForm,
  buildMultiField,
  buildSection,
  buildMessageWithLinkButtonField,
  buildDescriptionField,
  buildImageField,
  buildCopyLinkField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import Jobs from '../../assets/Jobs'
import Logo from '../../assets/Logo'

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
              id: 'nextStepsTitle',
              description: m.nextStepsDescription,
              titleVariant: 'h4',
              marginBottom: 'gutter',
            }),
            buildCopyLinkField({
              id: 'copyLink',
              // Todo: update link when available
              link: 'island.is',
              title: '',
              marginBottom: 'none'
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              url: '/minarsidur/min-gogn/listar/',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
              messageColor: 'blue600',
              marginBottom: "containerGutter"
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
