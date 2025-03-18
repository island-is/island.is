import {
  buildAlertMessageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const sectionDigitalLicenseInfo = buildSection({
  id: 'digitalLicenseInfo',
  title: m.digitalLicenseInfoTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.digitalLicenseInfoTitle,
      description: m.digitalLicenseInfoDescription,
      children: [
        buildAlertMessageField({
          id: 'digitalLicenseInfo',
          title: m.digitalLicenseInfoAlertTitle,
          message: m.digitalLicenseInfoAlertMessage,
          alertType: 'info',
        }),
      ],
    }),
  ],
})
