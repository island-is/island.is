import { defineMessages } from 'react-intl'

export const m = defineMessages({
  heading: {
    id: 'sp.applications:heading',
    defaultMessage: 'Umsóknir',
    description: `Main title for the applications portal`,
  },
  headingFinished: {
    id: 'sp.applications:headingFinished',
    defaultMessage: 'Kláraðar umsóknir',
    description: `heading for applications that are finished`,
  },
  headingInProgress: {
    id: 'sp.applications:headingInProgress',
    defaultMessage: 'Umsóknir í vinnslu',
    description: `heading for applications that are in progress`,
  },
  headingIncomplete: {
    id: 'sp.applications:headingIncomplete',
    defaultMessage: 'Ókláraðar umsóknir',
    description: `heading for applications that are incomplete`,
  },
  introCopy: {
    id: 'sp.applications:intro.copy',
    defaultMessage:
      'Hér sérðu yfirlit yfir allar umsóknir sem þú hefur stofnað í gegnum Ísland.is.',
    description: 'Intro copy to introduce to all applications available',
  },
  introCopyFinished: {
    id: 'sp.applications:intro.copyFinished',
    defaultMessage:
      'Hér sérðu yfirlit yfir þær umsóknir sem þú hefur sótt um í gegnum Ísland.is.',
    description:
      'Intro copy to introduce to all applications that are finished',
  },
  introCopyInProgress: {
    id: 'sp.applications:intro.Inprogress',
    defaultMessage:
      'Hér sérðu yfirlit yfir þær umsóknir í vinnslu sem þú hefur hafið í gegnum Ísland.is.',
    description:
      'Intro copy to introduce to all applications that are in progress',
  },
  introCopyIncomplete: {
    id: 'sp.applications:intro.copyIncomplete',
    defaultMessage:
      'Hér sérðu yfirlit yfir þær ókláruðu umsóknir sem þú hefur hafið í gegnum Ísland.is.',
    description:
      'Intro copy to introduce to all applications that are incomplete',
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
    defaultMessage: 'Leita að umsókn',
    description: 'Placeholder for application search box',
  },
  searchInstitutiontLabel: {
    id: 'sp.applications:institution-label',
    defaultMessage: 'Stofnun',
    description: 'Label for application institution dropdown search',
  },
  incompleteApplications: {
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
  focusedApplication: {
    id: 'sp.applications:focusedApplication-label',
    defaultMessage: 'Umsóknin sem þú varst að klára',
    description: 'Label for incomplete application list',
  },
  noApplicationsAvailable: {
    id: 'sp.applications:no-applications-available',
    defaultMessage: 'Engar umsóknir fundust hjá Ísland.is á þessari kennitölu',
    description:
      'Error message when no applications are found in the overview for national id',
  },
  noIncompleteApplicationsAvailable: {
    id: 'sp.applications:no-incomplete-applications-available',
    defaultMessage:
      'Engar ókláraðar umsóknir fundust hjá Ísland.is á þessari kennitölu',
    description:
      'Error message when no incomplete applications are found in the overview for national id',
  },
  noInProgressApplicationsAvailable: {
    id: 'sp.applications:no-in-progress-applications-available',
    defaultMessage:
      'Engar umsóknir í vinnslu fundust hjá Ísland.is á þessari kennitölu',
    description:
      'Error message when no in-progress applications are found in the overview for national id',
  },
  noCompletedApplicationsAvailable: {
    id: 'sp.applications:no-completed-applications-available',
    defaultMessage:
      'Engar kláraðar umsóknir fundust hjá Ísland.is á þessari kennitölu',
    description:
      'Error message when no completed applications are found in the overview for national id',
  },
  defaultInstitutionLabel: {
    id: 'sp.applications:default-institution-label',
    defaultMessage: 'Allar stofnanir',
    description: 'Default institution filter label',
  },
})
