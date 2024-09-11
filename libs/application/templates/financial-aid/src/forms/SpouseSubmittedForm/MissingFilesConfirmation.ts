import {
  buildCustomField,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Routes } from '../../lib/constants'
import * as m from '../../lib/messages'

export const MissingFilesConfirmation = buildSection({
  id: Routes.MISSINGFILESCONFIRMATION,
  title: m.missingFiles.confirmation.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSESTATUS,
      title: m.missingFiles.confirmation.sectionTitle,
      description: m.missingFiles.confirmation.subtitle,
      children: [
        buildCustomField(
          {
            id: Routes.SPOUSESTATUS,
            title: '',
            component: 'MissingFilesConfirmation',
          },
          { isSpouse: true },
        ),
        buildMessageWithLinkButtonField({
          id: 'goToServicePortal',
          title: '',
          url: '/minarsidur/umsoknir',
          buttonTitle: m.missingFiles.confirmation.openServicePortalButtonTitle,
          message: m.missingFiles.confirmation.openServicePortalMessageText,
          marginTop: 6,
        }),
      ],
    }),
  ],
})
