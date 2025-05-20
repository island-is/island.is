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

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewMessages.title,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: m.overviewMessages.title,
      description: m.overviewMessages.description,
      children: [
        buildOverviewField({
          id: 'personalInformationOverview',
          title: m.personalInformationMessages.title,
          backId: 'personalInformation',
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
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'Submit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
