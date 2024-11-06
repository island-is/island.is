import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { formatNationalId } from '../../lib/utils'
import * as m from '../../lib/messages'

export const RentalHousingLandlordInfo = buildSubSection({
  id: 'landlordInfo',
  title: m.landlordDetails.subSectionName,
  children: [
    buildMultiField({
      id: 'landlordInfo.multiField',
      title: m.landlordDetails.pageTitle,
      description: m.landlordDetails.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'landlordInfo.table',
          title: '',
          editField: true,
          marginTop: 1,
          fields: {
            name: {
              component: 'input',
              label: m.landlordDetails.nameInputLabel,
              width: 'half',
            },
            nationalId: {
              component: 'input',
              label: m.landlordDetails.nationalIdInputLabel,
              format: '######-####',
              width: 'half',
            },
            phone: {
              component: 'input',
              label: m.landlordDetails.phoneInputLabel,
              type: 'tel',
              format: '###-####',
              width: 'half',
            },
            email: {
              component: 'input',
              label: m.landlordDetails.emailInputLabel,
              type: 'email',
              width: 'half',
            },
            isRepresentative: {
              component: 'checkbox',
              large: true,
              displayInTable: false,
              label: m.landlordDetails.representativeLabel,
              options: [
                {
                  label: m.landlordDetails.representativeLabel,
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
              m.landlordDetails.nameInputLabel,
              m.landlordDetails.nationalIdHeaderLabel,
              m.landlordDetails.phoneInputLabel,
              m.landlordDetails.emailInputLabel,
            ],
          },
        }),
      ],
    }),
  ],
})
