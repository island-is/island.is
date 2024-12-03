import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildTextField,
  buildDisplayField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const newOpperatingCostSubSection = buildSubSection({
  id: 'newOperatingCost',
  title: m.expensesIncome,
  children: [
    buildMultiField({
      id: 'newOperatingCostMultiField',
      title: '',
      children: [
        buildDescriptionField({
          id: 'testDescription',
          title: 'Lykiltölur - Tekjur og gjöld',
          titleVariant: 'h2',
          description: 'Vinsamlegast fylltu út þá reiti sem eiga við',
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'testDescription',
          title: 'Tekjur',
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Umhirðutekjur',
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Grafartekjur',
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Styrkur frá Kirkjugarðasjóði',
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Aðrar tekjur',
          width: 'half',
          variant: 'currency',
        }),
        buildDisplayField({
          id: 'testDisplayField',
          title: '',
          label: 'Tekjur samtals',
          variant: 'currency',
          rightAlign: true,
          value: (_) => '200.000',
        }),

        buildDescriptionField({
          id: 'testDescription',
          title: 'Gjöld',
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Laun og launatengd gjöld',
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Úfararkostnaður',
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Rekstur útfararkapellu',
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Framlög til kirkjugarðasjóðs',
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Framlög og styrkir til annara',
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Annar rekstrarkostnaður',
          width: 'half',
          variant: 'currency',
        }),
        buildTextField({
          id: 'testTextField',
          title: 'Afskriftir',
          width: 'half',
          variant: 'currency',
        }),
        buildDisplayField({
          id: 'testDisplayField2',
          title: '',
          label: 'Gjöld samtals',
          variant: 'currency',
          rightAlign: true,
          value: (_) => '50.000',
        }),

        buildDisplayField({
          id: 'testDisplayField3',
          title: 'Rekstrarniðurstaða fyrir fjármagnsliði',
          // label: 'Rekstrarniðurstaða fyrir fjármagnsliði',
          variant: 'currency',
          rightAlign: true,
          value: (_) => '150.000',
        }),
      ],
    }),
  ],
})
