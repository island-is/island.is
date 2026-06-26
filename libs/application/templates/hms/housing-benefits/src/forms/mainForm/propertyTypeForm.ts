import {
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const propertyTypeSection = buildSection({
  id: 'propertyTypeSection',
  title: 'Tegund eignar',
  children: [
    buildMultiField({
      id: 'propertyTypeMultiField',
      title: 'Tegund eignar',
      description:
        'Veldu tegund eignar sem þú ert að sækja um húsnæðisbætur fyrir.',
      children: [
        buildSelectField({
          id: 'propertyType',
          title: 'Tegund eignar',
          options: [
            {
              label: 'Eign í einkaeigu',
              value: 'privatelyOwned',
            },
            {
              label: 'Eign sem er í eigu ríkis eða sveitarfélaga',
              value: 'stateOwned',
            },
            {
              label: 'Íbúð er heimavist eða námsgarður',
              value: 'dormitory',
            },
            {
              label: 'Íbúð er áfangaheimili',
              value: 'halfwayHouse',
            },
            {
              label:
                'Sambýli fatlaðs fólks í húsnæðisúrræðum skv. 10. gr. laga um málefni fatlaðs fólks.',
              value: 'sharedHousingForDisabled',
            },
          ],
        }),
      ],
    }),
  ],
})
