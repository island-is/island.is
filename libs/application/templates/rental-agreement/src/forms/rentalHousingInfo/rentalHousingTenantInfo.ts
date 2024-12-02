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
              isRepresentative: (value) =>
                value.includes(YES) ? 'Umboðsaðili' : '',
              name: (value: string) => value,
              phone: (value) => formatPhoneNumber(value),
              nationalId: (value) => formatNationalId(value),
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
