import {
  buildMultiField,
  buildSelectField,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Application } from '../../types/schema'

export const subSectionInfo = buildSubSection({
  id: 'infoStep',
  title: 'Tilkynnandi',
  children: [
    buildMultiField({
      id: 'announcement',
      title: m.announcementTitle,
      description: m.announcementDescription,
      space: 1,
      children: [
        buildTextField({
          id: 'applicantName',
          title: m.applicantsName,
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.fullName ?? '',
        }),
        buildTextField({
          id: 'applicantPhone',
          title: m.applicantsPhoneNumber,
          placeholder: '',
          width: 'half',
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.mobilePhoneNumber ??
            '',
        }),
        buildTextField({
          id: 'applicantEmail',
          title: m.applicantsEmail,
          placeholder: '',
          width: 'half',
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email ?? '',
        }),
        buildSelectField({
          id: 'applicantRelation',
          title: m.applicantsRelation,
          placeholder: m.applicantsRelationPlaceholder,
          width: 'half',
          options: [
            {
              label: 'Option 1',
              value: 'Option 1',
            },
            {
              label: 'Option 2',
              value: 'Option 2',
            },
            {
              label: 'Option 3',
              value: 'Option 3',
            },
          ],
        }),
      ],
    }),
  ],
})
