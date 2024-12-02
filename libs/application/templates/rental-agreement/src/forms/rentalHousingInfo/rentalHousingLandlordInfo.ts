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
              required: true,
              options: (application, activeField) => {
                console.log('ExternalData: ', application.externalData)
                console.log('AppAnswers: ', application.answers.landlordInfo)
                console.log('ActiveField', activeField?.nationalIdWithName)
                return []
              },
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
              isRepresentative: (value) =>
                value.includes(YES) ? '(umboðsaðili)' : '',
              nationalIdWithName: (value) => value,
              phone: (value) => formatPhoneNumber(value),
              email: (value) => value,
            },
            header: [
              landlordDetails.nameInputLabel,
              landlordDetails.nationalIdInputLabel,
              landlordDetails.phoneInputLabel,
              landlordDetails.emailInputLabel,
            ],
            rows: [
              'nationalIdWithName.name',
              'nationalIdWithName.nationalId',
              'phone',
              'email',
            ],
          },
        }),
      ],
    }),
  ],
})
