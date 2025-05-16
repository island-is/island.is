import {
  buildAsyncSelectField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'

export const realEstateSection = buildSection({
  id: 'realEstateSection',
  title: 'Fasteign',
  children: [
    buildMultiField({
      id: 'realEstate',
      title: 'Fasteign',
      children: [
        buildRadioField({
          id: 'chooseOrSearch',
          options: [
            {
              value: 'choose',
              label: 'Velja fasteign',
            },
            {
              value: 'search',
              label: 'Skrá fasteignanúmer',
            },
          ],
        }),
        buildAsyncSelectField({
          condition: (answers) => {
            const chooseOrSearch = getValueViaPath<string>(
              answers,
              'chooseOrSearch',
            )
            return chooseOrSearch === 'choose'
          },
          id: 'realEstate',
          title: 'Fasteign',
          loadOptions: async (inputValue) => {
            // Replace with actual API call
            return [
              {
                label: 'Fasteign 1',
                value: '1',
              },
              {
                label: 'Fasteign 2',
                value: '2',
              },
            ]
          },
        }),
        buildTextField({
          condition: (answers) => {
            const chooseOrSearch = getValueViaPath<string>(
              answers,
              'chooseOrSearch',
            )
            return chooseOrSearch === 'search'
          },
          id: 'realEstateNumber',
          title: 'Fasteignanúmer',
        }),
      ],
    }),
  ],
})
