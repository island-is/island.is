import {
  buildAlertMessageField,
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
import { shouldShowLandlordAlert } from '../../../utils/conditions'
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
        buildAlertMessageField({
          condition: shouldShowLandlordAlert,
          id: 'parties.landlordInfo.alertMessage',
          title: m.partiesDetails.alertMessageTitle,
          message: m.partiesDetails.alertMessageDescription,
          alertType: 'error',
        }),
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
