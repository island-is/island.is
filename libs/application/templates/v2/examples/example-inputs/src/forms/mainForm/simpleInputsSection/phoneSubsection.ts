import { SubSectionBuilder } from '@island.is/application/core'

export const phoneSubsection = new SubSectionBuilder('phone', 'Phone')
  .addPage('phoneMultiField', 'Phone fields', (page) => {
    page
      .addPhoneField('phone', 'Regular')
      .addPhoneField('halfPhone', 'Half', {
        width: 'half',
      })
      .addPhoneField('whitePhone', 'White (try to use blue if possible)', {
        backgroundColor: 'white',
      })
      .addPhoneField('placeholderPhone', 'Placeholder', {
        placeholder: 'Enter your phone number',
      })
      .addPhoneField('countrySelectPhone', 'Country select', {
        enableCountrySelector: true,
      })
      .addPhoneField(
        'countrySelectOnlyAllowedPhone',
        'Limited country select',
        {
          enableCountrySelector: true,
          allowedCountryCodes: ['IS', 'IM', 'VC', 'AI', 'AW'],
        },
      )
  })
  .build()
