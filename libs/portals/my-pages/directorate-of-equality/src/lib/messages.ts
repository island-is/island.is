import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  statusTitle: {
    id: 'sp.directorate-of-equality:status-title',
    defaultMessage: 'Jafnrétti á vinnumarkaði',
  },
  statusIntro: {
    id: 'sp.directorate-of-equality:status-intro',
    defaultMessage:
      'Lög um jafna meðferð á vinnumarkaði banna alla mismunun fólks á vinnumarkaði, hvort heldur beina eða óbeina. Markmiðið er að tryggja að sem flestir geti tekið virkan þátt í íslensku atvinnulífi og koma í veg fyrir félagslega einangrun einstaklinga.',
  },
  noObligationsTitle: {
    id: 'sp.directorate-of-equality:no-obligations-title',
    defaultMessage: 'Engin skilaskylda',
  },
  noObligationsMessage: {
    id: 'sp.directorate-of-equality:no-obligations-message',
    defaultMessage:
      'Þitt fyrirtæki er ekki skylt að skila inn hvorki jafnréttisáætlun né skýrslu.',
  },
  plansIntro: {
    id: 'sp.directorate-of-equality:plans-intro',
    defaultMessage:
      'Hér getur þú séð yfirlit yfir þær jafnréttisáætlanir sem fyrirtækið hefur sent inn til Jafnréttisstofu.',
  },
  plansLinkText: {
    id: 'sp.directorate-of-equality:plans-link-text',
    defaultMessage: 'Leiðbeiningar um jafnréttisáætlun',
  },
  plansLinkUrl: {
    id: 'sp.directorate-of-equality:plans-link-url',
    defaultMessage: 'https://island.is/s/jafnrettisstofa/jafnrettisaaetlun',
  },
  reportsIntro: {
    id: 'sp.directorate-of-equality:reports-intro',
    defaultMessage:
      'Hér getur þú séð yfirlit yfir þær skýrslur sem fyrirtækið hefur sent inn til Jafnréttisstofu.',
  },
  reportsLinkText: {
    id: 'sp.directorate-of-equality:reports-link-text',
    defaultMessage: 'Leiðbeiningar um skýrslugjöf',
  },
  reportsLinkUrl: {
    id: 'sp.directorate-of-equality:reports-link-url',
    defaultMessage:
      'https://island.is/s/jafnrettisstofa/skyrslugjof-um-kynbundinn-launamun',
  },
  serviceProvidersPageIntro: {
    id: 'sp.directorate-of-equality:service-providers-page-intro',
    defaultMessage:
      'Þegar launakerfi fær heimild getur það sent gögn beint til þjónustu- og gagnakerfis Jafnréttisstofu. Heimildin nær til allra gagna sem heyra undir skýrslugjöf. Hana má afturkalla hvenær sem er og það tekur gildi samstundis.',
  },
  newServiceProvider: {
    id: 'sp.directorate-of-equality:new-service-provider',
    defaultMessage: 'Ný heimild',
  },
  apiKeysPageIntro: {
    id: 'sp.directorate-of-equality:api-keys-page-intro',
    defaultMessage:
      'Aðgangslykill gerir hugbúnaði kleift að senda inn gögn sem heyra undir skýrslugjöf til þjónustu- og gagnakerfis Jafnréttisstofu í gegnum vefþjónustu. Ef notað er launakerfi af lista Jafnréttisstofu þarf ekki lykil og hægt er að veita því',
  },
  apiKeysPageIntroLink: {
    id: 'sp.directorate-of-equality:api-keys-page-intro-link',
    defaultMessage: 'heimild frekar',
  },
  newApiKey: {
    id: 'sp.directorate-of-equality:new-api-key',
    defaultMessage: 'Nýr aðgangslykill',
  },
  submissions: {
    id: 'sp.directorate-of-equality:submissions',
    defaultMessage: 'Innsendingar',
  },
  information: {
    id: 'sp.directorate-of-equality:information',
    defaultMessage: 'Upplýsingar',
  },
  noDataTitle: {
    id: 'sp.directorate-of-equality:no-data-title',
    defaultMessage: 'Engin gögn fundust',
  },
  serviceProviderApprovedMessage: {
    id: 'sp.directorate-of-equality:service-provider-approved-message',
    defaultMessage:
      'Jafnréttisstofa samþykkti fyrirtækið sem þjónustuaðila {date}. Því getið þið líka búið til lykla þjónustuaðila, sem gera ykkur kleift að skila gögnum fyrir hönd þeirra fyrirtækja sem hafa veitt ykkur heimild. Veljið tegund lykils þegar þið búið hann til.',
  },
  apiKeyGrantedTo: {
    id: 'sp.directorate-of-equality:api-key-granted-to',
    defaultMessage: 'Aðgangslykill veittur til',
  },
  apiKeyGrantedBy: {
    id: 'sp.directorate-of-equality:api-key-granted-by',
    defaultMessage: 'Lykill veittur af',
  },
  apiKeyValidity: {
    id: 'sp.directorate-of-equality:api-key-validity',
    defaultMessage: 'Gildistími',
  },
  deleteApiKey: {
    id: 'sp.directorate-of-equality:delete-api-key',
    defaultMessage: 'Eyða aðgangslykli',
  },
  keyTypeServiceProviderTag: {
    id: 'sp.directorate-of-equality:key-type-service-provider-tag',
    defaultMessage: 'Þjónustuaðili',
  },
  createKeyPageIntro: {
    id: 'sp.directorate-of-equality:create-key-page-intro',
    defaultMessage:
      'Gefðu lyklinum heiti og veldu hversu lengi hann á að gilda. Hægt er að afturkalla hann hvenær sem er.',
  },
  submissionObligationsForCompany: {
    id: 'sp.directorate-of-equality:submission-obligations-for-company',
    defaultMessage: 'Skilaskylda {companyName}',
  },
  equalityPlanRequired: {
    id: 'sp.directorate-of-equality:equality-plan-obligation',
    defaultMessage: 'Skylda að skila inn jafnréttisáætlun',
  },
  nextEqualityPlanDeadline: {
    id: 'sp.directorate-of-equality:next-equality-plan-deadline',
    defaultMessage: 'Næstu skil jafnréttisáætlunar',
  },
  salaryReportRequired: {
    id: 'sp.directorate-of-equality:salary-report-obligation',
    defaultMessage: 'Skylda til skýrslugjafar',
  },
  nextSalaryReportDeadline: {
    id: 'sp.directorate-of-equality:next-salary-report',
    defaultMessage: 'Næsta skýrslugjöf',
  },
  planTitle: {
    id: 'sp.directorate-of-equality:plan-title',
    defaultMessage: 'Jafnréttisáætlun {from}–{to}',
  },
  report: {
    id: 'sp.directorate-of-equality:report',
    defaultMessage: 'Skýrsla',
  },
  reportYearTitle: {
    id: 'sp.directorate-of-equality:report-year-title',
    defaultMessage: 'Skýrsla {year}',
  },
  submittedOn: {
    id: 'sp.directorate-of-equality:submitted-on',
    defaultMessage: 'Send inn {date}',
  },
  statusInReview: {
    id: 'sp.directorate-of-equality:status-in-review',
    defaultMessage: 'Til yfirferðar',
  },
  statusSuperseded: {
    id: 'sp.directorate-of-equality:status-superseded',
    defaultMessage: 'Úrelt',
  },
  statusWithdrawn: {
    id: 'sp.directorate-of-equality:status-withdrawn',
    defaultMessage: 'Dregin til baka',
  },
  openApplication: {
    id: 'sp.directorate-of-equality:open-application',
    defaultMessage: 'Opna umsókn',
  },
  viewAriaLabel: {
    id: 'sp.directorate-of-equality:view-aria-label',
    defaultMessage: 'Skoða {title}',
  },
  openApplicationAriaLabel: {
    id: 'sp.directorate-of-equality:open-application-aria-label',
    defaultMessage: 'Opna umsókn {title} (opnast í nýjum flipa)',
  },
  noPermissionTitle: {
    id: 'sp.directorate-of-equality:no-permission-title',
    defaultMessage: 'Heimild vantar',
  },
  noAccessPlansMessage: {
    id: 'sp.directorate-of-equality:no-access-plans-message',
    defaultMessage:
      'Þú hefur ekki umboð til að skoða jafnréttisáætlanir fyrir hönd fyrirtækisins. Prókúruhafi fyrirtækisins getur veitt þér umboð.',
  },
  noAccessReportsMessage: {
    id: 'sp.directorate-of-equality:no-access-reports-list-message',
    defaultMessage:
      'Þú hefur ekki umboð til að skoða skýrslur fyrir hönd fyrirtækisins. Prókúruhafi fyrirtækisins getur veitt þér umboð.',
  },
  noPlansFoundMessage: {
    id: 'sp.directorate-of-equality:no-plans-found-message',
    defaultMessage:
      'Ef þú telur að þú eigir að vera með innsenda jafnréttisáætlun, vinsamlegast hafðu samband við þjónustuaðila.',
  },
  noReportsFoundMessage: {
    id: 'sp.directorate-of-equality:no-reports-found-message',
    defaultMessage:
      'Ef þú telur að þú eigir að vera með innsenda skýrslu, vinsamlegast hafðu samband við þjónustuaðila.',
  },
  planDetailIntro: {
    id: 'sp.directorate-of-equality:plan-detail-intro',
    defaultMessage: 'Hér getur þú séð upplýsingar um jafnréttisáætlunina.',
  },
  downloadPlan: {
    id: 'sp.directorate-of-equality:download-plan',
    defaultMessage: 'Sækja jafnréttisáætlun',
  },
  planInfo: {
    id: 'sp.directorate-of-equality:plan-info',
    defaultMessage: 'Upplýsingar um jafnréttisáætlun',
  },
  identifier: {
    id: 'sp.directorate-of-equality:identifier',
    defaultMessage: 'Auðkenni',
  },
  submitted: {
    id: 'sp.directorate-of-equality:submitted',
    defaultMessage: 'Send inn',
  },
  company: {
    id: 'sp.directorate-of-equality:company',
    defaultMessage: 'Fyrirtæki',
  },
  document: {
    id: 'sp.directorate-of-equality:document',
    defaultMessage: 'Skjal',
  },
  companyWithNationalId: {
    id: 'sp.directorate-of-equality:company-with-national-id',
    defaultMessage: '{name} – {nationalId}',
  },
  reportDetailIntro: {
    id: 'sp.directorate-of-equality:report-detail-intro',
    defaultMessage:
      'Hér getur þú séð upplýsingar um skýrslugjöfina og niðurstöður launagreiningar.',
  },
  downloadReport: {
    id: 'sp.directorate-of-equality:download-report',
    defaultMessage: 'Sækja skýrslugjöf',
  },
  reportInfo: {
    id: 'sp.directorate-of-equality:report-info',
    defaultMessage: 'Upplýsingar um skýrslugjöf',
  },
  analysisPeriod: {
    id: 'sp.directorate-of-equality:analysis-period',
    defaultMessage: 'Tímabil launagreiningar',
  },
  resultsTitle: {
    id: 'sp.directorate-of-equality:results-title',
    defaultMessage: 'Niðurstöður launagreiningar',
  },
  resultsIntro: {
    id: 'sp.directorate-of-equality:results-intro',
    defaultMessage:
      'Hér að neðan eru niðurstöður launagreiningar. Launagreiningin byggir á innslegnum gögnum og fyrirliggjandi starfsmati og flokkun starfa.',
  },
  adjustedGapTitle: {
    id: 'sp.directorate-of-equality:adjusted-gap-title',
    defaultMessage: 'Leiðréttur launamunur',
  },
  adjustedGapIntro: {
    id: 'sp.directorate-of-equality:adjusted-gap-intro',
    defaultMessage:
      'Leiðréttur launamunur sýnir mun á launum karla og kvenna í jafnverðmætum störfum, þegar tekið hefur verið tillit til starfsmatsstiga. Hann er borinn saman við viðmið stjórnvalda.',
  },
  benchmark: {
    id: 'sp.directorate-of-equality:benchmark',
    defaultMessage: 'Viðmið: {benchmark}%',
  },
  gapWithDirection: {
    id: 'sp.directorate-of-equality:gap-with-direction',
    defaultMessage: '{value}% {direction}',
  },
  directionWomen: {
    id: 'sp.directorate-of-equality:direction-women',
    defaultMessage: 'konum í óhag',
  },
  directionMen: {
    id: 'sp.directorate-of-equality:direction-men',
    defaultMessage: 'körlum í óhag',
  },
  directionNone: {
    id: 'sp.directorate-of-equality:direction-none',
    defaultMessage: 'enginn munur',
  },
  withinBenchmarkTitle: {
    id: 'sp.directorate-of-equality:within-benchmark-title',
    defaultMessage: 'Leiðréttur launamunur er innan viðmiðs',
  },
  withinBenchmarkMessage: {
    id: 'sp.directorate-of-equality:within-benchmark-message',
    defaultMessage:
      'Leiðréttur launamunur fyrirtækisins er innan viðmiðsins {benchmark}%.',
  },
  overBenchmarkTitle: {
    id: 'sp.directorate-of-equality:over-benchmark-title',
    defaultMessage: 'Leiðréttur launamunur er yfir viðmiði',
  },
  overBenchmarkMessage: {
    id: 'sp.directorate-of-equality:over-benchmark-message',
    defaultMessage:
      '{count, plural, one {Laun # starfsmanns víkja frá því sem starfsmatsstig hans gefa til kynna og hafa áhrif á launamuninn. Hann er talinn upp í úrbótaáætlun hér að neðan.} other {Laun # starfsmanna víkja frá því sem starfsmatsstig þeirra gefa til kynna og hafa áhrif á launamuninn. Þeir eru taldir upp í úrbótaáætlun hér að neðan.}}',
  },
  meanHourlyWageTitle: {
    id: 'sp.directorate-of-equality:mean-hourly-wage-title',
    defaultMessage: 'Meðaltímakaup',
  },
  meanHourlyWageIntro: {
    id: 'sp.directorate-of-equality:mean-hourly-wage-intro',
    defaultMessage:
      'Meðaltímakaup karla og kvenna, óháð því hvaða störfum þau gegna.',
  },
  meanHourlyWageMale: {
    id: 'sp.directorate-of-equality:mean-hourly-wage-male',
    defaultMessage: 'Meðaltímakaup karla',
  },
  meanHourlyWageFemale: {
    id: 'sp.directorate-of-equality:mean-hourly-wage-female',
    defaultMessage: 'Meðaltímakaup kvenna',
  },
  rawGap: {
    id: 'sp.directorate-of-equality:raw-gap',
    defaultMessage:
      'Óleiðréttur launamunur: {value}% {direction}. Hann tekur ekki tillit til starfsmats og er ekki borinn saman við viðmið. Hann getur því verið í aðra átt en leiðréttur launamunur, til dæmis ef konur eru hlutfallslega fleiri í störfum sem eru metin hærra.',
  },
  chartTitle: {
    id: 'sp.directorate-of-equality:chart-title',
    defaultMessage: 'Dreifing tímakaups eftir starfsmatsstigum',
  },
  chartIntro: {
    id: 'sp.directorate-of-equality:chart-intro',
    defaultMessage:
      'Viðmiðunarlínan sýnir vænt tímakaup miðað við heildarstig. Launafrávik eru metin með hliðsjón af stöðu hvers starfsmanns gagnvart línunni. Úrbótaáætlun skal bæði ávarpa þau frávik sem eru yfir og undir uppgefnu viðmiði stjórnvalda frá viðmiðunarlínunni.',
  },
  chartXAxis: {
    id: 'sp.directorate-of-equality:chart-x-axis',
    defaultMessage: 'Starfsmatsstig',
  },
  chartYAxis: {
    id: 'sp.directorate-of-equality:chart-y-axis',
    defaultMessage: 'kr./klst.',
  },
  chartLegendMale: {
    id: 'sp.directorate-of-equality:chart-legend-male',
    defaultMessage: 'Karlar',
  },
  chartLegendFemale: {
    id: 'sp.directorate-of-equality:chart-legend-female',
    defaultMessage: 'Konur',
  },
  chartLegendExpected: {
    id: 'sp.directorate-of-equality:chart-legend-expected',
    defaultMessage: 'Vænt tímakaup',
  },
  chartLegendOutlier: {
    id: 'sp.directorate-of-equality:chart-legend-outlier',
    defaultMessage: 'Frávik',
  },
  chartTooltipWage: {
    id: 'sp.directorate-of-equality:chart-tooltip-wage',
    defaultMessage: 'Tímakaup',
  },
  chartNote: {
    id: 'sp.directorate-of-equality:chart-note',
    defaultMessage:
      'Viðmiðslínan sveigist vegna þess að vænt tímakaup hækkar um fast HLUTFALL á hvert stig, ekki fasta krónutölu — og hlutfallshækkun leggst við sjálfa sig. Í krónum verður hvert 100 stiga þrep því stærra en það síðasta.',
  },
  increasePer100: {
    id: 'sp.directorate-of-equality:increase-per-100',
    defaultMessage: 'Hækkun á hver 100 stig',
  },
  increasePer100Hint: {
    id: 'sp.directorate-of-equality:increase-per-100-hint',
    defaultMessage: 'Hlutfallsleg hækkun á væntu tímakaupi',
  },
  expectedAtMean: {
    id: 'sp.directorate-of-equality:expected-at-mean',
    defaultMessage: 'Vænt tímakaup við meðalstig',
  },
  expectedAtMeanHint: {
    id: 'sp.directorate-of-equality:expected-at-mean-hint',
    defaultMessage: 'Punktur á línunni við meðalstig starfsmanna',
  },
  male: { id: 'sp.directorate-of-equality:male', defaultMessage: 'Karl' },
  female: {
    id: 'sp.directorate-of-equality:female',
    defaultMessage: 'Kona/kynsegin',
  },
  improvementPlanTitle: {
    id: 'sp.directorate-of-equality:improvement-plan-title',
    defaultMessage: 'Úrbótaáætlun',
  },
  improvementPlanIntro: {
    id: 'sp.directorate-of-equality:improvement-plan-intro',
    defaultMessage:
      'Laun eftirfarandi starfsmanna víkja frá því sem starfsmatsstig þeirra gefa til kynna og hafa áhrif á leiðréttan launamun fyrirtækisins.',
  },
  actionGroup: {
    id: 'sp.directorate-of-equality:action-group',
    defaultMessage: 'Aðgerð – Hópur {number}',
  },
  deviationReason: {
    id: 'sp.directorate-of-equality:deviation-reason',
    defaultMessage: 'Ástæða fráviks',
  },
  correctionPlan: {
    id: 'sp.directorate-of-equality:correction-plan',
    defaultMessage: 'Áætlun um leiðréttingu fráviks',
  },
  actionDeadline: {
    id: 'sp.directorate-of-equality:action-deadline',
    defaultMessage: 'Lokadagsetning aðgerðar',
  },
  responsibleName: {
    id: 'sp.directorate-of-equality:responsible-name',
    defaultMessage: 'Nafn ábyrgðaraðila',
  },
  responsibleTitle: {
    id: 'sp.directorate-of-equality:responsible-title',
    defaultMessage: 'Starfstitill ábyrgðaraðila',
  },
  deleteServiceProvider: {
    id: 'sp.directorate-of-equality:delete-service-provider',
    defaultMessage: 'Eyða heimild',
  },
  active: {
    id: 'sp.directorate-of-equality:active',
    defaultMessage: 'Virkt',
  },
  serviceProviderGrantedTo: {
    id: 'sp.directorate-of-equality:service-provider-granted-to',
    defaultMessage: 'Heimild veitt til',
  },
  serviceProviderGrantedBy: {
    id: 'sp.directorate-of-equality:service-provider-granted-by',
    defaultMessage: 'Heimild veitt af',
  },
  apiKeyLastUsedAt: {
    id: 'sp.directorate-of-equality:api-key-last-used-at',
    defaultMessage: 'Síðast notaður',
  },
  nationalIdLine: {
    id: 'sp.directorate-of-equality:national-id-line',
    defaultMessage: 'Kennitala: {nationalId}',
  },
  grantedByLine: {
    id: 'sp.directorate-of-equality:granted-by-line',
    defaultMessage: 'Veitt: {date} · Veitt af: {name}',
  },
  noServiceProvidersTitle: {
    id: 'sp.directorate-of-equality:no-service-providers-title',
    defaultMessage: 'Ekkert kerfi tengt',
  },
  noServiceProvidersMessage: {
    id: 'sp.directorate-of-equality:no-service-providers-message',
    defaultMessage:
      'Fyrirtækið hefur ekki veitt neinu launakerfi heimild til að senda gögn til Jafnréttisstofu.',
  },
  createCompanyKey: {
    id: 'sp.directorate-of-equality:create-company-key',
    defaultMessage: 'Búa til aðgangslykil',
  },
  noCompanyKeysTitle: {
    id: 'sp.directorate-of-equality:no-company-keys-title',
    defaultMessage: 'Enginn aðgangslykill',
  },
  noCompanyKeysMessage: {
    id: 'sp.directorate-of-equality:no-company-keys-message',
    defaultMessage: 'Fyrirtækið hefur engan aðgangslykil.',
  },
  keyFallbackTitle: {
    id: 'sp.directorate-of-equality:key-fallback-title',
    defaultMessage: 'Aðgangslykill',
  },
  keyRevoked: {
    id: 'sp.directorate-of-equality:key-revoked',
    defaultMessage: 'Afturkallaður',
  },
  keyExpired: {
    id: 'sp.directorate-of-equality:key-expired',
    defaultMessage: 'Útrunninn',
  },
  keyCreatedLine: {
    id: 'sp.directorate-of-equality:key-created-line',
    defaultMessage: 'Búinn til: {date} · Búinn til af: {createdBy}',
  },
  keyCreatedByDoe: {
    id: 'sp.directorate-of-equality:key-created-by-doe',
    defaultMessage: 'Jafnréttisstofu',
  },
  keyValidLine: {
    id: 'sp.directorate-of-equality:key-valid-line',
    defaultMessage: 'Gildir til: {date} · Síðast notaður: {lastUsed}',
  },
  keyRevokedLine: {
    id: 'sp.directorate-of-equality:key-revoked-line',
    defaultMessage: 'Afturkallaður: {date} · Síðast notaður: {lastUsed}',
  },
  keyNoExpiry: {
    id: 'sp.directorate-of-equality:key-no-expiry',
    defaultMessage: 'Ótímabundið',
  },
  keyNeverUsed: {
    id: 'sp.directorate-of-equality:key-never-used',
    defaultMessage: 'Aldrei notaður',
  },
  deleteKey: {
    id: 'sp.directorate-of-equality:delete-key',
    defaultMessage: 'Eyða lykli',
  },
  showInactiveKeys: {
    id: 'sp.directorate-of-equality:show-inactive-keys',
    defaultMessage: 'Sýna óvirka lykla ({count})',
  },
  hideInactiveKeys: {
    id: 'sp.directorate-of-equality:hide-inactive-keys',
    defaultMessage: 'Fela óvirka lykla ({count})',
  },
  keyLabel: {
    id: 'sp.directorate-of-equality:key-label',
    defaultMessage: 'Heiti (valfrjálst)',
  },
  keyLabelPlaceholderCompany: {
    id: 'sp.directorate-of-equality:key-label-placeholder-company',
    defaultMessage: 'T.d. nafn launakerfisins',
  },
  validity: {
    id: 'sp.directorate-of-equality:validity',
    defaultMessage: 'Gildistími',
  },
  validityNone: {
    id: 'sp.directorate-of-equality:validity-none',
    defaultMessage: 'Ótímabundinn',
  },
  validity3: {
    id: 'sp.directorate-of-equality:validity-3',
    defaultMessage: '3 mán.',
  },
  validity6: {
    id: 'sp.directorate-of-equality:validity-6',
    defaultMessage: '6 mán.',
  },
  validity12: {
    id: 'sp.directorate-of-equality:validity-12',
    defaultMessage: '1 ár',
  },
  validity24: {
    id: 'sp.directorate-of-equality:validity-24',
    defaultMessage: '2 ár',
  },
  stepCounter: {
    id: 'sp.directorate-of-equality:step-counter',
    defaultMessage: '{current} af {total}',
  },
  createKeyFormTitle: {
    id: 'sp.directorate-of-equality:create-key-form-title',
    defaultMessage: 'Fylltu inn í eftirfarandi reiti',
  },
  keyReadyTitle: {
    id: 'sp.directorate-of-equality:key-ready-title',
    defaultMessage: 'Lykill tilbúinn',
  },
  copyKey: {
    id: 'sp.directorate-of-equality:copy-key',
    defaultMessage: 'Afrita lykil',
  },
  keyCreatedWarning: {
    id: 'sp.directorate-of-equality:key-created-warning',
    defaultMessage:
      'Afritaðu lykilinn núna og geymdu hann á öruggum stað. Hann birtist aðeins einu sinni og ekki er hægt að sækja hann aftur.',
  },
  keyValue: {
    id: 'sp.directorate-of-equality:key-value',
    defaultMessage: 'Aðgangslykill',
  },
  copyKeySuccess: {
    id: 'sp.directorate-of-equality:copy-key-success',
    defaultMessage: 'Lykill afritaður',
  },
  copyKeyError: {
    id: 'sp.directorate-of-equality:copy-key-error',
    defaultMessage: 'Ekki tókst að afrita lykilinn',
  },
  grantPageTitle: {
    id: 'sp.directorate-of-equality:grant-page-title',
    defaultMessage: 'Veita þjónustuaðila heimild',
  },
  grantPageIntro: {
    id: 'sp.directorate-of-equality:grant-page-intro',
    defaultMessage:
      'Veldu þjónustuaðila af lista Jafnréttisstofu yfir samþykkta þjónustuaðila.',
  },
  grantNoticeTitle: {
    id: 'sp.directorate-of-equality:grant-notice-title',
    defaultMessage: 'Athugið að þjónustuaðilinn sem þú velur fær að:',
  },
  grantNoticeSubmit: {
    id: 'sp.directorate-of-equality:grant-notice-submit',
    defaultMessage:
      'skila launagreiningu og jafnréttisáætlun fyrir hönd fyrirtækisins,',
  },
  grantNoticeRead: {
    id: 'sp.directorate-of-equality:grant-notice-read',
    defaultMessage: 'lesa skýrslur fyrirtækisins og athugasemdir Jafnréttisstofu,',
  },
  grantNoticeScoring: {
    id: 'sp.directorate-of-equality:grant-notice-scoring',
    defaultMessage: 'skrá, breyta og eyða starfsmati fyrirtækisins.',
  },
  grantChooseTitle: {
    id: 'sp.directorate-of-equality:grant-choose-title',
    defaultMessage: 'Veldu þjónustuaðila',
  },
  selectServiceProviderError: {
    id: 'sp.directorate-of-equality:select-service-provider-error',
    defaultMessage: 'Veldu kerfi',
  },
  noAvailableServiceProviders: {
    id: 'sp.directorate-of-equality:no-available-service-providers',
    defaultMessage: 'Ekkert annað viðurkennt kerfi er í boði.',
  },
  deleteServiceProviderConfirmTitle: {
    id: 'sp.directorate-of-equality:delete-service-provider-confirm-title',
    defaultMessage: 'Ertu viss um að þú viljir eyða heimild?',
  },
  deleteServiceProviderConfirmText: {
    id: 'sp.directorate-of-equality:delete-service-provider-confirm-text',
    defaultMessage: 'Þú ert að fara að eyða eftirfarandi heimild:',
  },
  deleteKeyConfirmTitle: {
    id: 'sp.directorate-of-equality:delete-key-confirm-title',
    defaultMessage: 'Ertu viss um að þú viljir eyða aðgangslykli?',
  },
  deleteKeyConfirmText: {
    id: 'sp.directorate-of-equality:delete-key-confirm-text',
    defaultMessage: 'Þú ert að fara að eyða eftirfarandi lykli:',
  },
  keyType: {
    id: 'sp.directorate-of-equality:key-type',
    defaultMessage: 'Tegund lykils',
  },
  keyTypePlaceholder: {
    id: 'sp.directorate-of-equality:key-type-placeholder',
    defaultMessage: 'Veldu tegund',
  },
  keyTypeCompany: {
    id: 'sp.directorate-of-equality:key-type-company',
    defaultMessage: 'Eigin skil',
  },
  keyTypeServiceProvider: {
    id: 'sp.directorate-of-equality:key-type-service-provider',
    defaultMessage: 'Skil fyrir önnur fyrirtæki',
  },
  serviceProviderNoticeTitleForCompany: {
    id: 'sp.directorate-of-equality:service-provider-notice-title-for-company',
    defaultMessage: '{companyName} er viðurkenndur þjónustuaðili',
  },
  mutationError: {
    id: 'sp.directorate-of-equality:mutation-error',
    defaultMessage: 'Ekki tókst að vista breytinguna. Reyndu aftur síðar.',
  },
  serviceProviderGranted: {
    id: 'sp.directorate-of-equality:service-provider-granted',
    defaultMessage: 'Heimild veitt',
  },
  serviceProviderDeleted: {
    id: 'sp.directorate-of-equality:service-provider-deleted',
    defaultMessage: 'Heimild eytt',
  },
  apiKeyDeleted: {
    id: 'sp.directorate-of-equality:api-key-deleted',
    defaultMessage: 'Lykli eytt',
  },
  noActiveKeysTitle: {
    id: 'sp.directorate-of-equality:no-active-keys-title',
    defaultMessage: 'Enginn virkur lykill',
  },
  noActiveKeysMessage: {
    id: 'sp.directorate-of-equality:no-active-keys-message',
    defaultMessage: 'Fyrirtækið hefur engan virkan lykil.',
  },
  analysisPeriodAverage: {
    id: 'sp.directorate-of-equality:analysis-period-average',
    defaultMessage: 'Meðaltal tólf mánaða',
  },
  notComputable: {
    id: 'sp.directorate-of-equality:not-computable',
    defaultMessage:
      'Ekki er hægt að reikna þessa niðurstöðu út frá innsendum gögnum.',
  },
  chartLegendPayDispersion: {
    id: 'sp.directorate-of-equality:chart-legend-pay-dispersion',
    defaultMessage: 'Ábending',
  },
  downloadImprovementPlan: {
    id: 'sp.directorate-of-equality:download-improvement-plan',
    defaultMessage: 'Sækja úrbótaáætlun',
  },
  hourlyWageUnit: {
    id: 'sp.directorate-of-equality:hourly-wage-unit',
    defaultMessage: 'kr./klst.',
  },
})
