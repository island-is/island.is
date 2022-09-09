import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const announcerInfo = buildSection({
  id: 'information',
  title: m.announcer,
  children: [
    buildMultiField({
      id: 'applicant',
      title: m.announcer,
      description: m.applicantsInfoSubtitle,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: m.name,
          readOnly: true,
          width: 'half',
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: m.nationalId,
          readOnly: true,
          width: 'half',
        }),
        buildTextField({
          id: 'applicant.address',
          title: m.address,
          readOnly: true,
          width: 'half',
        }),
        buildTextField({
          id: 'applicant.phone',
          title: m.phone,
          width: 'half',
        }),
        buildTextField({
          id: 'applicant.email',
          title: m.email,
          width: 'half',
        }),
      ],
    }),
  ],
})
