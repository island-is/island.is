import {
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import {
  applicantTableConfig,
  landlordTableConfig,
  applicantTableFields,
  landLordInfoTableFields,
} from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import * as m from '../../../lib/messages'

export const partiesSection = buildSection({
  id: Routes.PARTIESINFORMATION,
  title: m.partiesDetails.subSectionName,
  children: [
    buildMultiField({
      id: Routes.PARTIESINFORMATION,
      title: m.partiesDetails.multiFieldTitle,
      description: m.partiesDetails.multiFieldDescription,
      children: [
        buildTableRepeaterField({
          id: 'parties.landlordInfo.table',
          title: m.partiesDetails.landlordTableTitle,
          editField: true,
          marginTop: 1,
          maxRows: 10,
          fields: landLordInfoTableFields,
          table: landlordTableConfig,
        }),
        buildTableRepeaterField({
          id: 'parties.tenantInfo.table',
          title: m.partiesDetails.tenantTableTitle,
          editField: true,
          maxRows: 10,
          fields: applicantTableFields,
          table: applicantTableConfig,
        }),
      ],
    }),
  ],
})
