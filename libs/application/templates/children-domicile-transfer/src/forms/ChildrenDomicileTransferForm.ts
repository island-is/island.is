import {
  buildForm,
  buildSection,
  buildTextField,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildCheckboxField,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Parent } from '../dataProviders/APIDataTypes'

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
      id: 'otherParent',
      title: 'Hitt foreldri',
      children: [
        buildMultiField({
          id: 'informationAboutOtherParent',
          title: 'Fylltu inn upplýsingar um hitt foreldrið',
          description: (application) => {
            const parent = (application.externalData.parentNationalRegistry
              ?.data as {
              parent?: object
            })?.parent as Parent

            return `Hitt foreldrið er ${parent.name} (${parent.ssn})`
          },
          children: [
            buildTextField({
              id: 'email',
              description:
                'Til að láta hitt foreldrið vita þurfum við að fá netfang og símanúmer viðkomandi.',
              title: 'Netfang',
            }),
            buildTextField({
              id: 'phoneNumber',
              title: 'Símanúmer',
            }),
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
      id: 'applicationTerms',
      title: 'Áhrif umsóknar',
      children: [
        buildMultiField({
          id: 'applicationTermsTitle',
          title: 'Hvaða áhrif hefur breytingin?',
          description: 'Hér væri texti á mannamáli sem útskýrir hvaða áhrif þessi breyting hefur.',
          children: [
            buildCheckboxField({
              id: 'approveTerms',
              title: 'Litið er svo á að barn hafi fasta búsetu hjá því foreldri sem það á lögheimili hjá. Barn á rétt til að umgangast með reglubundnum hætti það foreldri sem það býr ekki hjá og bera foreldrarnir sameiginlega þá skyldu að tryggja rétt barns til umgengni.',
              large: true,
              options: [
                { value: 'approveTerms', label: 'Ég skil hvaða áhrif lögheimilisbreyting hefur' },
              ],
            }),
          ],
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
