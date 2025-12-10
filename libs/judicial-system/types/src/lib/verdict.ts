import { VerdictServiceStatus } from './defendant'
import { DocumentDeliveryMethod } from './policeDocument'

interface Lang {
  is: string
  en: string
}

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

const INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES_DESCRIPTION_EN = `
  <div>
    <p>
      If you did not appear in court when the case was registered and 
      the case was concluded with a judgment in your absence (so-called 
      “absent-attendance judgment”), you can request that the case be 
      heard again within four weeks of the judgment being served on you 
      or being delivered if no service was required. A case cannot be 
      reopened if the deadline has passed except by a ruling of the 
      Reopening Court.
    </p>
    <p>
      A request for reopening of an absenteeism case must be directed 
      to the court where the absenteeism judgment was delivered. The 
      case for which reopening is requested must be described, what 
      changes from the previous case decisions are requested, and what 
      evidence, arguments, and law the request is based on.
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

const INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS_DESCRIPTION_EN = `
  <div>
    <p>
      An appeal is a request for a higher court to review a judgment.
      Individuals who have been sentenced to <b>a)</b> imprisonment or
      <b>b)</b> to pay a fine or to have their property confiscated 
      amounting to at least 1,420,488 ISK may appeal a judgment of a 
      district court to the Landsréttur Court.
    </p>
    <p>
      An appeal must be declared in a written notice that must be 
      received by the <b>State Prosecutor</b> within <b>four weeks</b> 
      of the judgment being served on you or delivered if service was 
      not required. If neither you nor the State Prosecutor has appealed 
      the judgment within that time, it is considered that the District 
      Court is satisfied by both parties, in other words that both parties 
      accept the judgment. However, it is possible to apply for leave to 
      appeal to the <b>State Prosecutor</b> up to <b>three months</b> after 
      the end of the appeal period, provided that further conditions are met.
    </p>
    <p>
      Permission to appeal lesser sentences (which are generally not 
      appealable) may be applied for in a written notice which must 
      be received by the <b>Attorney General</b> within <b>four weeks</b> 
      of the date of the judgment.
    </p>
    <p>
      <a
        href="https://island.is/en/process-of-criminal-cases-in-the-icelandic-justice-system"
        target="_blank"
        rel="noopener noreferrer"
      >
        Further information on appeals to the Supreme Court of Iceland
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

const CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION_DESCRIPTION_EN = `
  <div>
    <p>
      A probation sentence means that the decision on punishment or the 
      execution of a punishment is postponed for a certain period of 
      time in exchange for your not committing any crime during that 
      period. This means that if you do not commit any crime during 
      the probation period, the punishment will be cancelled after that 
      period.
    </p>
    <p>
      However, if you are convicted of the same crime during the probation 
      period, the punishment will be added to your next sentence. It is 
      also permissible to set further conditions, such as that you do not 
      consume alcohol, other intoxicants, etc. during the probation period.
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

const COMMUNITY_SERVICE_DESCRIPTION_EN = `
  <div>
    <p>
      Community service involves temporary and unpaid work that can 
      replace imprisonment, both for non-suspended sentences and also 
      for the alternative punishment of fines. The decision on 
      community service and its implementation is in the hands of the 
      Icelandic Prison and Probation Administration.
    </p>
    <p>
      <a
        href="https://island.is/samfelagsthjonusta"
        target="_blank"
        rel="noopener noreferrer"
      >
        Conditions for serving sentences in community service
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

const DRIVING_RIGHTS_REVOKED_TRANSLATION_DESCRIPTION_EN = `
  <div>
    <p>
      Driving license is suspended during the period of suspension and 
      therefore you may not drive during that period regardless of 
      whether the judgment is appealed. Please note that if you are 
      suspended for twelve months or more, you will need to retake the 
      course and pass the academic and practical training to reactivate 
      your driving license when the period of suspension has expired. 
      If you are suspended for more than three years, the Chief of 
      Police may grant you permission to regain your driving license 
      after three years. If you have lost your driving license for life, 
      you can apply to get it reinstated after five years.
    </p>
    <p>
      <a
        href="https://island.is/en/driving-licence-disqualification"
        target="_blank"
        rel="noopener noreferrer"
      >
        Conditions for reinstatement of driving license
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

const FINES_AND_COSTS_DESCRIPTION_EN = `
  <div>
    <p>
      The District Commissioner of North-West Iceland is responsible 
      for collecting fines, legal costs and compensation claims. The 
      website of the District Commissioner's Office contains various 
      practical information, such as how to apply for payment 
      distribution, what remedies the District Commissioner has to 
      enforce payment of fines (debt settlement, seizure, forced 
      sale, etc.), about serving alternative sentences and more. 
    </p>
    <p>
      <a
        href="https://island.is/en/sektir-og-sakarkostnadur"
        target="_blank"
        rel="noopener noreferrer"
      >
        Fines and legal costs
      </a>
      <br />
      <a
        href="https://island.is/en/compensation-claims-for-criminal-offenses"
        target="_blank"
        rel="noopener noreferrer"
      >
        Recovering damages
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

