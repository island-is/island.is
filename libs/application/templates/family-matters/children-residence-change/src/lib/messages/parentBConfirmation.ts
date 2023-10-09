import { defineMessages } from 'react-intl'

// parentBConfirmation
export const parentBConfirmation = {
  general: defineMessages({
    pageTitle: {
      id: 'crc.application:section.parentBConfirmation.pageTitle',
      defaultMessage: 'Umsókn um breytt lögheimili móttekin',
      description: 'Parent B Confirmation page title',
    },
    description: {
      id: 'crc.application:section.parentBConfirmation.description',
      defaultMessage:
        'Umsókn ykkar um breytt lögheimili hefur verið móttekin og send áfram í vinnslu hjá sýslumanni.',
      description: 'Parent B Confirmation description',
    },
  }),
  nextSteps: defineMessages({
    title: {
      id: 'crc.application:section.parentBConfirmation.nextSteps.title',
      defaultMessage: 'Næstu skref',
      description: 'Parent B Confirmation next steps title',
    },
    description: {
      id: 'crc.application:section.parentBConfirmation.nextSteps.description#markdown',
      defaultMessage:
        '- Umsóknin fer nú til afgreiðslu hjá sýslumanni. Ef sýslumaður telur þörf á frekari upplýsingum mun hann hafa samband. Afgreiðsla sýslumans getur tekið tvær vikur.\\n- Ef sýslumaður samþykkir breytinguna fáið þið staðfestingu senda í rafræn skjöl hér á Island.is \\n- Sýslumaður mun síðan tilkynna Þjóðskrá Íslands um lögheimilisbreytinguna. \\n- Umsóknin er alltaf aðgengileg báðum foreldrum á Mínum síðum á Island.is.',
      description: 'Parent B Confirmation next steps description',
    },
  }),
  contractOverview: defineMessages({
    accordionTitle: {
      id: 'crc.application:section.parentBConfirmation.contractOverview.accordionTitle',
      defaultMessage: 'Yfirlit samnings',
      description:
        'Parent B Confirmation page accordion contract overview title',
    },
  }),
}
