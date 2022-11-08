import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { USERTYPE } from '../../lib/constants'
import { m } from '../../lib/messages'

export const fakeDataSection = buildSubSection({
  id: 'fakeData',
  title: 'Gervigögn',
  children: [
    buildMultiField({
      id: 'shouldFake',
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
            forsendugögn svo hægt sé að prófa mismunandi ferli á dev umhverfi meðan
            umsóknin er í vinnslu.
          `.replace(/\s{1,}/g, ' '),
        }),
        buildRadioField({
          id: 'fakeData.options',
          title: '',
          width: 'half',
          options: [
            {
              value: USERTYPE.INDIVIDUAL.toString(),
              label: 'Persónukjör',
            },
            {
              value: USERTYPE.PARTY.toString(),
              label: 'Stjórnmálaflokkur',
            },
            {
              value: USERTYPE.CEMETRY.toString(),
              label: 'Kirkjugarður',
            },
          ],
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: m.continue,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.continue,
              type: 'subtle',
            },
          ],
        }),
      ],
    }),
  ],
})
