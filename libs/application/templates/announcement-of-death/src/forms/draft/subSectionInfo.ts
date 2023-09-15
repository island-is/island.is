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
          defaultValue: (application: Application) => {
            const applicantRelation =
              application.externalData?.syslumennOnEntry?.data?.estate?.estateMembers?.find(
                (em: any) => em.nationalId === application.applicant,
              )
            return applicantRelation?.relation ?? ''
          },
          options: ({
            externalData: {
              syslumennOnEntry: { data },
            },
          }) => {
            return (data as { relationOptions: string[] }).relationOptions?.map(
              (relation) => ({
                value: relation,
                label: relation,
              }),
            )
          },
        }),
      ],
    }),
  ],
})
