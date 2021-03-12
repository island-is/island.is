import { defineMessages } from 'react-intl'

export const m = defineMessages({
  heading: {
    id: 'sp.applications:heading',
    defaultMessage: 'Umsóknir',
    description: `Main title for the applications portal`,
  },
  introCopy: {
    id: 'sp.applications:intro.copy',
    defaultMessage:
      'Smelltu á hnappinn hér að neðan til að sjá allar umsóknir sem eru í boði fyrir Ísland.is gáttina.',
    description: 'Intro copy to introduce to all applications available',
  },
  error: {
    id: 'sp.applications:error',
    defaultMessage: 'Tókst ekki að sækja umsóknir, eitthvað fór úrskeiðis',
    description: 'General error message',
  },
  cardStatusDone: {
    id: 'sp.applications:card.status.done',
    defaultMessage: 'Afgreidd',
    description: 'Done status for an application card',
  },
  cardStatusInProgress: {
    id: 'sp.applications:card.status.inProgress',
    defaultMessage: 'Í bið',
    description: 'In progress status for an application card',
  },
  cardStatusCopyDone: {
    id: 'sp.applications:card.status.copy.done',
    defaultMessage: 'Þú hefur lokið umsóknarferli fyrir',
    description: 'Copy description of the done status on the application card',
  },
  cardStatusCopyInProgress: {
    id: 'sp.applications:card.status.copy.inProgress',
    defaultMessage: 'Þú hefur ekki lokið umsóknarferli fyrir',
    description:
      'Copy description of the in progress status on the application card',
  },
  cardButtonInProgress: {
    id: 'sp.applications:card.button.inProgress',
    defaultMessage: 'Opna umsókn',
    description: 'Button label when application is in progress',
  },
  cardButtonComplete: {
    id: 'sp.applications:card.button.complete',
    defaultMessage: 'Skoða yfirlit',
    description: 'Button label when application is complete',
  },
})
