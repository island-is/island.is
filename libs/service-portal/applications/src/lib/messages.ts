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
      'Hér sérðu yfirlit yfir þær umsóknir sem þú hefur sótt um í gegnum Ísland.is.',
    description: 'Intro copy to introduce to all applications available',
  },
  error: {
    id: 'sp.applications:error',
    defaultMessage: 'Tókst ekki að sækja umsóknir, eitthvað fór úrskeiðis',
    description: 'General error message',
  },
  searchLabel: {
    id: 'sp.applications:search.label',
    defaultMessage: 'Leit',
    description: 'Title for application search box',
  },
  searchPlaceholder: {
    id: 'sp.applications:search.placeholder',
    defaultMessage: 'Leita af umsókn',
    description: 'Placeholder for application search box',
  },
  searchInstitutiontLabel: {
    id: 'sp.applications:institution-label',
    defaultMessage: 'Stofnun',
    description: 'Label for application institution dropdown search',
  },
  incopmleteApplications: {
    id: 'sp.applications:incompleteApplications-label',
    defaultMessage: 'Ókláraðar umsóknir',
    description: 'Label for incomplete application list',
  },
  inProgressApplications: {
    id: 'sp.applications:inProgressApplications-label',
    defaultMessage: 'Umsóknir í vinnslu',
    description: 'Label for in progress application list',
  },
  finishedApplications: {
    id: 'sp.applications:finishedApplications-label',
    defaultMessage: 'Eldri umsóknir',
    description: 'Label for finished application list',
  },
})
