import { defineMessages } from 'react-intl'

// Confirmation
export const delimitation = {
  general: defineMessages({
    pageTitle: {
      id: 'dcap.application:section.delimitation.pageTitle',
      defaultMessage:
        'Til að Persónuvernd geti fjallað um kvörtunina þína þarf fyrst að kanna hvort hún fellur undir verksvið stofnunarinnar',
      description: 'Delimitation page title',
    },
    description: {
      id: 'dcap.application:section.delimitation.description',
      defaultMessage:
        'Til að ganga úr skugga um það biðjum við þig um að svara eftirfarandi spurningum:',
      description: 'Delimitation page description',
    },
  }),
  labels: defineMessages({
    inCourtProceedings: {
      id: 'dcap.application:section.delimitation.labels.inCourtProceedings',
      defaultMessage:
        'Er málið sem um ræðir í meðferð hjá dómstólum eða öðrum stjórnvöldum?',
      description: 'Label for inCourtProceedings field',
    },
    concernsMediaCoverage: {
      id: 'dcap.application:section.delimitation.labels.concernsMediaCoverage',
      defaultMessage: 'Ertu að kvarta yfir umfjöllun um þig í fjölmiðlum?',
      description: 'Label for concernsMediaCoverage field',
    },
  }),
}
