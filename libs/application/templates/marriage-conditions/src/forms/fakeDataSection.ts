import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildRadioField,
  buildSelectField,
} from '@island.is/application/core'
import { NO, YES } from '../lib/constants'
import { allowFakeCondition } from '../lib/utils'
import { NationalRegistryMaritalStatus as MaritalStatus } from '../types/schema'

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
                  `.replace(/\s{1,}/g, ' '),
        }),
        buildRadioField({
          id: 'fakeData.useFakeData',
          title: '',
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
            { value: '1', label: MaritalStatus.Unmarried },
            { value: '3', label: MaritalStatus.Married },
            { value: '4', label: MaritalStatus.Widowed },
            { value: '5', label: MaritalStatus.Separated },
            { value: '6', label: MaritalStatus.Divorced },
            {
              value: '7',
              label: MaritalStatus.MarriedLivingSeparately,
            },
            {
              value: '8',
              label: MaritalStatus.MarriedToForeignLawPerson,
            },
            { value: '9', label: MaritalStatus.Unknown },
            {
              value: '0',
              label: MaritalStatus.ForeignResidenceMarriedToUnregisteredPerson,
            },
            {
              value: 'L',
              label:
                MaritalStatus.IcelandicResidenceMarriedToUnregisteredPerson,
            },
          ],
        }),
      ],
    }),
  ],
})
