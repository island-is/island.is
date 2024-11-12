import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
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
              component: 'input',
              label: landlordDetails.phoneInputLabel,
              type: 'tel',
              format: '###-####',
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
              large: true,
              displayInTable: false,
              label: landlordDetails.representativeLabel,
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
              nationalId: (value) => formatNationalId(value),
            },
            header: [
              landlordDetails.nameInputLabel,
              landlordDetails.nationalIdHeaderLabel,
              landlordDetails.phoneInputLabel,
              landlordDetails.emailInputLabel,
            ],
          },
        }),
      ],
    }),
  ],
})
