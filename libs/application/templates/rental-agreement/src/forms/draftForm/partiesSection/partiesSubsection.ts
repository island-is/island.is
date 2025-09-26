import { ApplicantsRole, Routes } from '../../../utils/enums'
import {
  buildMultiField,
  buildStaticTableField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import {
  landLordInfoTableFields,
  staticPartyTableData,
} from '../../../utils/utils'
import { applicantTableConfig } from '../../../utils/utils'
import { applicantTableFields } from '../../../utils/utils'
import { shouldShowRepresentativeStaticTable } from '../../../utils/conditions'
import { shouldShowRepresentativeTable } from '../../../utils/conditions'
import { buildCheckboxField } from '@island.is/application/core'
import { buildDescriptionField } from '@island.is/application/core'
import { buildNationalIdWithNameField } from '@island.is/application/core'
import { buildPhoneField } from '@island.is/application/core'
import { buildTextField } from '@island.is/application/core'
import { YES } from '@island.is/application/core'
import { Application } from '@island.is/application/types';
import * as m from '../../../lib/messages'

export const partiesSubsection = buildSubSection({
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
          table: applicantTableConfig,
          getStaticTableData: (application: Application) => {
            return staticPartyTableData(application, ApplicantsRole.LANDLORD)
          },
        }),
        buildStaticTableField({
          condition: shouldShowRepresentativeStaticTable,
          title: m.landlordAndTenantDetails.representativeTableTitle,
          header: ['Nafn', 'Kennitala', 'Símanúmer', 'Netfang'],
          rows: (application: Application) => {
            const data = staticPartyTableData(
              application,
              ApplicantsRole.REPRESENTATIVE,
            )

            return data.map((item) => [
              item.name || '',
              item.nationalId || '',
              item.phone || '',
              item.email || '',
            ])
          },
        }),
        buildCheckboxField({
          condition: (answers) => !shouldShowRepresentativeStaticTable(answers),
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
          title: m.landlordAndTenantDetails.representativeTableTitle,
          titleVariant: 'h4',
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
          marginBottom: 2,
        }),
        buildTableRepeaterField({
          id: 'parties.tenantInfo.table',
          title: m.partiesDetails.tenantTableTitle,
          editField: true,
          maxRows: 10,
          fields: applicantTableFields,
          table: applicantTableConfig,
          getStaticTableData: (application: Application) => {
            return staticPartyTableData(application, ApplicantsRole.TENANT)
          },
        }),
      ],
    }),
  ],
})
