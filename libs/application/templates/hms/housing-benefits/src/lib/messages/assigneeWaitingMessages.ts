import { defineMessages } from 'react-intl'

export const assigneeWaiting = defineMessages({
  title: {
    id: 'hb.application:assigneeWaiting.title',
    defaultMessage: 'Beðið eftir samþykki',
    description: 'Assignee waiting title',
  },
  introDescription: {
    id: 'hb.application:assigneeWaiting.introDescription',
    defaultMessage:
      'Umsókn um húsnæðisbætur hefur verið fyllt út af hálfu umsækjanda. Núna þurfa allir heimilismenn yfir 18 ára að samþykkja að upplýsinga um þá sé aflað til að geta unnið umsóknina áfram.',
    description: 'Assignee waiting intro description',
  },
  introDescription2: {
    id: 'hb.application:assigneeWaiting.introDescription2',
    defaultMessage:
      'Í einhverjum tilfellum þurfa heimilismenna að skila eignayfirlýsingu og tekjuupplýsingum með sínu samþykki.',
    description: 'Assignee waiting intro description 2',
  },
  introDescription3: {
    id: 'hb.application:assigneeWaiting.introDescription3',
    defaultMessage:
      'Eftir að allir heimilismenn hafa samþykkt gagnaöflun þarf umsækjandi að lokum að skrá sig inn og yfirfara áður en hann sendir umsóknina inn til vinnslu.',
    description: 'Assignee waiting intro description 3',
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
  rejectedList: {
    id: 'hb.application:assigneeWaiting.rejectedList#markdown',
    defaultMessage: 'Þeir sem hafa hafnað gagnaöflun: \n\n * {names}',
    description: 'List of people who have rejected data collection',
  },
})
