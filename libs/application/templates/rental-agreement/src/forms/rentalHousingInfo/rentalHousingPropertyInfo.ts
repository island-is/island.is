import {
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'

export const RentalHousingPropertyInfo = buildSubSection({
  id: 'rentalHousingPropertyInfo',
  title: 'Skrá húsnæði',
  children: [
    buildMultiField({
      id: 'rentalHousingPropertyInfo',
      title: 'Húsnæðið',
      description:
        'Finndu eignina með fasteignanúmeri eða heimilisfangi. Nánari upplýsingar er að finna í fasteignaskrá HMS.',
      children: [
        buildTextField({
          id: 'propertyAddress',
          title: 'Heimilisfang leiguhúsnæðis',
          variant: 'text',
          defaultValue: '',
          colSpan: '6/12',
        }),
      ],
    }),
  ],
})
