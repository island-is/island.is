import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'sp.applications:name',
    defaultMessage: 'Umsóknir',
    description: 'Main title for the applications portal',
  },
  introText: {
    id: 'sp.applications:intro-text',
    defaultMessage:
      'Hér eru birt þau leyfi og umsóknir sem þú hefur sótt um á Ísland.is, bæði sem einstaklingur og í umboði annarra.',
    description: 'Used on the overview page for the applications',
  },
  error: {
    id: 'sp.applications:error',
    defaultMessage: 'Tókst ekki að sækja umsóknir, eitthvað fór úrskeiðis',
    description: 'General error message',
  },
  cardStatusDone: {
    id: 'sp.applications:card.status.done',
    defaultMessage: 'Lokið',
    description: 'Done status for an application card',
  },
  cardStatusInProgress: {
    id: 'sp.applications:card.status.inProgress',
    defaultMessage: 'Í ferli',
    description: 'In progress status for an application card',
  },
  cardStatusCopyDone: {
    id: 'sp.applications:card.status.copy.done',
    defaultMessage: 'Þú hefur lokið umsóknarferli fyrir {name}',
    description: 'Copy description of the done status on the application card',
  },
  cardStatusCopyInProgress: {
    id: 'sp.applications:card.status.copy.inProgress',
    defaultMessage: 'Þú hefur ekki lokið umsóknarferli fyrir {name}',
    description:
      'Copy description of the in progress status on the application card',
  },
  cardTagApplicant: {
    id: 'sp.applications:card.tag.applicant',
    defaultMessage: 'Umsækjendi',
    description: 'Is the user the applicant of the application',
  },
  cardTagAssignee: {
    id: 'sp.applications:card.tag.assignee',
    defaultMessage: 'Viðtakandi',
    description: 'Is the user an assignee of the application',
  },
})
