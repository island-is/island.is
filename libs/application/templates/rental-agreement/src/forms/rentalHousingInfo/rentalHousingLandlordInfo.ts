import { parsePhoneNumberFromString } from 'libphonenumber-js'
import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import { landlordDetails } from '../../lib/messages'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

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
            nationalIdWithName: {
              component: 'nationalIdWithName',
            },
            phone: {
              component: 'phone',
              required: true,
              label: landlordDetails.phoneInputLabel,
              enableCountrySelector: true,
              width: 'half',
            },
            email: {
              component: 'input',
              required: true,
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
              phone: (value) => formatPhoneNumber(value),
            },
            header: [
              landlordDetails.nameInputLabel,
              landlordDetails.nationalIdInputLabel,
              landlordDetails.phoneInputLabel,
              landlordDetails.emailInputLabel,
            ],
            rows: ['name', 'nationalId', 'phone', 'email'],
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
