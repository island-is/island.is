import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  buildHiddenInput,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import * as m from '../../lib/messages'
import {
  getHouseholdMembersTableRepeaterDefaultValue,
  getRentalAgreementTenantsForStaticTable,
} from '../../utils/rentalAgreementUtils'
import { hasNonCustodyMinorsInHousehold } from '../../utils/utils'

export const householdMembersSection = buildSection({
  id: 'householdMembersSection',
  title: m.draftMessages.householdMembersSection.title,
  condition: (answers: FormValue) =>
    !!getValueViaPath<string>(answers, 'rentalAgreement.answer'),
  children: [
    buildMultiField({
      id: 'householdMembersMultiField',
      title: m.draftMessages.householdMembersSection.multiFieldTitle,
      description:
        m.draftMessages.householdMembersSection.multiFieldDescription,
      children: [
        buildDescriptionField({
          id: 'householdMembersDescription',
          description: m.draftMessages.householdMembersSection.description,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'householdMembersDescription2',
          description: m.draftMessages.householdMembersSection.description2,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'householdMembersDescription3',
          description: m.draftMessages.householdMembersSection.description3,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'householdMembersDescription4',
          description: m.draftMessages.householdMembersSection.description4,
          marginBottom: 2,
        }),
        buildTableRepeaterField({
          id: 'householdMembersTableRepeater',
          title: m.draftMessages.householdMembersSection.tableRepeaterTitle,
          addItemButtonText:
            m.draftMessages.householdMembersSection.addMemberButton,
          editField: true,
          maxRows: 20,
          getStaticTableData: (application: Application) =>
            getRentalAgreementTenantsForStaticTable(application),
          defaultValue: (application: Application) =>
            getHouseholdMembersTableRepeaterDefaultValue(application),
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: m.draftMessages.householdMembersSection.nationalIdColumn,
              searchPersons: true,
              required: true,
            },
          },
          table: {
            header: [
              m.draftMessages.householdMembersSection.nameColumn,
              m.draftMessages.householdMembersSection.nationalIdColumn,
            ],
            rows: ['name', 'nationalId'],
          },
        }),
        buildHiddenInput({
          condition: (answers, externalData) =>
            !!getValueViaPath<string>(answers, 'rentalAgreement.answer') &&
            hasNonCustodyMinorsInHousehold(answers, externalData),
          id: 'householdMembersHiddenField',
        }),
      ],
    }),
  ],
})
