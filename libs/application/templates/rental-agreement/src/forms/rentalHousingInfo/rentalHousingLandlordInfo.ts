import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { formatNationalId } from '../../lib/utils'
import { landlordDetails } from '../../lib/messages'
import { Routes } from '../../lib/constants'

export const RentalHousingLandlordInfo = buildSubSection({
  id: Routes.LANDLORDINFORMATION,
  title: landlordDetails.subSectionName,
  children: [
    buildMultiField({
      id: Routes.LANDLORDINFORMATION,
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
            NationalIdWithName: {
              component: 'nationalIdWithName',
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
              formatPhoneNumber: (value: string) => formatPhoneNumber(value),
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
        }),
      ],
    }),
  ],
})
