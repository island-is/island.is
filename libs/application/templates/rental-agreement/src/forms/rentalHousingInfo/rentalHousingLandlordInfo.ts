import {
  buildSubSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalHousingLandlordInfo = buildSubSection({
  id: 'rentalHousingLandlordInfo',
  title: m.landlordDetails.pageTitle,
  children: [
    buildMultiField({
      id: 'rentalHousingLandlordInfo',
      title: m.landlordDetails.pageTitle,
      description: m.landlordDetails.pageDescription,
      children: [
        buildTextField({
          id: 'rentalHousingLandlordNationalId',
          title: m.landlordDetails.nationalIdLabel,
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: 'rentalHousingLandlordName',
          title: m.landlordDetails.nameLabel,
          width: 'half',
          variant: 'text',
        }),
        buildTextField({
          id: 'rentalHousingLandlordEmail',
          title: m.landlordDetails.emailLabel,
          width: 'half',
          variant: 'email',
        }),
        buildTextField({
          id: 'rentalHousingLandlordPhone',
          title: m.landlordDetails.phoneLabel,
          width: 'half',
          variant: 'tel',
        }),
      ],
    }),
  ],
})
