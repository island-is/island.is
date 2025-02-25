import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { SignatureCollectionList } from '@island.is/api/schema'

export const Done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  children: [
    /* Sections for the stepper */
    buildSection({
      id: 'screen1',
      title: m.intro,
      children: [],
    }),
    buildSection({
      id: 'screen2',
      title: m.dataCollection,
      children: [],
    }),
    buildSection({
      id: 'screen3',
      title: m.information,
      children: [],
    }),
    /* ------------------------ */
    buildSection({
      id: 'doneScreen',
      title: m.listSignedShort,
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
            buildCustomField({
              id: 'listSigned',
              component: 'ListSigned',
            }),
            buildDescriptionField({
              id: 'space',
              space: 'containerGutter',
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              title: 'Gott að vita',
              url: '/minarsidur/min-gogn/listar/medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
            }),
            buildDescriptionField({
              id: 'space1',
              space: 'containerGutter',
            }),
            buildDescriptionField({
              id: 'space2',
              space: 'containerGutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
