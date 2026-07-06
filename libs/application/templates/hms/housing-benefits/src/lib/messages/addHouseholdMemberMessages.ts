import { defineMessages } from 'react-intl'

export const addHouseholdMember = defineMessages({
  rejectedAssigneesEmpty: {
    id: 'hb.application:addHouseholdMember.rejectedAssigneesEmpty',
    defaultMessage: '',
    description:
      'Empty description when no rejected assignees are listed on add household member screen',
  },
  rejectedAssigneesList: {
    id: 'hb.application:addHouseholdMember.rejectedAssigneesList#markdown',
    defaultMessage:
      'Eftirfarandi heimilismenn hafa hafnað umsókninni og verða fjarlægðir af listanum: \n\n * {names}',
    description:
      'List of household members who rejected and will be removed from the add household member table. {names} is a formatted markdown list.',
  },
})
