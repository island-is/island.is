import {
  buildSubSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'

export const RentalHousingTenantInfo = buildSubSection({
  id: 'rentalHousingTenantInfo',
  title: 'Leigjandi',
  children: [
    buildMultiField({
      id: 'rentalHousingTenantInfo',
      title: 'Skrá leigjanda',
      children: [
        buildTextField({
          id: 'rentalHousingTenantNationalId',
          title: 'Kennitala leigjanda',
          width: 'half',
        }),
        buildTextField({
          id: 'rentalHousingTenantName',
          title: 'Fullt nafn',
          width: 'half',
        }),
        buildTextField({
          id: 'rentalHousingTenantEmail',
          title: 'Netfang',
          width: 'half',
        }),
        buildTextField({
          id: 'rentalHousingTenantPhone',
          title: 'Símanúmer',
          width: 'half',
        }),
      ],
    }),
  ],
})
