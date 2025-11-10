import { VerdictServiceStatus } from './defendant'
import { DocumentDeliveryMethod } from './policeDocument'

export enum ServiceRequirement {
  REQUIRED = 'REQUIRED', // Ruling must be served
  NOT_REQUIRED = 'NOT_REQUIRED', // Ruling does not need to be served
  NOT_APPLICABLE = 'NOT_APPLICABLE', // Defendant was present in court
}

// We could possibly also have an APPEAL option here if we want,
// but we can also see from the verdict appeal date if the verdict
// has been appealed
export enum VerdictAppealDecision {
  ACCEPT = 'ACCEPT', // Una
  POSTPONE = 'POSTPONE', // Taka áfrýjunarfrest
}

export enum InformationForDefendant {
  INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES = 'INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES',
  INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS = 'INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS',
  CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION = 'CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION',
  DRIVING_RIGHTS_REVOKED_TRANSLATION = 'DRIVING_RIGHTS_REVOKED_TRANSLATION',
  ALTERNATIVE_FINES_TRANSLATION = 'ALTERNATIVE_FINES_TRANSLATION',
  COMMUNITY_SERVICE = 'COMMUNITY_SERVICE',
  FINES_AND_COSTS = 'FINES_AND_COSTS',
  ITEM_CONFISCATION = 'ITEM_CONFISCATION',
}

export const mapPoliceVerdictDeliveryStatus = ({
  delivered,
  deliveredOnPaper,
  deliveredOnIslandis,
  deliveredToLawyer,
  deliveredToDefendant,
  deliveryMethod,
}: {
  delivered?: boolean
  deliveredOnPaper?: boolean
  deliveredOnIslandis?: boolean
  deliveredToLawyer?: boolean
  deliveredToDefendant?: boolean
  deliveryMethod?: string
}) => {
  if (delivered) {
    if (deliveryMethod === DocumentDeliveryMethod.LEGAL_PAPER) {
      return VerdictServiceStatus.LEGAL_PAPER
    }
    if (deliveredOnPaper || deliveredToDefendant) {
      return VerdictServiceStatus.IN_PERSON
    }
    if (deliveredOnIslandis) {
      return VerdictServiceStatus.ELECTRONICALLY
    }
    if (deliveredToLawyer) {
      return VerdictServiceStatus.DEFENDER
    }
    return VerdictServiceStatus.FAILED
  }
  return undefined
}

// information html descriptions
const INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES_DESCRIPTION = `
  <div>
    <p>
      Ef þú komst ekki fyrir dóm þegar málið var þingfest og málinu
      var lokið með dómi í fjarveru þinni (svokölluðum
      „útivistardómi“) getur þú krafist þess að málið verði tekið
      fyrir á ný innan fjögurra vikna frá því að dómurinn var birtur
      þér eða hann var kveðinn upp hafi birtingar ekki verið þörf.
      Ekki er hægt að endurupptaka mál ef frestur er liðinn nema með
      úrskurði Endurupptökudóms.
    </p>
    <p>
      Kröfu um endurupptöku útivistarmáls skal beina til þess dómstóls
      þar sem útivistardómur var kveðinn upp. Greina skal frá því máli
      sem krafist er endurupptöku á, hvaða breytinga frá fyrri
      málsúrslitum er krafist og á hvaða sönnunargögnum, rökum og
      lögum sú krafa er byggð á.
    </p>
  </div>
`

const INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS_DESCRIPTION = `
  <div>
    <p>
      Í áfrýjun felst að leitað er endurskoðunar æðri dómstóls á dómi.
      Einstaklingar sem hafa verið dæmdir í <b>a)</b> fangelsi eða
      <b>b)</b> til að greiða sekt eða sæta upptöku eigna sem nema að
      minnsta kosti 1.420.488 krónum, geta áfrýjað dómi héraðsdóms til
      Landsréttar.
    </p>
    <p>
      Áfrýjun þarf að lýsa yfir í skriflegri tilkynningu sem verður að
      berast <b>ríkissaksóknara</b> innan <b>fjögurra vikna</b> frá
      því að dómurinn var birtur þér eða hann var kveðinn upp hafi
      birtingar ekki verið þörf. Hafir hvorki þú né ríkissaksóknari
      áfrýjað dómnum innan þess tíma er litið svo á að héraðsdómi sé
      unað af beggja hálfu, með öðrum orðum að báðir sætti sig við
      niðurstöðu dómsins. Þó er hægt að sækja um áfrýjunarleyfi til
      <b>ríkissaksóknara</b> allt að <b>þremur mánuðum</b> eftir lok
      áfrýjunarfrests að nánari skilyrðum uppfylltum.
    </p>
    <p>
      Hægt er að sækja um leyfi til að áfrýja vægari dómum (sem alla
      jafna er ekki hægt að áfrýja) í skriflegri tilkynningu sem þarf
      að berast <b>ríkissaksóknara</b> innan <b>fjögurra vikna</b> frá
      birtingu dóms.
    </p>
    <p>
      <a
        href="https://island.is/ferill-sakamala-i-rettarkerfinu"
        target="_blank"
        rel="noopener noreferrer"
      >
        Nánari upplýsingar um áfrýjun sakamála til Landsréttar
      </a>
    </p>
  </div>
`

const CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION_DESCRIPTION = `
  <div>
    <p>
      Skilorðsbundinn dómur þýðir að ákvörðun refsingar eða fullnustu
      refsingar er frestað í tiltekinn tíma gegn því að þú brjótir
      ekki af þér á því tímabili. Í því felst að ef þú brýtur ekki af
      þér á skilorðstímanum fellur refsingin niður að honum liðnum.
    </p>
    <p>
      Verðir þú hins vegar uppvís af samskonar broti á skilorðstímanum
      verður refsingunni bætt við næsta dóm. Einnig er heimilt að
      setja frekari skilyrði, svo sem um að þú neytir ekki áfengis,
      annarra vímuefna o.s.frv. á skilorðstímanum.
    </p>
  </div>
`

const COMMUNITY_SERVICE_DESCRIPTION = `
  <div>
      <p>
        Samfélagsþjónusta felur í sér tímabundið og ólaunað starf sem
        getur komið í stað fangelsisvistunar, bæði vegna
        óskilorðsbundinna refsinga og einnig vegna vararefsingar
        fésekta. Ákvörðun um samfélagsþjónustu og framkvæmd hennar er í
        höndum Fangelsismálastofnunar.
      </p>
      <p>
        <a
          href="https://island.is/samfelagsthjonusta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Skilyrði þess að taka út dóma í samfélagsþjónustu
        </a>
      </p>
    </div>
`

const DRIVING_RIGHTS_REVOKED_TRANSLATION_DESCRIPTION = `
  <div>
    <p>
      Ökuréttindi falla niður á tímabili sviptingar og því máttu ekki
      keyra á því tímabili óháð því hvort dómi sé áfrýjað. Athugaðu að
      ef þú ert svipt/ur ökuréttindum í tólf mánuði eða lengur þarft
      þú að fara aftur á námskeið og standast bóklegt og verklegt nám
      til að virkja ökuréttindi á ný þegar tímabil sviptingar er
      liðið. Ef þú ert svipt/ur í lengri tíma en þrjú ár getur
      lögreglustjóri veitt þér heimild til að fá ökuréttindi að nýju
      að þremur árum liðnum. Hafir þú misst ökuréttindi ævilangt er
      hægt að sækja um að fá þau aftur að fimm árum liðnum
    </p>
    <p>
      <a
        href="https://island.is/endurveiting-oekurettar"
        target="_blank"
        rel="noopener noreferrer"
      >
        Skilyrði fyrir endurveitingu ökuréttar
      </a>
    </p>
  </div>
`

const FINES_AND_COSTS_DESCRIPTION = `
  <div>
    <p>
      Sýslumaðurinn á Norðurlandi vestra sér um að innheimta sektir,
      sakarkostnað og bótakröfur. Á heimasíðu sýslumannsembættisins
      eru ýmsar hagnýtar upplýsingar, svo sem hvernig sækja megi um
      greiðsludreifingu, hvaða úrræði sýslumaður hefur til að knýja
      fram greiðslu á sektum (skuldajöfnuður, fjárnám, nauðungarsala
      o.s.frv.), um afplánun vararefsinga og fleira.
    </p>
    <p>
      <a
        href="https://island.is/sektir-og-sakarkostnadur"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sektir og sakarkostnaður
      </a>
      <br />
      <a
        href="https://island.is/endurkroefur-skadabota"
        target="_blank"
        rel="noopener noreferrer"
      >
        Endurkrafa skaðabóta
      </a>
    </p>
  </div>
`

