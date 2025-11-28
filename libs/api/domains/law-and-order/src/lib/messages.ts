import { defineMessages } from 'react-intl'

export const m = defineMessages({
  summon: {
    id: 'api.law-and-order:summon',
    defaultMessage: 'Fyrirkall',
  },
  seeSummon: {
    id: 'api.law-and-order:see-summon',
    defaultMessage: 'Sjá fyrirkall',
  },
  seeSummonInMailbox: {
    id: 'api.law-and-order:see-summon-in-mailbox',
    defaultMessage: 'Sjá fyrirkall í pósthólfi',
  },
  mailboxLink: {
    id: 'api.law-and-order:mailbox-link',
    defaultMessage: '/postholf',
  },
  summonLink: {
    id: 'api.law-and-order:summon-link',
    defaultMessage: `/log-og-reglur/domsmal/{caseId}/fyrirkall`,
  },
  waiveMessage: {
    id: 'api.law-and-order:no-defender',
    defaultMessage: 'Ég óska ekki eftir verjanda',
  },
  chooseMessage: {
    id: 'api.law-and-order:choosing-lawyer',
    defaultMessage:
      'Ég óska þess að valinn lögmaður verði skipaður verjandi minn',
  },
  delayMessage: {
    id: 'api.law-and-order:delay-choice',
    defaultMessage:
      'Ég óska eftir fresti fram að þingfestingu til þess að tilnefna verjanda',
  },
  delegateMessage: {
    id: 'api.law-and-order:choose-for-me',
    defaultMessage: 'Ég fel dómara málsins að tilnefna og skipa mér verjanda',
  },
  policeAnalysis: {
    id: 'api.law-and-order:police-analysis',
    defaultMessage: 'Greining lögreglu',
  },
  criminalInvestigation: {
    id: 'api.law-and-order:criminal-investigation',
    defaultMessage: 'Rannsókn sakamáls',
  },
  postInvestigation: {
    id: 'api.law-and-order:post-investigation',
    defaultMessage: 'Að lokinni rannsókn',
  },
  indictment: {
    id: 'api.law-and-order:indictment',
    defaultMessage: 'Ákæra',
  },
  caseSentToCourt: {
    id: 'api.law-and-order:case-sent-to-court',
    defaultMessage: 'Mál sent til dómstóla',
  },
  statusDescriptionReceived: {
    id: 'api.law-and-order:status-description-received',
    defaultMessage:
      'Málið þitt hefur verið móttekið og bíður þess að vera tekið til skoðunar.',
  },
  statusDescriptionBackToInvestigation: {
    id: 'api.law-and-order:status-description-back-to-investigation',
    defaultMessage:
      'Málið þitt hefur verið sent aftur í rannsókn sem þýðir að ákærandi telur að skoða þurfi einhverja þætti í máli þínu betur.',
  },
  statusDescriptionUnderInvestigation: {
    id: 'api.law-and-order:status-description-under-investigation',
    defaultMessage:
      'Lögregla er byrjuð að rannsaka málið þitt. Það þýðir að lögregla kallar fram öll gögn sem varpað geta ljósi á atvikið, gögnin geta verið mjög margvísleg, allt eftir efni kærunnar. Rætt verður við vitni, sakborninga og aðra sem geta varpað ljósi á málið. Þetta tekur tíma og öll gögn skila sér ekki strax.',
  },
  statusDescriptionCaseOnHold: {
    id: 'api.law-and-order:status-description-case-on-hold',
    defaultMessage:
      'Mál þitt hefur verið sett í bið. Þegar mál er sett stöðuna „í bið" þýðir það að jafnaði að rannsókn málsins liggur niðri, t.d. þegar beðið er gagna frá innlendum eða erlendum yfirvöldum eða stofnunum eða aðilar máls finnast ekki eða eru erlendis.',
  },
  statusDescriptionCaseSentToOtherDepartment: {
    id: 'api.law-and-order:status-description-case-sent-to-other-department',
    defaultMessage:
      'Mál þitt hefur verið sent til annars embættis og rannsókn málsins heldur áfram þar. Sem stendur er þjónustugáttin tilraunaverkefni Lögreglunnar á höfuðborgarsvæðinu. Staða málsins verður því ekki uppfærð frekar. Hægt er að hafa samband við embættið sem hefur tekið við rannsókn málsins eða óska eftir að réttargæslumaður sæki frekari upplýsingar.',
  },
  statusDescriptionProsecutorReview: {
    id: 'api.law-and-order:status-description-prosecutor-review',
    defaultMessage:
      'Rannsókn á máli þínu er lokið og hefur það verið afhent ákæranda til yfirferðar. Ákærandi fer yfir rannsókn málsin og gengur úr skugga um að lögregla hafi aflað allra nauðsynlegra gagna og rannsókn málsins sé lokið',
  },
  statusDescriptionInvestigationStopped: {
    id: 'api.law-and-order:status-description-investigation-stopped#markdown',
    defaultMessage:
      'Ákærandi hefur farið yfir mál þitt og tekið þá ákvörðun að hætta rannsókn. Margar ástæður eru fyrir því að ákveðið er að hætta rannsókn sakamála en réttargæslumaður þinn veitir upplýsingar um ákvörðunina. Þú getur kært þessa ákvörðun til ríkissaksóknara en kæra þarf að berast innan mánaðar frá ákvörðun. Nánari upplýsingar um kæru til ríkissaksóknara má finna [hér](https://www.rikissaksoknari.is/kaerdar-akvardanir)',
  },
  statusDescriptionCaseDismissed: {
    id: 'api.law-and-order:status-description-case-dismissed',
    defaultMessage:
      'Héraðssaksóknari hefur farið yfir mál þitt og tekið ákvörðun um að fella málið niður. Margar ástæður eru fyrir því að ákveðið er að fella mál niður en oftast er það vegna þess að rannsókn hefur ekki leitt til fullnægjandi upplýsinga til að líklegt sé að mál leiði til sakfellingar. Réttargæslumaður þinn veitir upplýsingar um ákvörðunina. Þú getur kært þessa ákvörðun til ríkissaksóknara en kæra þarf að berast innan mánaðar frá ákvörðun.',
  },
  statusDescriptionDecisionAppealed: {
    id: 'api.law-and-order:status-description-decision-appealed',
    defaultMessage:
      'Niðurfelling málsins hefur verið kærð til ríkissaksóknara, sem ber að taka afstöðu til kærunnar innan þriggja mánaða frá því að hún berst. Ríkissaksóknari ýmist staðfestir kærða ákvörðun eða fellir hana úr gildi og í slíkum tilvikum annað hvort með fyrirmælum um frekari rannsókn eða útgáfu ákæru.',
  },
  statusDescriptionDecisionConfirmed: {
    id: 'api.law-and-order:status-description-decision-confirmed',
    defaultMessage:
      'Kæra þín á ákvörðun lögreglustjóra eða héraðssaksóknara um að hætta rannsókn máls, fella mál niður eða falla frá saksókn hefur verið tekin til skoðunar hjá ríkissaksóknara. Ríkissaksóknari hefur staðfest fyrri ákvörðun lögreglu eða héraðssaksóknara.',
  },
  statusDescriptionDecisionOverturned: {
    id: 'api.law-and-order:status-description-decision-overturned',
    defaultMessage:
      'Kæra þín á ákvörðun lögreglustjóra eða héraðssaksóknara um að hætta rannsókn máls, fella mál niður eða falla frá saksókn hefur verið tekin til skoðunar hjá ríkissaksóknara. Ríkissaksóknari hefur fellt úr gildi fyrri ákvörðun lögreglu eða héraðssaksóknara annað hvort með fyrirmælam um frekari rannsókn eða útgáfu ákæru.',
  },
  statusDescriptionCaseClosed: {
    id: 'api.law-and-order:status-description-case-closed',
    defaultMessage: 'Meðferð málsins hjá lögreglu er lokið.',
  },
  statusDescriptionProsecutionDropped: {
    id: 'api.law-and-order:status-description-prosecution-dropped',
    defaultMessage:
      'Héraðssaksóknari hefur farið yfir mál þitt og tekið ákvörðun um að falla frá saksókn. Margar ástæður eru fyrir því að ákveðið er að falla frá saksókn en nánari upplýsingar er að finna í tilkynningu um ákvörðunina undir skjöl.',
  },
  statusDescriptionDistrictProsecutorReview: {
    id: 'api.law-and-order:status-description-district-prosecutor-review',
    defaultMessage:
      'Málið þitt hefur verið sent héraðssaksóknara. Það þýðir að málið er talið fullrannsakað en héraðssaksóknari tekur ákvörðun um hvort ákæra eigi í málinu eða fella það niður.',
  },
  statusDescriptionIndictment: {
    id: 'api.law-and-order:status-description-indictment',
    defaultMessage:
      'Héraðssaksóknari hefur farið yfir mál þitt og tekið ákvörðun um að höfða sakamál. Málið og öll sönnunargögn eru send til héraðsdóms og gefin verður út ákæra í máli þínu á hendur sakborningi.',
  },
  statusDescriptionCourtScheduling: {
    id: 'api.law-and-order:status-description-court-scheduling',
    defaultMessage:
      'Mál þitt hefur verið móttekið af héraðsdómi og sett hefur verið dagsetning þinghalds. Það þýðir að ákveðið hefur verið hvenær sönnunargögn í máli þínu verða borin undir dómara. Réttargæslumaður þinn veitir upplýsingar um dagsetningu þinghalds.',
  },
  statusDescriptionRulingAnnounced: {
    id: 'api.law-and-order:status-description-ruling-announced',
    defaultMessage:
      'Dæmt hefur verið í þínu máli og dómurinn birtur. Ríkissaksóknari tekur ákvörðun um áfrýjun héraðsdóms til Landsréttar. Ef dómfelldi vill áfrýja dómi skal hann lýsa því yfir innan fjögurra vikna frá birtingu dómsins. Ef ríkissaksóknari hyggst áfrýja héraðsdómi skal hann gefa út áfrýjunarstefnu innan fjögra vikna.',
  },
  statusDescriptionDistrictCourtProceedings: {
    id: 'api.law-and-order:status-description-district-court-proceedings',
    defaultMessage:
      'Málsmeðferð fyrir héraðsdómi hefst þegar ákvörðun hefur verið tekin um að ákært verði í málinu. Ákærðum manni ber skylda til að koma fyrir dóm og svara þar til saka. Eftir að ákæra hefur borist héraðsdómi frá ákæruvaldinu ákveður dómari stað og stund þinghalds þar sem málið verður þingfest. Málið er þingfest þegar ákæra og önnur gögn af hálfu ákæruvaldsins eru lögð fram á dómþingi.',
  },
  statusDescriptionClosedByDistrictCourt: {
    id: 'api.law-and-order:status-description-closed-by-district-court',
    defaultMessage:
      'Máli þínu hefur verið lokið með héraðsdómi. Dómur er skrifleg niðurstaða dómstóls um efni máls þíns. Ef ákæruvaldið og ákærði ákveða að áfrýja ekki málinu frekar og una dómnum er hann bindandi fyrir ákærða, ákæruvaldið og aðra aðila máls.',
  },
  statusDescriptionAppeal: {
    id: 'api.law-and-order:status-description-appeal',
    defaultMessage:
      'Aðilar máls geta óskað eftir að áfrýja dómsmáli og leitað eftir að dómur verði endurskoðaður. Þá er óskað eftir að málið yrði tekið upp á æðra dómsstigi, t.d. fyrir Landsrétti eða Hæstarétti.',
  },
  statusDescriptionMediation: {
    id: 'api.law-and-order:status-description-mediation',
    defaultMessage:
      'Mál þitt er komið í sáttarmiðlunarferli. Sáttamiðlun er aðferð til að leysa úr ágreiningi með hjálp hlutlauss og óháðs aðila. Aðilar að deilunni þurfa að vera sammála um að leita sátta og í ferlinu ríkir trúnaður.',
  },
  statusDescriptionSupremeCourtAppealRequest: {
    id: 'api.law-and-order:status-description-supreme-court-appeal-request',
    defaultMessage:
      'Hæstiréttur getur veitt leyfi til áfrýjunar landsréttardóms. Veitir Hæstiréttur einungis áfrýjunarleyfi ef áfrýjun lýtur að atriði sem hefur verulega almenna þýðingu eða ef aðrar ástæður eru til staðar sem mjög mikilvægt er að fá úrlaun Hæstaréttar um. Nánari upplýsingar má finna á domstolar.is',
  },
})
