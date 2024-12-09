import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { examinee, shared } from '../../../lib/messages'
import { getAllCountryCodes } from '@island.is/shared/utils'

export const examineeSection = buildSection({
  id: 'examineeSection',
  title: examinee.general.sectionTitle,
  children: [
    buildMultiField({
      title: examinee.general.pageTitle,
      id: 'examineesMultiField',
      description: examinee.general.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'examinees',
          title: '',
          fields: {
            nationalId: {
              component: 'nationalIdWithName',
              label: shared.labels.ssn,
            },
            email: {
              component: 'input',
              label: shared.labels.email,
              width: 'half',
              type: 'email',
            },
            phone: {
              component: 'input',
              label: shared.labels.phone,
              type: 'tel',
              format: '###-####',
              placeholder: '000-0000',
              width: 'half',
            },
            licenseNumber: {
              component: 'input',
              label: examinee.labels.licenceNumber,
              width: 'half',
              displayInTable: false,
            },
            countryIssuer: {
              component: 'select',
              label: examinee.labels.countryIssuer,
              placeholder: examinee.labels.pickCountry,
              width: 'half',
              displayInTable: false,
              options: getAllCountryCodes().map((country) => ({
                label: country.name,
                value: country.name,
              })),
            },
          },
          table: {
            format: {
              nationalId: (value) => `${value.slice(0, 6)}-${value.slice(6)}`,
              phone: (value) => `${value.slice(0, 3)}-${value.slice(3)}`,
            },
          },
        }),
        buildCustomField({
          id: '',
          title: '',
          component: 'ExamineeValidation',
        }),
      ],
    }),
  ],
})
