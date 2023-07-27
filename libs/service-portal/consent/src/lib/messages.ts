import { defineMessages } from 'react-intl'

export const m = defineMessages({
  consent: {
    id: 'portals-my-pages.consent:consent',
    defaultMessage: 'Gagnaöflun',
  },
  consentHeaderIntro: {
    id: 'portals-my-pages.consent:consent-header-intro',
    defaultMessage:
      'Hér eru leyfi sem þú hefur gefið til gagnaöflunar þeim aðilum sem nýta sér innskráningarþjónustu Ísland.is.',
  },
  consentHeaderDetails: {
    id: 'portals-my-pages.consent:consent-header-details',
    defaultMessage:
      'Þú getur afturkallað samþykki fyrir gagnaöflun, sem gæti þó haft áhrif á viðkomandi þjónustu.',
  },
  consentEmptyInfo: {
    id: 'portals-my-pages.consent:consent-empty-info',
    defaultMessage:
      'Þegar þú hefur gefið aðila leyfi til gagnaöflunar birtist það hér.',
  },
  consentUpdateError: {
    id: 'portals-my-pages.consent:consent-update-error',
    defaultMessage: 'Ekki tókst að uppfæra samþykkið.',
  },
  consentToggleButton: {
    id: 'portals-my-pages.consent:consent-toggle-button',
    defaultMessage: 'Samþykkja gagnaöflun: {item}',
  },
  consentExplanation: {
    id: 'portals-my-pages.consent:consent-explanation',
    defaultMessage:
      'Þú hefur veitt kerfinu aðgang að eftirfarandi gögnum frá þjónustuaðila:',
  },
})
