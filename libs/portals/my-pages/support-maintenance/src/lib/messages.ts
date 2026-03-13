import { defineMessages } from 'react-intl'

// ── Module-level messages (new sp.support-maintenance:* namespace) ─────────────
export const moduleMessages = defineMessages({
  supportMaintenance: {
    id: 'sp.support-maintenance:support-maintenance',
    defaultMessage: 'Framfærsla',
  },
  supportMaintenanceRootTitle: {
    id: 'sp.support-maintenance:support-maintenance-root-title',
    defaultMessage: 'Þín framfærsla',
  },
  supportMaintenanceIntro: {
    id: 'sp.support-maintenance:support-maintenance-intro',
    defaultMessage: 'Listi yfir þína helstu framfærsluliði.',
  },
  supportMaintenanceDescription: {
    id: 'sp.support-maintenance:support-maintenance-description',
    defaultMessage:
      'Hér getur þú séð yfirlit yfir þínar greiðslur og áætlanir.',
  },
  socialInsurance: {
    id: 'sp.support-maintenance:social-insurance',
    defaultMessage: 'Almannatryggingar',
  },
  socialInsuranceDescription: {
    id: 'sp.support-maintenance:social-insurance-description',
    defaultMessage:
      'Hér getur þú séð yfirlit yfir þínar almannatryggingagreiðslur og áætlanir.',
  },
  unemployment: {
    id: 'sp.support-maintenance:unemployment',
    defaultMessage: 'Atvinnuleysi',
  },
  unemploymentDescription: {
    id: 'sp.support-maintenance:unemployment-description',
    defaultMessage: 'Hér getur þú séð yfirlit yfir þínar atvinnuleysisbætur.',
  },
  // ── Unemployment overview / dynamic screen ─────────────────────────────────────
  unemploymentApply: {
    id: 'sp.support-maintenance:unemployment-apply',
    defaultMessage: 'Sækja um atvinnuleysisbætur',
  },
  unemploymentApplyUrl: {
    id: 'sp.support-maintenance:unemployment-apply-url',
    defaultMessage: 'https://island.is/umsokn-um-atvinnuleysisbaetur',
  },
  unemploymentActiveTitle: {
    id: 'sp.support-maintenance:unemployment-active-title',
    defaultMessage: 'Þú ert á atvinnuleysisbætunum',
  },
  unemploymentActiveDescription: {
    id: 'sp.support-maintenance:unemployment-active-description',
    defaultMessage:
      'Hér getur þú séð staðu þína og upplýsingar tengdar atvinnuleysisbætunum.',
  },
  unemploymentInactiveTitle: {
    id: 'sp.support-maintenance:unemployment-inactive-title',
    defaultMessage: 'Ekki skráð(úr) á atvinnuleysisbætur',
  },
  unemploymentInactiveDescription: {
    id: 'sp.support-maintenance:unemployment-inactive-description',
    defaultMessage:
      'Þú ert ekki skráð(úr) til að fá atvinnuleysisbætur. Ef þú hefur nýlega misst vinnuna þína getur þú sótt um hér.',
  },
  // ── Unemployment status sub-page (only shown when active) ──────────────────
  unemploymentStatusTitle: {
    id: 'sp.support-maintenance:unemployment-status-title',
    defaultMessage: 'Staðan þín',
  },
  unemploymentStatusDescription: {
    id: 'sp.support-maintenance:unemployment-status-description',
    defaultMessage:
      'Yfirlit yfir staðu þína á atvinnuleysisbætur og tengdar upplýsingar.',
  },
})

