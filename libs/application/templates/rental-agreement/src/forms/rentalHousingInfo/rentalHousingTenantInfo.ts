import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { formatNationalId } from '../../lib/utils'
import { tenantDetails } from '../../lib/messages'
import { Routes } from '../../lib/constants'

export const RentalHousingTenantInfo = buildSubSection({
  id: Routes.TENANTINFORMATION,
  title: tenantDetails.subSectionName,
  children: [
    buildMultiField({
      id: Routes.TENANTINFORMATION,
      title: tenantDetails.pageTitle,
      description: tenantDetails.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'tenantInfo.table',
          title: '',
          editField: true,
          marginTop: 1,
          fields: {
            NationalIdWithName: {
              component: 'nationalIdWithName',
            },
            phone: {
              component: 'phone',
              label: tenantDetails.phoneInputLabel,
              enableCountrySelector: true,
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
              label: tenantDetails.representativeLabel,
              large: true,
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
              formatPhoneNumber: (value: string) => formatPhoneNumber(value),
              nationalId: (value: string) => formatNationalId(value),
            },
            header: [
              tenantDetails.nameInputLabel,
              tenantDetails.phoneInputLabel,
              tenantDetails.nationalIdHeaderLabel,
              tenantDetails.emailInputLabel,
            ],
            rows: ['name', 'phone', 'nationalId', 'email'],
          },
        }),
      ],
    }),
  ],
})
