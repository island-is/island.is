import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Application } from '@island.is/api/schema'

export const subSectionPhone = buildSubSection({
  id: 'phone',
  title: m.phoneNumberTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.phoneNumberTitle,
      space: 1,
      children: [
        buildDescriptionField({
          id: 'phoneNumberTitle',
          title: m.phoneNumberTitle,
          titleVariant: 'h4',
          description: m.phoneNumberDescription,
        }),
        buildPhoneField({
          id: 'phone',
          title: m.phoneNumberTitle,
          defaultValue: (application: Application) =>
            application.externalData.userProfile.data.mobilePhoneNumber ?? '',
        }),
      ],
    }),
  ],
})
