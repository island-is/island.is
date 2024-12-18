import {
  buildMultiField,
  buildPhoneField,
  buildSubSection,
} from '@island.is/application/core'

export const phoneSubsection = buildSubSection({
  id: 'phone',
  title: 'Phone',
  children: [
    buildMultiField({
      id: 'phoneMultiField',
      title: 'Phone fields',
      children: [
        buildPhoneField({
          id: 'phone',
          title: 'Regular',
        }),
        buildPhoneField({
          id: 'halfPhone',
          title: 'Half',
          width: 'half',
        }),
        buildPhoneField({
          id: 'whitePhone',
          title: 'White (try to use blue if possible)',
          backgroundColor: 'white',
        }),
        buildPhoneField({
          id: 'placeholderPhone',
          title: 'Placeholder',
          placeholder: 'Enter your phone number',
        }),
        buildPhoneField({
          id: 'countrySelectPhone',
          title: 'Country select',
          enableCountrySelector: true,
        }),
        buildPhoneField({
          id: 'countrySelectOnlyAllowedPhone',
          title: 'Limited country select',
          enableCountrySelector: true,
          allowedCountryCodes: ['IS', 'IM', 'VC', 'AI', 'AW'],
        }),
      ],
    }),
  ],
})
