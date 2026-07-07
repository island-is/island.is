import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, FormValue } from '@island.is/application/types'
import * as m from '../../lib/messages'
import {
  getAddHouseholdMemberStaticTableData,
  getAddHouseholdMemberTableRepeaterDefaultValue,
  rejectedAssigneesDescription,
} from '../../utils/addHouseholdMemberUtils'
import { hasRejectedAssigneesInAnswers } from '../../utils/assigneeRejectionUtils'

export const addHouseholdMemberSection = buildSection({
  id: 'addHouseholdMemberSection',
  tabTitle: m.draftMessages.householdMembersSection.title,
  condition: (answers: FormValue) =>
    !!getValueViaPath<string>(answers, 'rentalAgreement.answer'),
  children: [
    buildMultiField({
      id: 'addHouseholdMemberMultiField',
      title: m.draftMessages.householdMembersSection.multiFieldTitle,
      description:
        m.draftMessages.householdMembersSection.multiFieldDescription,
      children: [
        buildDescriptionField({
          id: 'addHouseholdMemberRejectedAssignees',
          description: rejectedAssigneesDescription,
          condition: (answers) => hasRejectedAssigneesInAnswers(answers),
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'addHouseholdMemberDescription',
          description: m.draftMessages.householdMembersSection.description,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'addHouseholdMemberDescription2',
          description: m.draftMessages.householdMembersSection.description2,
          marginBottom: 2,
        }),
        buildTableRepeaterField({
          id: 'householdMembersTableRepeater',
          title: m.draftMessages.householdMembersSection.tableRepeaterTitle,
          addItemButtonText:
            m.draftMessages.householdMembersSection.addMemberButton,
          editField: true,
          maxRows: 20,
          getStaticTableData: getAddHouseholdMemberStaticTableData,
          defaultValue: getAddHouseholdMemberTableRepeaterDefaultValue,
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
        buildSubmitField({
          id: 'addHouseholdMemberSubmit',
          title: m.draftMessages.householdMembersSection.title,
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Staðfesta',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
