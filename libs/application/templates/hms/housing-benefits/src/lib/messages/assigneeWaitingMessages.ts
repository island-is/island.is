import { defineMessages } from 'react-intl'

export const assigneeWaiting = defineMessages({
  title: {
    id: 'hb.application:assigneeWaiting.title',
    defaultMessage: 'Beðið eftir samþykki',
    description: 'Assignee waiting title',
  },
  description: {
    id: 'hb.application:assigneeWaiting.description',
    defaultMessage:
      'Beðið er eftir að {names} undirriti umsóknina áður en hún er send til HMS.',
    description: 'Assignee waiting description',
  },
  descriptionSingle: {
    id: 'hb.application:assigneeWaiting.descriptionSingle',
    defaultMessage:
      'Beðið eftir að {name} undirriti umsóknina áður en hún er send til HMS.',
    description: 'Assignee waiting description for single person',
  },
  descriptionGeneric: {
    id: 'hb.application:assigneeWaiting.descriptionGeneric',
    defaultMessage:
      'Beðið eftir að allir heimilismenn yfir 18 ára undirriti umsóknina áður en hún er send til HMS.',
    description: 'Generic assignee waiting description for all assignees',
  },
  approvedList: {
    id: 'hb.application:assigneeWaiting.approvedList#markdown',
    defaultMessage: 'Þeir sem hafa samþykkt gagnaöflun: \n\n * {names}',
    description: 'List of people who have approved',
  },
  pendingList: {
    id: 'hb.application:assigneeWaiting.pendingList#markdown',
    defaultMessage:
      'Þeir sem hafa ekki enn samþykkt gagnaöflun: \n\n * {names}',
    description: 'List of people who have yet to approve',
  },
})
