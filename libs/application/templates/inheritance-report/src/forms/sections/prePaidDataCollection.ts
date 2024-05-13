import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
  YES,
} from '@island.is/application/core'

export const prePaidDataCollection = buildSection({
  id: 'dataCollection',
  title: 'Gagnaöflun',
  children: [
    buildSubSection({
      id: '',
      title: 'Arfleiðendur',
      children: [
        buildDescriptionField({
          id: 'description',
          title: '',
          description: 'Lorem ipsum foo bar beep boop meep morp',
          marginBottom: 'p4',
        }),
      ],
    }),
    buildSubSection({
      id: 'propertyForExchange',
      title: 'Arfur',
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
              id: 'prepaidInheritance.bankMoney',
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
              id: 'prepaidInheritance.money',
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
              id: 'prepaidInheritance.realEstate',
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
              id: 'prepaidInheritance.vehicles',
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
              id: 'prepaidInheritance.other',
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
  ],
})
