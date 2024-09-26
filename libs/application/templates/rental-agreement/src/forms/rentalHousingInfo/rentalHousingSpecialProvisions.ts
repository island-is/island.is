import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'

export const RentalHousingSpecialProvisions = buildSubSection({
  id: 'RentalHousingSpecialProvisions',
  title: 'Sérákvæði',
  children: [
    buildMultiField({
      id: 'rentalHousingSpecialProvisionsDetails',
      title: 'Nánari lýsing og sérákvæði',
      description:
        'Hér má taka fram hvað fylgir húsnæðinu, hvort húsreglur séu til staðar eða önnur ákvæði sem fylgja samningnum. Athugið að þau ákvæði sem eru andstætt húsaleigulögum munu ekki hafa gildi í túlkun leigusamningsins. Sjá nánar hér.',
      children: [
        buildDescriptionField({
          id: 'rentalHousingSpecialProvisionsDescriptionTitle',
          title: 'Lýsing á húsnæðinu og því sem með fylgir',
          titleTooltip: 'Þetta er tooltip fyrir titilinn',
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'rentalHousingSpecialProvisionsDescriptionInput',
          title: 'Lýsing á húsnæði',
          variant: 'textarea',
          placeholder: 'Skrifaðu hér lýsingu á húsnæðinu',
        }),
      ],
    }),
    buildMultiField({
      id: 'rentalHousingSpecialProvisionsDetails',
      title: 'Nánari lýsing og sérákvæði',
      description:
        'Hér má taka fram hvað fylgir húsnæðinu, hvort húsreglur séu til staðar eða önnur ákvæði sem fylgja samningnum. Athugið að þau ákvæði sem eru andstætt húsaleigulögum munu ekki hafa gildi í túlkun leigusamningsins. Sjá nánar hér.',
      children: [
        buildDescriptionField({
          id: 'rentalHousingSpecialProvisionsTitle',
          title: 'Sérákvæði eða húsreglur',
          titleTooltip: 'Þetta er tooltip fyrir skýringu á þessum reit',
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'rentalHousingSpecialProvisionsInput',
          title: 'Sérákvæði',
          variant: 'textarea',
          placeholder: 'Skrifaðu hér allt sem á við',
        }),
      ],
    }),
  ],
})
