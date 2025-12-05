import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionFiles = buildSubSection({
  id: 'filesStep',
  title: m.filesTitle,
  children: [
    buildMultiField({
      id: 'filesTitle',
      title: m.filesTitle,
      description: m.filesDescription,
      space: 2,
      children: [
        buildDescriptionField({
          id: 'selectMainRecipient',
          title: m.filesSelectMainRecipient,
          titleVariant: 'h3',
        }),
        buildCustomField(
          {
            title: m.certificateOfDeathAnnouncementTitle,
            description: m.certificateOfDeathAnnouncementDescription,
            id: 'certificateOfDeathAnnouncement',
            component: 'FilesRecipientCard',
          },
          {
            placeholder: m.certificateOfDeathAnnouncementPlaceholder,
          },
        ),
        buildCustomField(
          {
            title: m.authorizationForFuneralExpensesTitle,
            description: m.authorizationForFuneralExpensesDescription,
            id: 'authorizationForFuneralExpenses',
            component: 'FilesRecipientCard',
          },
          {
            placeholder: m.authorizationForFuneralExpensesPlaceholder,
          },
        ),
        buildCustomField(
          {
            title: m.financesDataCollectionPermissionTitle,
            description: m.financesDataCollectionPermissionDescription,
            id: 'financesDataCollectionPermission',
            component: 'FilesRecipientCard',
          },
          {
            placeholder: m.financesDataCollectionPermissionPlaceholder,
          },
        ),
        buildCustomField({
          id: 'filesValidation',
          component: 'FilesValidation',
          title: '',
        }),
      ],
    }),
  ],
})
