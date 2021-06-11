import {
  capitalize,
  formatAccusedByGender,
  NounCases,
} from '@island.is/judicial-system/formatters'
import {
  CaseCustodyRestrictions,
  CaseGender,
} from '@island.is/judicial-system/types'

export const restrictions = [
  {
    title: 'B - Einangrun',
    id: CaseCustodyRestrictions.ISOLATION,
    info:
      'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
  },
  {
    title: 'C - Heimsóknarbann',
    id: CaseCustodyRestrictions.VISITAION,
    info:
      'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
  },
  {
    title: 'D - Bréfskoðun, símabann',
    id: CaseCustodyRestrictions.COMMUNICATION,
    info:
      'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
  },
  {
    title: 'E - Fjölmiðlabann',
    id: CaseCustodyRestrictions.MEDIA,
    info:
      'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
  },
]

export const judgeRestrictions = restrictions.filter(
  (provision) => provision.id !== CaseCustodyRestrictions.ISOLATION,
)

export const isolation = (accusedGender?: CaseGender) =>
  restrictions
    .filter((provision) => provision.id === CaseCustodyRestrictions.ISOLATION)
    .map((provision) => {
      return {
        ...provision,
        title: `${capitalize(
          formatAccusedByGender(accusedGender, NounCases.NOMINATIVE),
        )} skal sæta einangrun`,
      }
    })

export const alternativeTravelBanRestrictions = [
  {
    title: 'Tilkynningarskylda',
    id: CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
    info:
      'Sé sakborningi gert að tilkynna sig reglulega á meðan á farbanni stendur er hægt að haka hér í þennan reit og skrifa nánari upplýsingar um tilkynningarskyldu í textareitinn fyrir neðan.',
  },
  {
    title: 'Afhending vegabréfs',
    id: CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
    info:
      'Sé krafist þess að sakborningur afhendi vegabréf sitt, er hægt að haka í þennan reit og skrifa nánari upplýsingar um hvenær og hvert sakborningur skal afhenda vegabréfið í textareitinn fyrir neðan.',
  },
]
