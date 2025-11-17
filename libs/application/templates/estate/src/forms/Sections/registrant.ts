import {
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSelectField,
  buildTextField,
  buildCustomField,
} from '@island.is/application/core'
import { ApplicantRelation } from '../../lib/constants'
import { m } from '../../lib/messages'

export const registrant = buildSection({
  id: 'registrant',
  title: m.registrantTitle,
  children: [
    buildMultiField({
      id: 'applicant',
      title: m.registrantTitle,
      description: m.applicantsInfoSubtitle,
      children: [
        buildCustomField({
          id: 'applicant',
          component: 'LookupPerson',
        }),
        buildTextField({
          id: 'applicant.address',
          title: m.address,
          width: 'half',
          required: true,
        }),
        buildPhoneField({
          id: 'applicant.phone',
          title: m.phone,
          width: 'half',
          required: true,
          enableCountrySelector: true,
        }),
        buildTextField({
          id: 'applicant.email',
          title: m.email,
          width: 'half',
          required: true,
        }),
        buildSelectField({
          id: 'applicant.relation',
          title: m.applicantRelation,
          width: 'half',
          required: true,
          options: [
            {
              label: m.heir,
              value: ApplicantRelation.HEIR,
            },
            {
              label: m.representative,
              value: ApplicantRelation.REPRESENTATIVE,
            },
            {
              label: m.exchangeManager,
              value: ApplicantRelation.EXCHANGE_MANAGER,
            },
          ],
        }),
      ],
    }),
  ],
})