const ALTERNATIVE_FINES_TRANSLATION_DESCRIPTION_EN = `
  <div>
    <p>
      Penalties are of two types: 1) imprisonment and 2) fines.
      Alternative punishment is a prison sentence that must be 
      served if a fine is not paid. If the fine amount is 100,000 
      ISK or more, 
      <a
        href="https://island.is/samfelagsthjonusta"
        target="_blank"
        rel="noopener noreferrer"
      >
        you can apply for community service
      </a>
      from the District Commissioner of North-West Iceland.
    </p>
    <p>
      <a
        href="https://www.domstolasyslan.is/default.aspx?pageid=dca5ad09-3b95-11ea-944c-005056bc0bdb"
        target="_blank"
        rel="noopener noreferrer"
      >
        Rules for alternative punishment for fines
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

const ITEM_CONFISCATION_DESCRIPTION_EN = `
  <div>
    <p>
      Profits and items related to an offense may be confiscated by 
      court order, such as money, phones, computers, cars or other 
      items that are generally prohibited, such as drugs or illegal 
      weapons, etc. What is confiscated becomes the property of the 
      state treasury unless otherwise specifically provided for by 
      law or when the proceeds are used to pay compensation claims 
      for victims of offenses. 
    </p>
    <p>
      In other words, the fact that money or items are confiscated 
      means that you cannot get them back.
    </p>
  </div>
`
export const informationForDefendantMap: Map<
  InformationForDefendant,
  { label: Lang; description: Lang; detail?: string }
> = new Map([
  [
    InformationForDefendant.INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES,
    {
      label: {
        is: 'Leiðbeiningar um endurupptöku útivistarmála',
        en: 'Instructions for reopening of absenteeism cases',
      },
      detail:
        'Þegar máli lýkur með útivistardómi getur ákærði ekki áfrýjað niðurstöðunni heldur verður hann að krefjast endurupptöku málsins.',
      description: {
        is: INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES_DESCRIPTION,
        en: INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES_DESCRIPTION_EN,
      },
    },
  ],
  [
    InformationForDefendant.INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS,
    {
      label: {
        is: 'Upplýsingar um áfrýjun til Landsréttar og áfrýjunarfresti',
        en: 'Information about appeals to the Landsréttur Court and appeal deadlines',
      },
      detail:
        'Einstaklingur getur áfrýjað dómi til Landsréttar ef viðkomandi hefur verið dæmdur í fangelsi eða til að greiða sekt eða sæta upptöku eigna sem nær áfrýjunarfjárhæð í einkamáli, kr. 1.420.488.',
      description: {
        is: INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS_DESCRIPTION,
        en: INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS_DESCRIPTION_EN,
      },
    },
  ],
  [
    InformationForDefendant.CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION,
    {
      label: {
        is: 'Þýðing skilorðsbundinnar refsingar og skilorðsrofs',
        en: 'Meaning of probation and probation violation',
      },
      description: {
        is: CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION_DESCRIPTION,
        en: CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION_DESCRIPTION_EN,
      },
    },
  ],
  [
    InformationForDefendant.DRIVING_RIGHTS_REVOKED_TRANSLATION,
    {
      label: {
        is: 'Þýðing sviptingar ökuréttinda',
        en: 'Meaning of driving license suspension',
      },
      description: {
        is: DRIVING_RIGHTS_REVOKED_TRANSLATION_DESCRIPTION,
        en: DRIVING_RIGHTS_REVOKED_TRANSLATION_DESCRIPTION_EN,
      },
    },
  ],
  [
    InformationForDefendant.ALTERNATIVE_FINES_TRANSLATION,
    {
      label: {
        is: 'Þýðing vararefsingar fésekta',
        en: 'Meaning of alternative punishment for fines',
      },
      description: {
        is: ALTERNATIVE_FINES_TRANSLATION_DESCRIPTION,
        en: ALTERNATIVE_FINES_TRANSLATION_DESCRIPTION_EN,
      },
    },
  ],
  [
    InformationForDefendant.COMMUNITY_SERVICE,
    {
      label: {
        is: 'Upplýsingar um skilyrði og umsókn um samfélagsþjónustu',
        en: 'Information on the conditions and application for community service',
      },
      description: {
        is: COMMUNITY_SERVICE_DESCRIPTION,
        en: COMMUNITY_SERVICE_DESCRIPTION_EN,
      },
    },
  ],
  [
    InformationForDefendant.FINES_AND_COSTS,
    {
      label: {
        is: 'Upplýsingar um greiðslu sekta, sakarkostnaðar og bóta',
        en: 'Information on payment of fines, legal costs and compensation',
      },
      description: {
        is: FINES_AND_COSTS_DESCRIPTION,
        en: FINES_AND_COSTS_DESCRIPTION_EN,
      },
    },
  ],
  [
    InformationForDefendant.ITEM_CONFISCATION,
    {
      label: {
        is: 'Upplýsingar um upptöku peninga og muna',
        en: 'Information on confiscation of money and items',
      },
      description: {
        is: ITEM_CONFISCATION_DESCRIPTION,
        en: ITEM_CONFISCATION_DESCRIPTION_EN,
      },
    },
  ],
])
