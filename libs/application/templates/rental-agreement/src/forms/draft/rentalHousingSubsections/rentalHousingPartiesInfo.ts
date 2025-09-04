import {
  buildSubSection,
  buildMultiField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import {
  applicantTableConfig,
  applicantTableFields,
} from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import * as m from '../../../lib/messages'

export const RentalHousingPartiesInfo = buildSubSection({
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
          fields: applicantTableFields,
          table: applicantTableConfig,
        }),
        buildTableRepeaterField({
          id: 'parties.landlordInfo.representativeTable',
          title: m.landlordAndTenantDetails.representativeTableTitle,
          editField: true,
          marginTop: 6,
          maxRows: 10,
          fields: applicantTableFields,
          table: applicantTableConfig,
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
