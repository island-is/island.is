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
              condition: (_, externalData) =>
                getValueViaPath(
                  externalData,
                  'delegatedToCompany.data.delegatedToCompany',
                ) === false,
              id: 'done.goToServicePortal',
              url: '/minarsidur/min-gogn/listar/althingis-medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
            }),
            buildMessageWithLinkButtonField({
              condition: (_, externalData) =>
                getValueViaPath(
                  externalData,
                  'delegatedToCompany.data.delegatedToCompany',
                ) === true,
              id: 'done.goToServicePortalCompany',
              url: '/minarsidur/fyrirtaeki/listar/althingis-medmaelasofnun',
              buttonTitle: m.linkFieldButtonCompanyTitle,
              message: m.linkFieldCompanyMessage,
              marginBottom: 'containerGutter',
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
