import {
  buildMultiField,
  buildSelectField,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { RelationEnum } from '../../types'
import { Application } from '../../types/schema'

export const subSectionInfo = buildSubSection({
  id: 'infoStep',
  title: m.announcementTitle,
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
          format: '###-####',
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
            // TODO: Get value
            {
              value: RelationEnum.CHILD,
              label: 'Barn',
            },
            {
              value: RelationEnum.PARENT,
              label: 'Foreldri',
            },
            {
              value: RelationEnum.SIBLING,
              label: 'Systkini',
            },
            {
              value: RelationEnum.SPOUSE,
              label: 'Maki',
            },
          ],
        }),
      ],
    }),
  ],
})
