import {
  buildAlertMessageField,
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  buildNationalIdWithNameField,
  YES,
  buildPhoneField,
  buildTextField,
  buildDescriptionField,
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
          large: false,
          backgroundColor: 'white',
          clearOnChange: ['parties.landlordInfo.representativeTable.0'],
          options: [
            {
              label:
                m.landlordAndTenantDetails.representativeTableCheckboxLabel,
              value: YES,
            },
          ],
        }),
        buildDescriptionField({
          condition: shouldShowRepresentativeTable,
          id: 'parties.landlordInfo.representativeTableDesctiption',
          description:
            m.landlordAndTenantDetails.representativeTableDescription,
          marginBottom: 2,
        }),
        buildNationalIdWithNameField({
          condition: shouldShowRepresentativeTable,
          id: 'parties.landlordInfo.representativeTable.0.nationalIdWithName',
          marginBottom: 2,
        }),
        buildPhoneField({
          condition: shouldShowRepresentativeTable,
          id: 'parties.landlordInfo.representativeTable.0.phone',
          enableCountrySelector: true,
          required: true,
          title: 'Símanúmer',
          width: 'half',
        }),
        buildTextField({
          condition: shouldShowRepresentativeTable,
          id: 'parties.landlordInfo.representativeTable.0.email',
          variant: 'email',
          title: 'Netfang',
          width: 'half',
          required: true,
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
