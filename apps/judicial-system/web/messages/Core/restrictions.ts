import { defineMessages } from 'react-intl'
import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'

// Strings for select court component
export const restrictions = defineMessages({
  [CaseCustodyRestrictions.NECESSITIES]: {
    id: 'judicial.system.core:restrictions.NECESSITIES',
    defaultMessage:
      'Gæsluföngum er heimilt að útvega sér sjálfir og taka við fæði og öðrum persónulegum nauðsynjum, þar á meðal fatnaði.',
    description: 'A - Eigin nauðsynjar',
  },
  [CaseCustodyRestrictions.ISOLATION]: {
    id: 'judicial.system.core:restrictions.ISOLATION',
    defaultMessage:
      'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    description: 'B - Einangrun',
  },
  [CaseCustodyRestrictions.VISITAION]: {
    id: 'judicial.system.core:restrictions.VISITAION',
    defaultMessage:
      'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
    description: 'C - Heimsóknarbann',
  },
  [CaseCustodyRestrictions.COMMUNICATION]: {
    id: 'judicial.system.core:restrictions.COMMUNICATION',
    defaultMessage:
      'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
    description: 'D - Bréfskoðun, símabann',
  },
  [CaseCustodyRestrictions.MEDIA]: {
    id: 'judicial.system.core:restrictions.MEDIA',
    defaultMessage:
      'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
    description: 'E - Fjölmiðlabann',
  },
  [CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION]: {
    id:
      'judicial.system.core:restrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
    defaultMessage:
      'Sé sakborningi gert að tilkynna sig reglulega á meðan á farbanni stendur er hægt að haka hér í þennan reit og skrifa nánari upplýsingar um tilkynningarskyldu í textareitinn fyrir neðan.',
    description: 'Tilkynningarskylda',
  },
  [CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT]: {
    id:
      'judicial.system.core:restrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT',
    defaultMessage:
      'Sé krafist þess að sakborningur afhendi vegabréf sitt, er hægt að haka í þennan reit og skrifa nánari upplýsingar um hvenær og hvert sakborningur skal afhenda vegabréfið í textareitinn fyrir neðan.',
    description: 'Afhending vegabréfs',
  },
  [CaseCustodyRestrictions.WORKBAN]: {
    id: 'judicial.system.core:restrictions.WORKBAN',
    defaultMessage:
      'Gæsluföngum er, eftir því sem unnt er, heimilt að útvega sér vinnu meðan á gæsluvarðhaldi stendur.',
    description: 'F - Vinnubann',
  },
})
