import {
  buildSubSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'

export const RentalHousingLandlordInfo = buildSubSection({
  id: 'rentalHousingLandlordInfo',
  title: 'Leigusali',
  children: [
    buildMultiField({
      id: 'rentalHousingLandlordInfo',
      title: 'Skrá leigusala',
      children: [
        buildTextField({
          id: 'rentalHousingLandlordNationalId',
          title: 'Kennitala leigusala',
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: 'rentalHousingLandlordName',
          title: 'Fullt nafn',
          width: 'half',
          variant: 'text',
        }),
        buildTextField({
          id: 'rentalHousingLandlordEmail',
          title: 'Netfang',
          width: 'half',
          variant: 'email',
        }),
        buildTextField({
          id: 'rentalHousingLandlordPhone',
          title: 'Símanúmer',
          width: 'half',
          variant: 'tel',
        }),
      ],
    }),
  ],
})
