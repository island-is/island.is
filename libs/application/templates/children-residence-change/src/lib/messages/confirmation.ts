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
        '{count, plural, =0 {Umsókn þín um breytt lögheimili hefur verið móttekin.} one  {Umsókn þín um breytt lögheimili hefur verið móttekin. Hlekkur á umsóknina hefur verið sendur hinu foreldrinu {phoneNumberParagraph}{emailParagraph} til undirritunar} other {Umsókn þín um breytt lögheimili hefur verið móttekin. Hlekkur á umsóknina hefur verið sendur hinu foreldrinu {emailParagraph} og {phoneNumberParagraph} til undirritunar.}}',
      description: 'Confirmation description',
      paragraphs: defineMessages({
        phoneNumber: {
          id:
            'crc.application:section.confirmation.description.paragraphs.phoneNumber',
          defaultMessage: 'í SMS síma {phoneNumber}',
          description:
            'Confirmation description phone number paragraph which is used in section.confirmation.description',
        },
        email: {
          id:
            'crc.application:section.confirmation.description.paragraphs.email',
          defaultMessage: 'á netfangið {email}',
          description:
            'Confirmation description email paragraph which is used in section.confirmation.description',
        },
      }),
    },
  }),
  nextSteps: defineMessages({
    description: {
      id: 'crc.application:section.confirmation.description#markdown',
      defaultMessage:
        '- Hitt foreldrið verður að samþykkja breytingar á lögheimili með rafrænni undirritun.\\n- Eftir að hitt foreldrið undirritar samning um breytingu á lögheimili fer málið til afgreiðslu hjá sýslumanni.\\n- Sýslumaður mun hafa samband ef þörf er á frekari upplýsingum eða ef óskað hefur verið eftir viðtali.\\n- Staðfesting sýslumanns verður send í rafræn skjöl á Island.is.\\n- Málsnúmer: __{applicationNumber}__',
      description: 'Confirmation description',
    },
  }),
}