const ALTERNATIVE_FINES_TRANSLATION_DESCRIPTION = `
  <div>
    <p>
      Refsingar eru tvenns konar: 1) fangelsi og 2) fésekt.
      Vararefsing er fangelsisrefsing sem þarf að afplána ef sekt er
      ekki greidd. Ef sektar upphæð er 100.000 ISK eða hærri er
      <a
        href="https://island.is/samfelagsthjonusta"
        target="_blank"
        rel="noopener noreferrer"
      >
        hægt að sækja um samfélagsþjónustu
      </a>
      hjá sýslumanni á Norðurlandi vestra.
    </p>
    <p>
      <a
        href="https://www.domstolasyslan.is/default.aspx?pageid=dca5ad09-3b95-11ea-944c-005056bc0bdb"
        target="_blank"
        rel="noopener noreferrer"
      >
        Reglur um vararefsingu fésektar
      </a>
    </p>
  </div>
`
const ITEM_CONFISCATION_DESCRIPTION = `
  <div>
    <p>
      Gera má upptæka með dómi ávinning og muni sem tengjast broti,
      t.d. peningar, símar, tölvur, bifreiðar eða aðra hluti sem eru
      almennt bannaðir eins og t.d. fíkniefni eða ólögleg vopn o.þ.h.
      Það sem gert er upptækt verður eign ríkissjóðs nema annað sé
      sérstaklega ákveðið í lögum eða þegar andvirðið er nýtt til að
      greiða bótakröfu brotaþola.
    </p>
    <p>
      Það að peningar eða hlutir séu gerðir upptækir þýðir með öðrum
      orðum að þú getir ekki fengið þá aftur.
    </p>
  </div>
`

export const informationForDefendantMap: Map<
  InformationForDefendant,
  { label: string; description: string; detail?: string }
> = new Map([
  [
    InformationForDefendant.INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES,
    {
      label: 'Leiðbeiningar um endurupptöku útivistarmála',
      description: INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES_DESCRIPTION,
    },
  ],
  [
    InformationForDefendant.INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS,
    {
      label: 'Upplýsingar um áfrýjun til Landsréttar og áfrýjunarfresti',
      detail:
        'Einstaklingur getur áfrýjað dómi til Landsréttar ef viðkomandi hefur verið dæmdur í fangelsi eða til að greiða sekt eða sæta upptöku eigna sem nær áfrýjunarfjárhæð í einkamáli, kr. 1.420.488.',
      description: INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS_DESCRIPTION,
    },
  ],
  [
    InformationForDefendant.CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION,
    {
      label: 'Þýðing skilorðsbundinnar refsingar og skilorðsrofs',
      description:
        CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION_DESCRIPTION,
    },
  ],
  [
    InformationForDefendant.DRIVING_RIGHTS_REVOKED_TRANSLATION,
    {
      label: 'Þýðing sviptingar ökuréttinda',
      description: DRIVING_RIGHTS_REVOKED_TRANSLATION_DESCRIPTION,
    },
  ],
  [
    InformationForDefendant.ALTERNATIVE_FINES_TRANSLATION,
    {
      label: 'Þýðing vararefsingar fésekta',
      description: ALTERNATIVE_FINES_TRANSLATION_DESCRIPTION,
    },
  ],
  [
    InformationForDefendant.COMMUNITY_SERVICE,
    {
      label: 'Upplýsingar um skilyrði og umsókn um samfélagsþjónustu',
      description: COMMUNITY_SERVICE_DESCRIPTION,
    },
  ],
  [
    InformationForDefendant.FINES_AND_COSTS,
    {
      label: 'Upplýsingar um greiðslu sekta, sakarkostnaðar og bóta',
      description: FINES_AND_COSTS_DESCRIPTION,
    },
  ],
  [
    InformationForDefendant.ITEM_CONFISCATION,
    {
      label: 'Upplýsingar um upptöku peninga og muna',
      description: ITEM_CONFISCATION_DESCRIPTION,
    },
  ],
])
