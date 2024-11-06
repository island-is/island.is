import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { formatNationalId } from '../../lib/utils'

export const RentalHousingTenantInfo = buildSubSection({
  id: 'tenantInfo',
  title: m.tenantDetails.subSectionName,
  children: [
    buildMultiField({
      id: 'tenantInfo.multiField',
      title: m.tenantDetails.pageTitle,
      description: m.tenantDetails.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'tenantInfo.table',
          title: '',
          editField: true,
          marginTop: 1,
          fields: {
            name: {
              component: 'input',
              label: m.tenantDetails.nameInputLabel,
              width: 'half',
            },
            nationalId: {
              component: 'input',
              label: m.tenantDetails.nationalIdInputLabel,
              format: '######-####',
              width: 'half',
            },
            phone: {
              component: 'input',
              label: m.tenantDetails.phoneInputLabel,
              type: 'tel',
              format: '###-####',
              width: 'half',
            },
            email: {
              component: 'input',
              label: m.tenantDetails.emailInputLabel,
              type: 'email',
              width: 'half',
            },
            isRepresentative: {
              component: 'checkbox',
              large: true,
              displayInTable: false,
              label: m.tenantDetails.representativeLabel,
              options: [
                {
                  label: m.tenantDetails.representativeLabel,
                  value: YES,
                },
              ],
            },
          },
          table: {
            format: {
              phone: (value) => formatPhoneNumber(value),
              nationalId: (value) => formatNationalId(value),
            },
            header: [
              m.tenantDetails.nameInputLabel,
              m.tenantDetails.nationalIdHeaderLabel,
              m.tenantDetails.phoneInputLabel,
              m.tenantDetails.emailInputLabel,
            ],
          },
        }),
      ],
    }),
  ],
})
