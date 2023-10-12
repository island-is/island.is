import { defineMessage, defineMessages } from 'react-intl'

import { CaseCustodyRestrictions } from '@island.is/judicial-system-web/src/graphql/schema'

export const restrictionsV2 = {
  [CaseCustodyRestrictions.NECESSITIES]: defineMessages({
    title: {
      id: 'judicial.system.core:restrictionsV2.NECESSITIES.title',
      defaultMessage: 'A - Eigin nauðsynjar',
      description: 'A - Eigin nauðsynjar',
    },
    description: {
      id: 'judicial.system.core:restrictionsV2.NECESSITIES.description',
      defaultMessage:
        'Gæsluföngum er heimilt að útvega sér sjálfir og taka við fæði og öðrum persónulegum nauðsynjum, þar á meðal fatnaði.',
      description: 'A - Eigin nauðsynjar',
    },
  }),
  [CaseCustodyRestrictions.ISOLATION]: defineMessages({
    title: {
      id: 'judicial.system.core:restrictionsV2.ISOLATION.title',
      defaultMessage: 'B - Einangrun',
      description: 'B - Einangrun',
    },
    description: {
      id: 'judicial.system.core:restrictionsV2.ISOLATION.description',
      defaultMessage:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
      description: 'B - Einangrun',
    },
  }),
  [CaseCustodyRestrictions.VISITAION]: defineMessages({
    title: {
      id: 'judicial.system.core:restrictionsV2.VISITAION.title',
      defaultMessage: 'C - Heimsóknarbann',
      description: 'C - Heimsóknarbann',
    },
    description: {
      id: 'judicial.system.core:restrictionsV2.VISITAION.description',
      defaultMessage:
        'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
      description: 'C - Heimsóknarbann',
    },
  }),
  [CaseCustodyRestrictions.COMMUNICATION]: defineMessages({
    title: {
      id: 'judicial.system.core:restrictionsV2.COMMUNICATION.title',
      defaultMessage: 'D - Bréfskoðun, símabann',
      description: 'D - Bréfskoðun, símabann',
    },
    description: {
      id: 'judicial.system.core:restrictionsV2.COMMUNICATION.description',
      defaultMessage:
        'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
      description: 'D - Bréfskoðun, símabann',
    },
  }),
  [CaseCustodyRestrictions.MEDIA]: defineMessages({
    title: {
      id: 'judicial.system.core:restrictionsV2.MEDIA.title',
      defaultMessage: 'E - Fjölmiðlabann',
      description: 'E - Fjölmiðlabann',
    },
    description: {
      id: 'judicial.system.core:restrictionsV2.MEDIA.description',
      defaultMessage:
        'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
      description: 'E - Fjölmiðlabann',
    },
  }),
  [CaseCustodyRestrictions.WORKBAN]: defineMessages({
    title: {
      id: 'judicial.system.core:restrictionsV2.WORKBAN.title',
      defaultMessage: 'F - Vinnslubann',
      description: 'F - Vinnslubann',
    },
    description: {
      id: 'judicial.system.core:restrictionsV2.WORKBAN.description',
      defaultMessage:
        'Gæsluföngum er, eftir því sem unnt er, heimilt að útvega sér vinnu meðan á gæsluvarðhaldi stendur.',
      description: 'F - Vinnubann',
    },
  }),
  [CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION]:
    defineMessages({
      title: {
        id: 'judicial.system.core:restrictionsV2.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION.title',
        defaultMessage: 'Tilkynningarskylda',
        description: 'Tilkynningarskylda',
      },
      description: {
        id: 'judicial.system.core:restrictionsV2.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
        defaultMessage:
          'Sé sakborningi gert að tilkynna sig reglulega á meðan á farbanni stendur er hægt að haka hér í þennan reit og skrifa nánari upplýsingar um tilkynningarskyldu í textareitinn fyrir neðan.',
        description: 'Tilkynningarskylda',
      },
    }),
  title: defineMessage({
    id: 'judicial.system.core:restrictionsV2_title',
    defaultMessage:
      'Takmarkanir og tilhögun {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæslu}}',
    description:
      'Notaður sem titil þegar útlistað er hvaða takmarkanir eru á gæslu/vistun/farbanni',
  }),
  fallback: defineMessage({
    id: 'judicial.system.core:restrictionsV2_fallback',
    defaultMessage:
      'Ekki er farið fram á takmarkanir á {caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbanni} other {gæslu}}.',
    description:
      'Notaður til þessa að tilgreina að ekki er farið fram á takmarkanir',
  }),
  lawSection: defineMessage({
    id: 'judicial.system.core:restrictionsV2_lawSection',
    defaultMessage: '{sectionsLength, plural, one {lið} other {liðum}}',
    description: 'Lið',
  }),
  ruling: defineMessage({
    id: 'judicial.system.core:restrictionsV2_ruling',
    defaultMessage:
      'Sækjandi kynnir kærða tilhögun {caseType, select, ADMISSION_TO_FACILITY {vistunarinnar} other {gæsluvarðhaldsins}}, sem sé með takmörkunum skv. {restrictions} 1. mgr. 99. gr. laga nr. 88/2008.',
    description: 'Notaður til þessa að tilgreina að hvaða bann er',
  }),
}
