import {
  buildSubSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalHousingTenantInfo = buildSubSection({
  id: 'rentalHousingTenantInfo',
  title: m.tenantDetails.subSectionName,
  children: [
    buildMultiField({
      id: 'rentalHousingTenantInfo',
      title: m.tenantDetails.pageTitle,
      description: m.tenantDetails.pageDescription,
      children: [
        buildTextField({
          id: 'rentalHousingTenantNationalId',
          title: m.tenantDetails.nationalIdLabel,
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: 'rentalHousingTenantName',
          title: m.tenantDetails.nameLabel,
          width: 'half',
          variant: 'text',
        }),
        buildTextField({
          id: 'rentalHousingTenantEmail',
          title: m.tenantDetails.emailLabel,
          width: 'half',
          variant: 'email',
        }),
        buildTextField({
          id: 'rentalHousingTenantPhone',
          title: m.tenantDetails.phoneLabel,
          width: 'half',
          variant: 'tel',
        }),
      ],
    }),
  ],
})
