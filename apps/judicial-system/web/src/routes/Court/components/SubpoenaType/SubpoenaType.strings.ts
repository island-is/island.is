import { defineMessages } from 'react-intl'

export const strings = {
  ...defineMessages({
    title: {
      id: 'judicial.system.core:court.subpoena_type.title',
      defaultMessage: 'Tegund fyrirkalls',
      description:
        'Notaður sem titill fyrir Tegund fyrirkalls hluta á Fyrirkalls skjá í dómaraflæði í ákærum.',
    },
    absence: {
      id: 'judicial.system.core:court.subpoena_type.absence',
      defaultMessage: 'Útivistarfyrirkall',
      description:
        'Notaður sem texti fyrir Útivistarfyrirkall valkost á Fyrirkalls skjá í dómaraflæði í ákærum.',
    },
    arrest: {
      id: 'judicial.system.core:court.subpoena_type.arrest',
      defaultMessage: 'Handtökufyrirkall',
      description:
        'Notaður sem texti fyrir Handtökufyrirkall valkost á Fyrirkalls skjá í dómaraflæði í ákærum.',
    },
  }),
  alternativeService: 'Birt með öðrum hætti',
  alternativeServiceTooltip:
    'Ef ákæra og fyrirkall eru birt utan gáttarinnar, t.d. í þinghaldi eða í Lögbirtingablaðinu, þá er hægt að haka í þennan reit til að komast áfram án þess að gefa út fyrirkall í gegnum Réttarvörslugátt.',
  alternativeServiceDescriptionLabel: 'Skráðu hvernig birting fór fram',
  alternativeServiceDescriptionPlaceholder:
    'T.d. í þinghaldi eða í Lögbirtingablaðinu',
}
