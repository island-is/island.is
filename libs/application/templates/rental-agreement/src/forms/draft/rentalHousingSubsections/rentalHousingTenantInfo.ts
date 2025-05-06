import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import {
  formatNationalId,
  formatPhoneNumber,
  IS_REPRESENTATIVE,
} from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import { tenantDetails } from '../../../lib/messages'

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
          editField: true,
          marginTop: 1,
          maxRows: 10,
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              required: true,
              searchCompanies: true,
            },
            phone: {
              component: 'phone',
              required: true,
              label: tenantDetails.phoneInputLabel,
              enableCountrySelector: true,
              width: 'half',
            },
            email: {
              component: 'input',
              required: true,
              label: tenantDetails.emailInputLabel,
              type: 'email',
              width: 'half',
            },
            address: {
              component: 'input',
              required: true,
              label: tenantDetails.addressInputLabel,
              maxLength: 100,
            },
            isRepresentative: {
              component: 'checkbox',
              label: tenantDetails.representativeLabel,
              large: true,
              options: [
                {
                  label: tenantDetails.representativeLabel,
                  value: IS_REPRESENTATIVE,
                },
              ],
            },
          },
          table: {
            format: {
              phone: (value) => value && formatPhoneNumber(value),
              nationalId: (value) => value && formatNationalId(value),
              isRepresentative: (value) =>
                value?.includes(IS_REPRESENTATIVE) ? '✅' : '',
            },
            header: [
              tenantDetails.nameInputLabel,
              tenantDetails.phoneInputLabel,
              tenantDetails.nationalIdHeaderLabel,
              tenantDetails.emailInputLabel,
              tenantDetails.isRepresentative,
            ],
            rows: ['name', 'phone', 'nationalId', 'email', 'isRepresentative'],
          },
        }),
      ],
    }),
  ],
})
