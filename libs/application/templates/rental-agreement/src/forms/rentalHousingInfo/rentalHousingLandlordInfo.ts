import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import { formatNationalId } from '../../lib/utils'
import { landlordDetails } from '../../lib/messages'

export const RentalHousingLandlordInfo = buildSubSection({
  id: 'landlordInfo',
  title: landlordDetails.subSectionName,
  children: [
    buildMultiField({
      id: 'landlordInfo.multiField',
      title: landlordDetails.pageTitle,
      description: landlordDetails.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'landlordInfo.table',
          title: '',
          editField: true,
          marginTop: 1,
          maxRows: 10,
          fields: {
            name: {
              component: 'input',
              label: landlordDetails.nameInputLabel,
              width: 'half',
            },
            nationalId: {
              component: 'input',
              label: landlordDetails.nationalIdInputLabel,
              format: '######-####',
              width: 'half',
            },
            phone: {
              component: 'phone',
              label: landlordDetails.phoneInputLabel,
              enableCountrySelector: true,
              width: 'half',
            },
            email: {
              component: 'input',
              label: landlordDetails.emailInputLabel,
              type: 'email',
              width: 'half',
            },
            isRepresentative: {
              component: 'checkbox',
              label: landlordDetails.representativeLabel,
              large: true,
              options: [
                {
                  label: landlordDetails.representativeLabel,
                  value: YES,
                },
              ],
            },
          },
          table: {
            format: {
              isRepresentative: (value) => (value.includes(YES) ? 'Check' : ''),
              name: (value: string) => value,
              phone: (value: string) => value,
              nationalId: (value: string) => formatNationalId(value),
            },
            header: [
              landlordDetails.nameInputLabel,
              landlordDetails.phoneInputLabel,
              landlordDetails.nationalIdHeaderLabel,
              landlordDetails.emailInputLabel,
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
          //     userRole.type === UserRole.LANDLORD &&
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
