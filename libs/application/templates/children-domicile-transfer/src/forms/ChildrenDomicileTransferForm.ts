import {
  buildForm,
  buildSection,
  buildTextField,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildCheckboxField,
} from '@island.is/application/core'

export const ChildrenDomicileTransferForm: Form = buildForm({
  id: 'ChildrenDomicileTransferFormDraft',
  title: 'Flutningur lögheimilis',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: 'Gagnaöflun',
      children: [
        buildExternalDataProvider({
          title: 'Gagnaöflun',
          id: 'approveExternalData',
          dataProviders: [
            buildDataProviderItem({
              id: 'childrenNationalRegistry',
              type: 'ChildrenNationalRegistryProvider',
              title: 'Grunnupplýsingar um börn',
              subTitle:
                'Nöfn, kennitölur og núverandi lögheimili barna í þinni forsjá.',
            }),
            buildDataProviderItem({
              id: 'parentNationalRegistry',
              type: 'ParentNationalRegistryProvider',
              title: 'Grunnupplýsingar um foreldra',
              subTitle: 'Nöfn, kennitölur og lögheimili forelda barnanna.',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'selectChildInCustody',
      title: 'Velja barn',
      children: [
        buildCheckboxField({
          id: 'selectChild',
          title: 'Velja barn/börn til að flytja lögheimili fyrir',
          description:
            'Hér sérðu lista yfir börn sem eru skráð í þinni forsjá. Þú getur valið hvaða börn á að flytja lögheimili fyrir.',
          large: true,
          options: [
            { value: '1', label: 'Ólafur Helgi Eiríksson' },
            { value: '2', label: 'Rósa Líf Eiríksdóttir' },
          ],
        }),
      ],
    }),
    buildSection({
      id: 'changeDomicile',
      title: 'Breyta lögheimili',
      children: [
        buildTextField({
          id: 'children',
          title: 'children',
        }),
      ],
    }),
    buildSection({
      id: 'transferDate',
      title: 'Flutningur',
      children: [
        buildTextField({
          id: 'children',
          title: 'children',
        }),
      ],
    }),
    buildSection({
      id: 'transferPeriod',
      title: 'Gildistími',
      children: [
        buildTextField({
          id: 'children',
          title: 'children',
        }),
      ],
    }),
    buildSection({
      id: 'applicationEffect',
      title: 'Áhrif umsóknar',
      children: [
        buildTextField({
          id: 'children',
          title: 'children',
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: 'Yfirlit og undirritun',
      children: [
        buildTextField({
          id: 'children',
          title: 'children',
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: 'Umsókn móttekin',
      children: [
        buildTextField({
          id: 'children',
          title: 'children',
        }),
      ],
    }),
  ],
})
