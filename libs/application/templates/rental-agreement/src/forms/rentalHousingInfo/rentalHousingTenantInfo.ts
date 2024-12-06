import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { formatNationalId, formatPhoneNumber } from '../../lib/utils'
import { IS_REPRESENTATIVE } from '../../lib/constants'
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
            nationalIdWithName: {
              component: 'nationalIdWithName',
              required: true,
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
              name: (value) => value,
              phone: (value) => value && formatPhoneNumber(value),
              nationalId: (value) => value && formatNationalId(value),
            },
            header: [
              tenantDetails.nameInputLabel,
              tenantDetails.phoneInputLabel,
              tenantDetails.nationalIdHeaderLabel,
              tenantDetails.emailInputLabel,
            ],
            rows: ['name', 'phone', 'nationalId', 'email'],
          },
          // TODO: Remove if not needed
          // getStaticTableData: (application) => {
          //   const name = getValueViaPath<string>(
          //     application.externalData,
          //     'nationalRegistry.data.fullName',
          //   ) as string

          //   const nationalId = getValueViaPath<string>(
          //     application.externalData,
          //     'nationalRegistry.data.nationalId',
          //   )

          //   const phone = getValueViaPath<string>(
          //     application.externalData,
          //     'userProfile.data.mobilePhoneNumber',
          //   ) as string

          //   const email = getValueViaPath<string>(
          //     application.externalData,
          //     'userProfile.data.email',
          //   )

          //   const userRole = application.answers.userRole as FormValue

          //   if (
          //     userRole.type === UserRole.TENANT &&
          //     name &&
          //     nationalId &&
          //     phone &&
          //     email
          //   ) {
          //     return [
          //       {
          //         name,
          //         phone,
          //         nationalId,
          //         email,
          //       },
          //     ]
          //   }

          //   return []
          // },
        }),
      ],
    }),
  ],
})
