import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/utils/messages'
import { isProcure } from '../../../lib/utils/isProcure'

export const clientInfoProcureSection = buildSection({
  id: 'info',
  title: m.info,
  condition: (_answers, externalData) => {
    return isProcure(externalData)
  },
  children: [
    buildMultiField({
      id: 'about',
      title: m.info,
      description: m.candidateInfoProcure,
      children: [
        buildTextField({
          id: 'about.nationalId',
          title: m.candidateNationalId,
          width: 'half',
          format: '######-####',
        }),
        buildTextField({
          id: 'about.fullName',
          title: m.candidateFullName,
          width: 'half',
        }),
        buildTextField({
          id: 'about.email',
          title: m.email,
          width: 'half',
          variant: 'email',
        }),
        buildTextField({
          id: 'about.phoneNumber',
          title: m.phoneNumber,
          width: 'half',
          variant: 'tel',
          format: '###-####',
        }),
      ],
    }),
  ],
})
