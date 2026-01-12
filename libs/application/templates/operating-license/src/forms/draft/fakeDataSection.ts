import {
  buildMultiField,
  buildDescriptionField,
  buildRadioField,
  YES,
  NO,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { allowFakeCondition } from '../../lib/utils'

export const fakeDataSection = buildMultiField({
  id: 'fakeData',
  title: 'Gervigögn',
  children: [
    buildDescriptionField({
      id: 'gervigognDesc',
      title: 'Viltu nota gervigögn?',
      titleVariant: 'h5',
      // Note: text is rendered by a markdown component.. and when
      // it sees the indented spaces it seems to assume this is code
      // and so it will wrap the text in a <code> block when the double
      // spaces are not removed.
      description: `
                    Ath. gervigögn eru eingöngu notuð í stað þess að sækja
                    forsendugögn í staging umhverfi (dev x-road) hjá Þjóðskrá.
                    Öll önnur gögn eru ekki gervigögn og er þetta eingöngu gert
                    til að hægt sé að prófa ferlið.
                  `.replace(/\s{1,}/g, ' '),
    }),
    buildRadioField({
      id: 'fakeData.useFakeData',
      width: 'half',
      options: [
        {
          value: YES,
          label: 'Já',
        },
        {
          value: NO,
          label: 'Nei',
        },
      ],
    }),
    buildRadioField({
      id: 'fakeData.debtStatus',
      title: m.dataCollectionDebtStatusTitle,
      width: 'half',
      condition: allowFakeCondition(YES),
      options: [
        {
          value: YES,
          label: 'Skuldlaus',
        },
        {
          value: NO,
          label: 'Skuld',
        },
      ],
    }),
    buildRadioField({
      id: 'fakeData.criminalRecord',
      title: m.dataCollectionCriminalRecordTitle,
      width: 'half',
      condition: allowFakeCondition(YES),
      options: [
        {
          value: YES,
          label: 'Ekki á sakaskrá',
        },
        {
          value: NO,
          label: 'Sakaskrá',
        },
      ],
    }),
  ],
})
