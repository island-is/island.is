import {
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildSection,
  buildSelectField,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { RelationEnum } from '../../../types'

export const prePaidApplicant = buildSection({
  id: 'applicantsInformation',
  title: m.applicantsInfo,
  children: [
    buildMultiField({
      id: 'prePaidApplicant',
      title: m.applicantsInfo,
      description: m.applicantsPrePaidInfoSubtitle,
      children: [
        buildNationalIdWithNameField({
          id: 'prePaidApplicant',
          width: 'full',
          required: true,
        }),
        buildPhoneField({
          id: 'prePaidApplicant.phone',
          title: m.phone,
          width: 'half',
          required: true,
          enableCountrySelector: true,
        }),
        buildTextField({
          id: 'prePaidApplicant.email',
          title: m.email,
          width: 'half',
          required: true,
        }),
        buildSelectField({
          id: 'prePaidApplicant.relation',
          title: m.heirsRelation,
          width: 'half',
          required: true,
          options: [
            { label: m.heir, value: RelationEnum.HEIR },
            { label: m.representative, value: RelationEnum.REPRESENTATIVE },
            { label: m.grantor, value: RelationEnum.GRANTOR },
            { label: m.advocate, value: RelationEnum.ADVOCATE },
          ],
        }),
      ],
    }),
  ],
})
