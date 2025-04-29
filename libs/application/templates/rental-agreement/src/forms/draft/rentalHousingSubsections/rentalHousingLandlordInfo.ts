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
import { landlordDetails } from '../../../lib/messages'

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
            address: {
              component: 'input',
              required: true,
              label: landlordDetails.addressInputLabel,
              maxLength: 100,
            },
            isRepresentative: {
              component: 'checkbox',
              large: true,
              options: [
                {
                  label: landlordDetails.representativeLabel,
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
              landlordDetails.nameInputLabel,
              landlordDetails.phoneInputLabel,
              landlordDetails.nationalIdHeaderLabel,
              landlordDetails.emailInputLabel,
              landlordDetails.isRepresentative,
            ],
            rows: ['name', 'phone', 'nationalId', 'email', 'isRepresentative'],
          },
        }),
      ],
    }),
  ],
})
