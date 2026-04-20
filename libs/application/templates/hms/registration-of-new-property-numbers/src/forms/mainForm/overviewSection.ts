import {
  buildMultiField,
  buildOverviewField,
  buildSection,
} from '@island.is/application/core'
import {
  getApplicantOverviewItems,
  getContactOverviewItems,
  getRealEstateOverviewItems,
} from '../../utils/getOverviewItems'
import { overview } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultifield',
      title: overview.title,
      description: overview.description,
      children: [
        buildOverviewField({
          id: 'overview.applicant',
          backId: 'applicantMultiField',
          items: getApplicantOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.contact',
          backId: 'contactMultiField',
          items: getContactOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.realEstate',
          backId: 'realEstate',
          items: getRealEstateOverviewItems,
        }),
      ],
    }),
  ],
})
