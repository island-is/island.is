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
    defaultMessage: 'Lokið',
    description: 'Done status for an application card',
  },
  cardStatusOpen: {
    id: 'sp.applications:card.status.open',
    defaultMessage: 'Opin',
    description: 'Open status for an application card',
  },
  cardStatusInProgress: {
    id: 'sp.applications:card.status.inProgress',
    defaultMessage: 'Í ferli',
    description: 'In progress status for an application card',
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
