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
        '{count, plural, =0 {Umsókn þín um breytt lögheimili hefur verið móttekin.} one  {Umsókn þín um breytt lögheimili hefur verið móttekin. Hlekkur á umsóknina hefur verið sendur hinu foreldrinu {phoneNumberParagraph}{emailParagraph} til undirritunar.} other {Umsókn þín um breytt lögheimili hefur verið móttekin. Hlekkur á umsóknina hefur verið sendur hinu foreldrinu {emailParagraph} og {phoneNumberParagraph} til undirritunar.}}',
      description: 'Confirmation description',
      paragraphs: defineMessages({
        phoneNumber: {
          id: 'crc.application:section.confirmation.description.paragraphs.phoneNumber#markdown',
          defaultMessage: 'í SMS síma {phoneNumber}',
          description:
            'Confirmation description phone number paragraph which is used in section.confirmation.description',
        },
        email: {
          id: 'crc.application:section.confirmation.description.paragraphs.email#markdown',
          defaultMessage: 'á netfangið {email}',
          description:
            'Confirmation description email paragraph which is used in section.confirmation.description',
        },
      }),
    },
  }),
  nextSteps: defineMessages({
    title: {
      id: 'crc.application:section.confirmation.nextSteps.title',
      defaultMessage: 'Næstu skref',
      description: 'Confirmation next steps title',
    },
    description: {
      id: 'crc.application:section.confirmation.nextSteps.description#markdown',
      defaultMessage:
        '- {parentBName} þarf nú að lesa yfir og taka afstöðu til samningsins.\\n- Ef undirritaður samningur er ekki sendur til sýslumanns fyrir __{date}__ þarf að hefja umsóknarferli að nýju á Island.is. Vegna persónuverndar og trúnaðar er ekki hægt að geyma umsóknargögn og samningsdrög varanlega hjá Island.is. Eftir undirritun munu báðir foreldrar fá sent afrit af undirrituðum samning í tölvupósti.\\n- Næst fer umsóknin til afgreiðslu hjá sýslumanni. Ef sýslumaður telur þörf á frekari upplýsingum mun hann hafa samband. Afgreiðsla sýslumans getur tekið tvær vikur. \\n- Ef sýslumaður samþykkir breytinguna fáið þið staðfestingu senda í rafræn skjöl hér á Island.is\\n- Sýslumaður mun síðan tilkynna Þjóðskrá Íslands um lögheimilisbreytinguna.\\n- Til að meðlag fari í innheimtu þarft þú sem nýtt lögheimilislögforeldri að skila undirrituðum samningi rafrænt til Tryggingastofnunar eftir að hann hefur verið staðfestur.\\n- Umsóknin er alltaf aðgengileg báðum foreldrum á Mínum síðum á Island.is. Hlekkurinn að neðan er beint á umsóknina fyrir hitt forsjárforeldrið.',
      description: 'Confirmation next steps description',
    },
  }),
  contractOverview: defineMessages({
    accordionTitle: {
      id: 'crc.application:section.confirmation.contractOverview.accordionTitle',
      defaultMessage: 'Yfirlit samnings',
      description: 'Confirmation page accordion contract overview title',
    },
  }),
}
