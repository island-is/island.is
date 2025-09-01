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
import { landlordAndTenantDetails, partiesDetails } from '../../../lib/messages'

export const RentalHousingPartiesInfo = buildSubSection({
  id: Routes.PARTIESINFORMATION,
  title: partiesDetails.subSectionName,
  children: [
    buildMultiField({
      id: Routes.PARTIESINFORMATION,
      title: partiesDetails.multiFieldTitle,
      description: partiesDetails.multiFieldDescription,
      children: [
        buildTableRepeaterField({
          id: 'parties.landlordInfo.table',
          title: partiesDetails.landlordTableTitle,
          editField: true,
          marginTop: 1,
          maxRows: 10,
          fields: applicantTableFields,
          table: applicantTableConfig,
        }),
        buildTableRepeaterField({
          id: 'parties.landlordInfo.representativeTable',
          title: landlordAndTenantDetails.representativeTableTitle,
          editField: true,
          marginTop: 6,
          maxRows: 10,
          fields: applicantTableFields,
          table: applicantTableConfig,
        }),
        buildTableRepeaterField({
          id: 'parties.tenantInfo.table',
          title: partiesDetails.tenantTableTitle,
          editField: true,
          maxRows: 10,
          fields: applicantTableFields,
          table: applicantTableConfig,
        }),
      ],
    }),
  ],
})
