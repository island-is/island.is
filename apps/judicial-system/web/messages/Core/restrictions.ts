import { CaseCustodyRestrictions } from '@island.is/judicial-system-web/src/graphql/schema'

export const restrictionsV2 = {
  [CaseCustodyRestrictions.NECESSITIES]: {
    title: 'A - Eigin nauðsynjar',
    description:
      'Gæsluföngum er heimilt að útvega sér sjálfir og taka við fæði og öðrum persónulegum nauðsynjum, þar á meðal fatnaði.',
  },
  [CaseCustodyRestrictions.ISOLATION]: {
    title: 'B - Einangrun',
    description:
      'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
  },
  [CaseCustodyRestrictions.VISITAION]: {
    title: 'C - Heimsóknarbann',
    description:
      'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
  },
  [CaseCustodyRestrictions.COMMUNICATION]: {
    title: 'D - Bréfskoðun, símabann',
    description:
      'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
  },
  [CaseCustodyRestrictions.MEDIA]: {
    title: 'E - Fjölmiðlabann',
    description:
      'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
  },
  [CaseCustodyRestrictions.WORKBAN]: {
    title: 'F - Vinnubann',
    description:
      'Gæsluföngum er, eftir því sem unnt er, heimilt að útvega sér vinnu meðan á gæsluvarðhaldi stendur.',
  },
  [CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION]: {
    title: 'Tilkynningarskylda',
    description:
      'Sé varnaraðila gert að tilkynna sig reglulega á meðan á farbanni stendur er hægt að haka hér í þennan reit og skrifa nánari upplýsingar um tilkynningarskyldu í textareitinn fyrir neðan.',
  },
  title:
    'Takmarkanir og tilhögun {caseType, select, ADMISSION_TO_FACILITY {vistunar} TRAVEL_BAN {farbanns} other {gæslu}}',
  fallback:
    'Ekki er farið fram á takmarkanir á {caseType, select, ADMISSION_TO_FACILITY {vistun} TRAVEL_BAN {farbanni} other {gæslu}}.',
  lawSection: '{sectionsLength, plural, one {lið} other {liðum}}',
  ruling:
    'Sækjandi kynnir varnaraðila tilhögun {caseType, select, ADMISSION_TO_FACILITY {vistunarinnar} other {gæsluvarðhaldsins}}, sem sé með takmörkunum skv. {restrictions} 1. mgr. 99. gr. laga nr. 88/2008.',
}
