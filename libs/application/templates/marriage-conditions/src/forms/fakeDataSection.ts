import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildRadioField,
  buildSelectField,
  YES,
  NO,
} from '@island.is/application/core'
import { allowFakeCondition } from '../lib/utils'
import { NationalRegistryMaritalStatus as MaritalStatus } from '@island.is/api/schema'

export const fakeDataSection = buildSection({
  id: 'fakeDataSection',
  title: 'Gervigögn',
  children: [
    buildMultiField({
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
                    \n\n
                    **Athugið einnig, gervimenn 3019 og 2399 teljast hafa fæðingarvottorð,
                    aðrir gervimenn ekki. Gervigögn fyrir rafræn skilríki, öll símanúmer sem enda á
                    9 komast í gegn.**
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
        buildSelectField({
          id: 'fakeData.maritalStatus',
          title: 'Hjúskaparstaða',
          description: 'Núverandi hjúskaparstaða umsækjanda',
          width: 'half',
          condition: allowFakeCondition(YES),
          options: [
            { value: '1', label: MaritalStatus.UNMARRIED },
            { value: '3', label: MaritalStatus.MARRIED },
            { value: '4', label: MaritalStatus.WIDOWED },
            { value: '5', label: MaritalStatus.SEPARATED },
            { value: '6', label: MaritalStatus.DIVORCED },
            {
              value: '7',
              label: MaritalStatus.MARRIED_LIVING_SEPARATELY,
            },
            {
              value: '8',
              label: MaritalStatus.MARRIED_TO_FOREIGN_LAW_PERSON,
            },
            { value: '9', label: MaritalStatus.UNKNOWN },
            {
              value: '0',
              label:
                MaritalStatus.FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON,
            },
            {
              value: 'L',
              label:
                MaritalStatus.ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON,
            },
          ],
        }),
      ],
    }),
  ],
})
