import {
  buildAlertMessageField,
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  YES,
} from '@island.is/application/core'
import {
  applicantTableConfig,
  applicantTableFields,
  landLordInfoTableFields,
} from '../../../utils/utils'
import { Routes } from '../../../utils/enums'
import {
  shouldShowLandlordAlert,
  shouldShowRepresentativeTable,
} from '../../../utils/conditions'
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
          table: applicantTableConfig,
        }),
        buildCheckboxField({
          id: 'parties.landlordInfo.shouldShowRepresentativeTable',
          marginTop: 6,
          // large: false,
          // backgroundColor: 'white',
          options: [
            {
              label:
                m.landlordAndTenantDetails.representativeTableCheckboxLabel,
              value: YES,
            },
          ],
        }),
        buildTableRepeaterField({
          condition: shouldShowRepresentativeTable,
          id: 'parties.landlordInfo.representativeTable',
          title: m.landlordAndTenantDetails.representativeTableTitle,
          editField: true,
          marginTop: 6,
          maxRows: 10,
          fields: landLordInfoTableFields,
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
