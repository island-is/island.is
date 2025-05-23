import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  personalInformationOverviewItems,
  realEstateOverviewItems,
  photoOverviewItems,
  changesOverviewItems,
} from '../../utils/getOverviewItems'
import * as m from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
export const overviewSection = buildSection({
  condition: (_answers, externalData) => {
    console.log('externalData: ', externalData)
    return true
  },
  id: 'overviewSection',
  title: m.overviewMessages.title,
  children: [
    buildMultiField({
      condition: (_answers, externalData) => {
        console.log('externalData: ', externalData)
        return true
      },
      id: 'overviewSection',
      title: m.overviewMessages.title,
      description: m.overviewMessages.description,
      children: [
        buildOverviewField({
          id: 'personalInformationOverview',
          title: m.personalInformationMessages.title,
          backId: 'applicant',
          items: personalInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'realEstateOverview',
          title: m.realEstateMessages.title,
          backId: 'realEstate',
          items: realEstateOverviewItems,
        }),
        buildOverviewField({
          id: 'changesOverview',
          title: m.changesMessages.title,
          backId: 'appraisalMethod',
          items: changesOverviewItems,
        }),

        buildOverviewField({
          id: 'photoOverview',
          title: m.photoMessages.title,
          backId: 'photoMultiField',
          attachments: photoOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: m.overviewMessages.pay,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.PAYMENT,
              name: m.overviewMessages.pay,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