// ── Screen-level messages (preserving original sp.social-insurance-maintenance:* IDs) ─
export const m = defineMessages({
  maintenance: {
    id: 'sp.social-insurance-maintenance:maintenance',
    defaultMessage: 'Framfærsla',
  },
  maintenanceFooter: {
    id: 'sp.social-insurance-maintenance:maintenance-footer',
    defaultMessage:
      'Hægt er að nálgast eldri áætlanir á mínum síðum TR undir mín skjöl.',
  },
  maintenanceFooterLinkUrl: {
    id: 'sp.social-insurance-maintenance:maintenance-footer-link-url',
    defaultMessage: 'https://minarsidur.tr.is/forsendur/rafraen-skjol',
  },
  maintenanceFooterLink: {
    id: 'sp.social-insurance-maintenance:maintenance-footer-link',
    defaultMessage: ' <link>Fara á mínar síður TR</link>',
  },
  maintenanceFooterTemporaryWarning: {
    id: 'sp.social-insurance-maintenance:maintenance-footer-temporary-warning',
    defaultMessage:
      '* Vinsamlega athugið að nýtt örorku- og endurhæfingargreiðslukerfi tekur gildi 1. september 2025. Fjárhæðir vegna tímabilsins september til desember munu breytast. TR vinnur að breytingum á kerfum stofnunarinnar og mun uppfæra greiðsluáætlunina að þeim loknum, á vormánuðum 2025.',
  },
  paymentPlan: {
    id: 'sp.social-insurance-maintenance:payment-plan',
    defaultMessage: 'Greiðsluáætlun',
  },
  incomePlan: {
    id: 'sp.social-insurance-maintenance:income-plan',
    defaultMessage: 'Tekjuáætlun',
  },
  incomePlanDetail: {
    id: 'sp.social-insurance-maintenance:income-plan-detail',
    defaultMessage:
      'Hér fyrir neðan er yfirlit yfir þá tekjuáætlun sem er í gildi. Ef þú óskar eftir því að breyta henni þarftu að velja \u2018breyta tekjuáætlun\u2019.',
  },
  modifyIncomePlan: {
    id: 'sp.social-insurance-maintenance:income-plan-modify',
    defaultMessage: 'Breyta tekjuáætlun',
  },
  incomePlanModifyUnavailable: {
    id: 'sp.social-insurance-maintenance:income-plan-modify-unavailable',
    defaultMessage:
      'Ekki er hægt að gera breytingar á tekjuáætlun sem stendur.',
  },
  incomePlanModifyUnavailableText: {
    id: 'sp.social-insurance-maintenance:income-plan-modify-unavailable-text',
    defaultMessage:
      'Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  },
  incomePlanModifyLink: {
    id: 'sp.social-insurance-maintenance:income-plan-modify-link',
    defaultMessage: 'umsoknir/tekjuaaetlun',
  },
  paymentsReasoning: {
    id: 'sp.social-insurance-maintenance:payments-reasoning',
    defaultMessage: 'Forsendur greiðslna',
  },
  previousMonthsPayment: {
    id: 'sp.social-insurance-maintenance:previous-months-payment',
    defaultMessage: 'Greiðsla síðasta mánaðar',
  },
  nextPayment: {
    id: 'sp.social-insurance-maintenance:next-payment',
    defaultMessage: 'Næsta greiðsla',
  },
  paymentTypes: {
    id: 'sp.social-insurance-maintenance:payment-types',
    defaultMessage: 'Greiðslutegundir',
  },
  year: {
    id: 'sp.social-insurance-maintenance:year',
    defaultMessage: 'Árið',
  },
  yearCumulativeTotal: {
    id: 'sp.social-insurance-maintenance:year-cumulative-total',
    defaultMessage: 'Samtals fyrir árið',
  },
  paymentsTotal: {
    id: 'sp.social-insurance-maintenance:payments-total',
    defaultMessage: 'Greiðslur samtals',
  },
  paymentsReceived: {
    id: 'sp.social-insurance-maintenance:payments-received',
    defaultMessage: 'Útborgað',
  },
  totalPaymentsReceived: {
    id: 'sp.social-insurance-maintenance:total-payments-received',
    defaultMessage: 'Útborgað',
  },
  noPaymentsFound: {
    id: 'sp.social-insurance-maintenance:no-payments-found',
    defaultMessage: 'Engar greiðslur fundust fyrir þetta ár',
  },
  noPaymentHistoryFound: {
    id: 'sp.social-insurance-maintenance:no-payment-history-found',
    defaultMessage: 'Engin greiðslusaga fannst',
  },
  viewIncomePlan: {
    id: 'sp.social-insurance-maintenance:view-income-plan',
    defaultMessage: 'Skoða núgildandi tekjuáætlun',
  },
  submitIncomePlan: {
    id: 'sp.social-insurance-maintenance:submit-income-plan',
    defaultMessage: 'Senda inn tekjuáætlun',
  },
  type: {
    id: 'sp.social-insurance-maintenance:type',
    defaultMessage: 'Tegund',
  },
  incomeType: {
    id: 'sp.social-insurance-maintenance:income-type',
    defaultMessage: 'Tekjutegund',
  },
  annualIncome: {
    id: 'sp.social-insurance-maintenance:annual-income',
    defaultMessage: 'Tekjur á ári',
  },
  currency: {
    id: 'sp.social-insurance-maintenance:currency',
    defaultMessage: 'Gjaldmiðill',
  },
  receivedInProgress: {
    id: 'sp.social-insurance-maintenance:received-in-progress',
    defaultMessage: 'Móttekið til vinnslu',
  },
  continueApplication: {
    id: 'sp.social-insurance-maintenance:continue-application',
    defaultMessage: 'Halda áfram með umsókn',
  },
  noActiveIncomePlan: {
    id: 'sp.social-insurance-maintenance:no-active-income-plan',
    defaultMessage: 'Engin gild tekjuáætlun',
  },
  applicationInProgress: {
    id: 'sp.social-insurance-maintenance:application-in-progress',
    defaultMessage: 'Umsókn í vinnslu',
  },
  applicationRejected: {
    id: 'sp.social-insurance-maintenance:application-rejected',
    defaultMessage: 'Umsókn hafnað',
  },
  applicationInReview: {
    id: 'sp.social-insurance-maintenance:application-in-review',
    defaultMessage: 'Umsókn bíður samþykkis',
  },
  incomePlanLink: {
    id: 'sp.social-insurance-maintenance:income-plan-link',
    defaultMessage:
      'https://island.is/tekjuaaetlun-tr-upplysingar-um-tekjur-lifeyristhega',
  },
  incomePlanLinkText: {
    id: 'sp.social-insurance-maintenance:income-plan-link-text',
    defaultMessage: 'Hvað er tekjuáætlun?',
  },
  paymentPlanTemporarilyUnavailable: {
    id: 'sp.social-insurance-maintenance:payment-plan-temporarily-unavailable',
    defaultMessage:
      'Bráðabirgðagreiðsluáætlun 2025 verður tilbúin seinni part desember',
  },
  breakdown: {
    id: 'sp.social-insurance-maintenance:payment-plan-breakdown',
    defaultMessage: 'Sundurliðun',
  },
})
