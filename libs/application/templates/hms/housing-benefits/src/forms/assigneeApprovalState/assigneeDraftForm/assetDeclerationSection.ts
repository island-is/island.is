import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildTextField,
  buildRadioField,
  YES,
  NO,
  getValueViaPath,
} from '@island.is/application/core'

export const assetDeclerationSection = buildSection({
  id: 'assetDeclerationSection',
  title: 'Eignayfirlýsing',
  children: [
    buildMultiField({
      id: 'assetDecleration',
      title: 'Eignayfirlýsing',
      children: [
        buildDescriptionField({
          id: 'assetDeclerationDescription',
          description:
            'Skattframtali fyrir síðasta ár hefur ekki verið skilað. Til að halda áfram þarf að fylla út eignayfirlýsingu.',
        }),
        buildDescriptionField({
          id: 'assetDeclerationDescription2',
          description:
            'Eignayfirlýsing er einfaldlega upplistun á öllum þínum eignum. Ef þú átt engar eignir, þá þarft þú að lýsa því yfir að þú átt engar eignir.',
          marginBottom: 4,
        }),
        buildRadioField({
          id: 'assetDeclerationRadio',
          title: 'Átt þú einhverskonar eignir?',
          description:
            'Eignir geta til dæmis verið: Fasteignir, ökutæki, hlutabréf eða fjármagn',
          options: [
            { label: 'Já', value: YES },
            { label: 'Nei', value: NO },
          ],
          marginBottom: 4,
        }),
        buildTextField({
          condition: (answers) =>
            getValueViaPath(answers, 'assetDeclerationRadio') === YES,
          id: 'assetDeclerationTextField',
          description: 'Vinsamlegast listaðu upp allar þínar eignir.',
          variant: 'textarea',
          rows: 10,
        }),
      ],
    }),
  ],
})
