import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { YES } from '../../lib/constants'
import { m } from '../../lib/messages'

export const prePaidHeirs = buildSection({
  id: 'prePaidHeirs',
  title: 'Erfingjar',
  children: [
    buildSubSection({
      id: 'propertyForExchange',
      title: 'Undirskref',
      children: [
        buildMultiField({
          id: 'propertyForExchange',
          title: 'Hvað á að greiða í arf?',
          children: [
            buildDescriptionField({
              id: 'description',
              title: '',
              description: 'Lorem ipsum foo bar beep boop meep morp',
              marginBottom: 'p4',
            }),
            buildCheckboxField({
              id: 'bankMoney',
              title: '',
              large: true,
              backgroundColor: 'blue',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: 'Innistæður í bönkum',
                  subLabel: 'blabliblop',
                },
              ],
            }),
            buildCheckboxField({
              id: 'money',
              title: '',
              large: true,
              backgroundColor: 'blue',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: 'Peningar',
                  subLabel: 'Til dæmis bla bla bla',
                },
              ],
            }),
            buildCheckboxField({
              id: 'realEstate',
              title: '',
              large: true,
              backgroundColor: 'blue',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: 'Fasteignir og lóðir',
                  subLabel: 'Til dæmis bla bla bla',
                },
              ],
            }),
            buildCheckboxField({
              id: 'vehicles',
              title: '',
              large: true,
              backgroundColor: 'blue',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: 'Fasteignir og lóðir',
                  subLabel: 'Til dæmis bla bla bla',
                },
              ],
            }),
            buildCheckboxField({
              id: 'other',
              title: '',
              large: true,
              backgroundColor: 'blue',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: 'Annað',
                  subLabel: 'Til dæmis bla bla bla',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildMultiField({
      id: 'heirs',
      title: 'Hver á að fá arfinn?',
      children: [
        buildDescriptionField({
          id: 'description',
          title: '',
          description: 'Lorem ipsum foo bar beep boop meep morp',
          marginBottom: 'p4',
        }),
        buildCustomField(
          {
            title: '',
            id: 'heirs.data',
            doesNotRequireAnswer: true,
            component: 'HeirsAndPartitionRepeater',
          },
          {
            customFields: [
              {
                title: m.heirsRelation,
                id: 'relation',
              },
              {
                title: m.heirsInheritanceRate,
                id: 'heirsPercentage',
              },
              {
                title: m.taxFreeInheritance,
                id: 'taxFreeInheritance',
                readOnly: true,
                currency: true,
              },
              {
                title: m.inheritanceAmount,
                id: 'inheritance',
                readOnly: true,
                currency: true,
              },
              {
                title: m.taxableInheritance,
                id: 'taxableInheritance',
                readOnly: true,
                currency: true,
              },
              {
                title: m.inheritanceTax,
                id: 'inheritanceTax',
                readOnly: true,
                currency: true,
              },
            ],
            repeaterButtonText: m.addHeir,
            sumField: 'heirsPercentage',
          },
        ),
      ],
    }),
  ],
})
