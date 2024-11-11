import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { formatNationalId } from '../../lib/utils'
import { tenantDetails } from '../../lib/messages'

export const RentalHousingTenantInfo = buildSubSection({
  id: 'tenantInfo',
  title: tenantDetails.subSectionName,
  children: [
    buildMultiField({
      id: 'tenantInfo.multiField',
      title: tenantDetails.pageTitle,
      description: tenantDetails.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'tenantInfo.table',
          title: '',
          editField: true,
          marginTop: 1,
          fields: {
            name: {
              component: 'input',
              label: tenantDetails.nameInputLabel,
              width: 'half',
            },
            nationalId: {
              component: 'input',
              label: tenantDetails.nationalIdInputLabel,
              format: '######-####',
              width: 'half',
            },
            phone: {
              component: 'input',
              label: tenantDetails.phoneInputLabel,
              type: 'tel',
              format: '###-####',
              width: 'half',
            },
            email: {
              component: 'input',
              label: tenantDetails.emailInputLabel,
              type: 'email',
              width: 'half',
            },
            isRepresentative: {
              component: 'checkbox',
              large: true,
              displayInTable: false,
              label: tenantDetails.representativeLabel,
              options: [
                {
                  label: tenantDetails.representativeLabel,
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
              tenantDetails.nameInputLabel,
              tenantDetails.nationalIdHeaderLabel,
              tenantDetails.phoneInputLabel,
              tenantDetails.emailInputLabel,
            ],
          },
        }),
      ],
    }),
  ],
})
