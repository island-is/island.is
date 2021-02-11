import { defineMessages } from 'react-intl'

// Confirmation
export const confirmation = {
  general: defineMessages({
    pageTitle: {
      id: 'crc.application:section.confirmation.pageTitle',
      defaultMessage: 'Umsókn um breytt lögheimili móttekin',
      description: 'Confirmation page title',
    },
    description: {
      id: 'crc.application:section.confirmation.description',
      defaultMessage:
        '- Hitt foreldrið verður að samþykkja breytingar á lögheimili með rafrænni undirritun.\n- Eftir að hitt foreldrið undirritar samning um breytingu á lögheimili fer málið til afgreiðslu hjá sýslumanni.\n- Sýslumaður mun hafa samband ef þörf er á frekari upplýsingum eða ef óskað hefur verið eftir viðtali.\n- Staðfesting sýslumanns verður send í rafræn skjöl á Island.is.\n- Málsnúmer: __{applicationNumber}__',
      description: 'Confirmation description',
    },
  }),
}
