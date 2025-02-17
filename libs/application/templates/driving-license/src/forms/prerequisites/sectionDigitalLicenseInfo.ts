import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { B_TEMP } from '../../lib/constants'

export const sectionDigitalLicenseInfo = buildSubSection({
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
          message: ({ answers }) =>
            answers.applicationFor === B_TEMP
              ? m.digitalLicenseInfoAlertMessageBTemp
              : m.digitalLicenseInfoAlertMessageBFull,
          alertType: 'info',
        }),
        buildDescriptionField({
          id: 'extraInfo',
          marginTop: 2,
          description: m.digitalLicenseInfoAlertMessageExtraInfo,
        }),
      ],
    }),
  ],
})
