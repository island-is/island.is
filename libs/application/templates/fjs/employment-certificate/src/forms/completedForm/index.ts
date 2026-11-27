import {
  buildAlertMessageField,
  buildCustomField,
  buildForm,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { FjarsyslaRikisinsLogo } from '@island.is/application/assets/institution-logos'
import { conclusion as m, sections } from '../../lib/messages'
import { MAILBOX_PATH } from '../../utils/constants'
import { buildWhatNextField } from '../whatNextField'

export const CompletedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  logo: FjarsyslaRikisinsLogo,
  children: [
    buildSection({
      id: 'conclusion',
      title: sections.conclusion,
      children: [
        buildMultiField({
          id: 'conclusionMultiField',
          title: m.title,
          children: [
            buildAlertMessageField({
              id: 'sentAlert',
              alertType: 'success',
              title: m.sentTitle,
              message: m.sentMessage,
            }),
            buildCustomField({
              id: 'certificateLink',
              component: 'CertificateLink',
              doesNotRequireAnswer: true,
            }),
            buildWhatNextField(),
            buildMessageWithLinkButtonField({
              id: 'mailboxLink',
              url: MAILBOX_PATH,
              message: m.mailboxMessage,
              buttonTitle: m.mailboxButton,
              marginTop: 4,
            }),
          ],
        }),
      ],
    }),
  ],
})
