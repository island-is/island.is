import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  appraisalMethodOverviewItems,
  personalInformationOverviewItems,
  realEstateOverviewItems,
  descriptionOverviewItems,
  photoOverviewItems,
} from '../../utils/getOverviewItems'
import * as m from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: 'Overview',
      children: [
        buildOverviewField({
          condition: (application) => {
            console.log(application)
            return true
          },
          id: 'personalInformationOverview',
          title: m.personalInformationMessages.title,
          backId: 'personalInformation',
          items: personalInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'appraisalMethodOverview',
          title: m.appraisalMethodMessages.title,
          backId: 'appraisalMethod',
          items: appraisalMethodOverviewItems,
        }),
        buildOverviewField({
          id: 'realEstateOverview',
          title: m.realEstateMessages.title,
          backId: 'realEstate',
          items: realEstateOverviewItems,
        }),
        buildOverviewField({
          id: 'descriptionOverview',
          title: m.descriptionMessages.title,
          backId: 'descriptionMultiField',
          items: descriptionOverviewItems,
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
