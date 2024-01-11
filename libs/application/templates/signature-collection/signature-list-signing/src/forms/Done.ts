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
import { SignatureCollectionCandidate } from '@island.is/api/schema'

export const Done: Form = buildForm({
  id: 'done',
  title: '',
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
      title: m.listSigned,
      children: [
        buildMultiField({
          id: 'doneScreen',
          title: m.listSigned,
          description: (application: Application) => ({
            ...m.listSignedDescription,
            values: {
              name: (
                application.answers.candidate as SignatureCollectionCandidate
              )?.name,
            },
          }),
          children: [
            buildCustomField({
              id: 'listSigned',
              title: '',
              component: 'ListSigned',
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'containerGutter',
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
              title: 'Gott að vita',
              url: '/minarsidur/min-gogn/listar',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'containerGutter',
            }),
            buildDescriptionField({
              id: 'space2',
              title: '',
              space: 'containerGutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
