import { defineMessages } from 'react-intl'

export const sharedMessages = defineMessages({
  yourApplicationTitle: {
    id: 'vmst.u2c.application:shared.yourApplicationTitle',
    defaultMessage: 'Umsóknin þín',
    description: 'Shared multi field title used across forms',
  },
  whatHappensNextTitle: {
    id: 'vmst.u2c.application:shared.whatHappensNextTitle',
    defaultMessage: 'Hvað gerist næst?',
    description: 'Shared expandable description title used across forms',
  },
  whatHappensNextDescription: {
    id: 'vmst.u2c.application:shared.whatHappensNextDescription#markdown',
    defaultMessage:
      '**Þú sækir vottorðið í eigin persónu þegar þú færð meldingu um að það sé tilbúið hjá Vinnumálastofnun**\n\nÞú getur sótt U2 vottorðið á næstu þjónustuskrifstofu Vinnumálastofnunar 1-5 dögum fyrir brottfarardag. Þetta er gert til að tryggja að þú sért enn á Íslandi áður en þú ferð til útlanda í atvinnuleit.',
    description: 'Shared expandable description text used across forms',
  },
  newApplicationButton: {
    id: 'vmst.u2c.application:shared.newApplicationButton',
    defaultMessage: 'Opna umsókn',
    description: 'Shared button label to start a new application',
  },
  newApplicationMessage: {
    id: 'vmst.u2c.application:shared.newApplicationMessage',
    defaultMessage:
      'Þú getur lagt inn nýja umsókn um U2 vottorð ef aðstæður þínar hafa breyst.',
    description: 'Shared message about starting a new application',
  },
})

export const applicationMessages = defineMessages({
  institutionName: {
    id: 'vmst.u2c.application:institution',
    defaultMessage: 'Vinnumálastofnun',
    description: `Institution's name`,
  },
  name: {
    id: 'vmst.u2c.application:name',
    defaultMessage: 'Umsókn um U2 vottorð vegna atvinnuleitar í EES-landi',
    description: `Application's name`,
  },
  inDraft: {
    id: 'vmst.u2c.application:inDraft',
    defaultMessage: 'Í vinnslu hjá umsækjanda',
    description: `action card tag for draft state`,
  },
  approved: {
    id: 'vmst.u2c.application:approved',
    defaultMessage: 'Samþykkt',
    description: `action card tag for completed state`,
  },
  revoked: {
    id: 'vmst.u2c.application:revoked',
    defaultMessage: 'Afturkölluð',
    description: `action card tag for revoked state`,
  },
  rejected: {
    id: 'vmst.u2c.application:rejected',
    defaultMessage: 'Hafnað',
    description: `action card tag for rejected state`,
  },
  sentIn: {
    id: 'vmst.u2c.application:sentIn',
    defaultMessage: 'Í vinnslu',
    description: `action card tag for sent in state`,
  },
  submitConfirm: {
    id: 'vmst.u2c.application:submitConfirm',
    defaultMessage: 'Staðfesta',
    description: 'Submit/confirm button label used across state transitions',
  },
  draftHistorySubmit: {
    id: 'vmst.u2c.application:draftHistorySubmit',
    defaultMessage: 'Umsókn innsend',
    description: 'History log message when the draft is submitted',
  },
  reviewPendingTitle: {
    id: 'vmst.u2c.application:reviewPendingTitle',
    defaultMessage: 'Umsókn afgreidd af Vinnumálastofnun',
    description: 'Pending action title for review state',
  },
  reviewPendingContent: {
    id: 'vmst.u2c.application:reviewPendingContent',
    defaultMessage: 'Umsókn er í vinnslu hjá Vinnumálastofnun',
    description: 'Pending action content for review state',
  },
  revokedPendingTitle: {
    id: 'vmst.u2c.application:revokedPendingTitle',
    defaultMessage: 'Umsókn afturkölluð',
    description: 'Pending action title for revoked state',
  },
  revokedPendingContent: {
    id: 'vmst.u2c.application:revokedPendingContent',
    defaultMessage: 'Umsókn þín hefur verið afturkölluð',
    description: 'Pending action content for revoked state',
  },
  rejectedPendingTitle: {
    id: 'vmst.u2c.application:rejectedPendingTitle',
    defaultMessage: 'Umsókn hafnað',
    description: 'Pending action title for rejected state',
  },
  rejectedPendingContent: {
    id: 'vmst.u2c.application:rejectedPendingContent',
    defaultMessage: 'Umsókn þín hefur því miður verið hafnað',
    description: 'Pending action content for rejected state',
  },
  completedPendingTitle: {
    id: 'vmst.u2c.application:completedPendingTitle',
    defaultMessage: 'Umsókn samþykkt',
    description: 'Pending action title for completed state',
  },
  completedPendingContent: {
    id: 'vmst.u2c.application:completedPendingContent',
    defaultMessage:
      'Umsóknin þín hefur verið samþykkt. Svo að U2 Vottorð taki gildi þarf að sækja það í eigin persónu.',
    description: 'Pending action content for completed state',
  },
})

export const prerequisitesForm = {
  general: defineMessages({
    tabTitle: {
      id: 'vmst.u2c.application:prerequisitesForm.general.tabTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'prerequisites section tab title',
    },
    externalDataTitle: {
      id: 'vmst.u2c.application:prerequisitesForm.general.externalDataTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'external data provider title',
    },
    checkbox: {
      id: 'vmst.u2c.application:prerequisitesForm.general.checkbox',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'Prerequisite checkbox text',
    },
  }),
  dataProviders: defineMessages({
    vmstTitle: {
      id: 'vmst.u2c.application:prerequisitesForm.dataProviders.vmstTitle',
      defaultMessage: 'Upplýsingar úr umsókn þinni um atvinnuleysistryggingar',
      description: 'vmst data provider title',
    },
    vmstSubTitle: {
      id: 'vmst.u2c.application:prerequisitesForm.dataProviders.vmstSubTitle',
      defaultMessage:
        'Til að sækja um U2 vottorð þarftu að vera með umsókn um atvinnuleysisbætur á Íslandi',
      description: 'vmst data provider subtitle',
    },
    dataProviderCheckboxLabel: {
      id: 'vmst.u2c.application:prerequisitesForm.dataProviders.dataProviderCheckboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'data provider checkbox label',
    },
    nationalRegistryTitle: {
      id: 'vmst.u2c.application:prerequisitesForm.dataProviders.nationalRegistryTitle',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'national registry data provider title',
    },
    nationalRegistrySubtitle: {
      id: 'vmst.u2c.application:prerequisitesForm.dataProviders.nationalRegistrySubtitle',
      defaultMessage: 'Upplýsingar um þig, maka og börn.',
      description: 'national registry data provider sub title',
    },
    myPagesTitle: {
      id: 'vmst.u2c.application:prerequisitesForm.dataProviders.myPagesTitle',
      defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
      description: 'my pages data provider title',
    },
    myPagesSubtitle: {
      id: 'vmst.u2c.application:prerequisitesForm.dataProviders.myPagesSubtitle',
      defaultMessage:
        'Upplýsingar um símanúmer og netfang til að auðvelda umsóknarferlið.',
      description: 'my pages data provider sub title',
    },
  }),
}

export const mainForm = {
  countryAndDateSection: defineMessages({
    sectionTitle: {
      id: 'vmst.u2c.application:mainForm.countryAndDateSection.sectionTitle',
      defaultMessage: 'Land og brottför',
      description: 'Country and date section title',
    },
    description: {
      id: 'vmst.u2c.application:mainForm.countryAndDateSection.description',
      defaultMessage:
        'U2 vottorð gilda í þrjá mánuði. Hægt er að leggja inn umsókn allt að fjórum vikum fyrir brottför en þó ekki seinna en sjö dögum.',
      description: 'Country and date section description',
    },
    countrySelectLabel: {
      id: 'vmst.u2c.application:mainForm.countryAndDateSection.countrySelectLabel',
      defaultMessage: 'Til hvaða EES lands er förinni heitið?',
      description: 'Label for the destination country select field',
    },
    departureDateLabel: {
      id: 'vmst.u2c.application:mainForm.countryAndDateSection.departureDateLabel',
      defaultMessage: 'Dagsetning brottfarar frá Íslandi',
      description: 'Label for the departure date field',
    },
  }),
  importantInfoSection: defineMessages({
    sectionTitle: {
      id: 'vmst.u2c.application:mainForm.importantInfoSection.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Section title',
    },
    title: {
      id: 'vmst.u2c.application:mainForm.importantInfoSection.title',
      defaultMessage: 'Mikilvægar upplýsingar',
      description: 'title',
    },
    description: {
      id: 'vmst.u2c.application:mainForm.importantInfoSection.description#markdown',
      defaultMessage:
        'Áður en umsókn er send inn skaltu kynna þér skilyrði og helstu [upplýsingar um U2 vottorðið](https://island.is/u2-vottord-vegna-atvinnuleitar-i-ees-landi).\n  **Athugið:** Það er á ábyrgð umsækjanda að fylgja skilyrðum og reglum U2 vottorðsins, brot á þeim getur leitt til þess að vottorðið verði ógilt.',
      description: 'main description',
    },
    checkboxLabel: {
      id: 'vmst.u2c.application:mainForm.importantInfoSection.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér upplýsingar um U2 vottorð',
      description: 'checkbox label',
    },
  }),
  overviewSection: defineMessages({
    nameLabel: {
      id: 'vmst.u2c.application:mainForm.overviewSection.nameLabel',
      defaultMessage: 'Nafn',
      description: 'Overview name label',
    },
    ssnLabel: {
      id: 'vmst.u2c.application:mainForm.overviewSection.ssnLabel',
      defaultMessage: 'Kennitala',
      description: 'Overview ssn label',
    },
    countryLabel: {
      id: 'vmst.u2c.application:mainForm.overviewSection.countryLabel',
      defaultMessage: 'Áfangastaður',
      description: 'Overview country label',
    },
    validityPeriodLabel: {
      id: 'vmst.u2c.application:mainForm.overviewSection.validityPeriodLabel',
      defaultMessage: 'Gildistími vottorðs',
      description: 'Overview validity period label',
    },
    confirmApplication: {
      id: 'vmst.u2c.application:mainForm.overviewSection.confirmApplication',
      defaultMessage: 'Staðfesta umsókn',
      description: 'Submit application button text',
    },
    title: {
      id: 'vmst.u2c.application:mainForm.overviewSection.title',
      defaultMessage: 'Yfirlit',
      description: 'overview title',
    },
    description: {
      id: 'vmst.u2c.application:mainForm.overviewSection.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'overview description',
    },
  }),
}

export const reviewForm = {
  general: defineMessages({
    alertInfoTitle: {
      id: 'vmst.u2c.application:reviewForm.general.alertInfoTitle',
      defaultMessage:
        'Umsókn þín um U2 vottorð hefur borist til Vinnumálastofnunar',
      description: 'reviewForm alert info title',
    },
    alertInfoDescription: {
      id: 'vmst.u2c.application:reviewForm.general.alertInfoDescription',
      defaultMessage:
        'Hún er nú í vinnslu og má búast við afgreiðslu innan 5–7 virkra daga.',
      description: 'reviewForm alert info description',
    },
    revokeButton: {
      id: 'vmst.u2c.application:reviewForm.general.revokeButton',
      defaultMessage: 'Afturkalla umsókn',
      description: 'reviewForm revoke application button label',
    },
  }),
}

export const revokedForm = {
  general: defineMessages({
    alertTitle: {
      id: 'vmst.u2c.application:revokedForm.general.alertTitle',
      defaultMessage: 'Umsókn þín um U2 vottorð hefur verið afturkölluð',
      description: 'revokedForm alert title',
    },
  }),
}

export const rejectedForm = {
  general: defineMessages({
    alertTitle: {
      id: 'vmst.u2c.application:rejectedForm.general.alertTitle',
      defaultMessage: 'Umsókn þín um U2 vottorð hefur því miður verið hafnað',
      description: 'rejectedForm alert title',
    },
  }),
}

export const completedForm = {
  general: defineMessages({
    alertSuccessTitle: {
      id: 'vmst.u2c.application:completedForm.general.alertSuccessTitle',
      defaultMessage: 'Umsókn þín um U2 vottorð hefur verið samþykkt!',
      description: 'completedForm success alert title',
    },
    alertSuccessMessage: {
      id: 'vmst.u2c.application:completedForm.general.alertSuccessMessage',
      defaultMessage:
        '**Þú þarft að sækja vottorðið í eigin persónu** á næstu þjónustuskrifstofu Vinnumálastofnunar þegar þú færð tilkynningu um að vottorðið sé tilbúið. Þetta er gert til að tryggja að þú sért enn á Íslandi áður en þú ferð erlendis í atvinnuleit.',
      description: 'completedForm success alert message',
    },
    alertInfoTitle: {
      id: 'vmst.u2c.application:completedForm.general.alertInfoTitle',
      defaultMessage:
        'Ef þú hættir við atvinnuleit erlendis þarft þú að afturkalla umsóknina',
      description: 'completedForm info alert title',
    },
    alertInfoMessage: {
      id: 'vmst.u2c.application:completedForm.general.alertInfoMessage',
      defaultMessage:
        'Ef þú hættir við að fara erlendis í atvinnuleit þarf að tilkynna Vinnumálastofnun það með því að mæta á þjónustuskrifstofu Vinnumálastofnunar og afturkalla umsóknina í eigin persónu.',
      description: 'completedForm info alert message',
    },
  }),
}

export const errorMessages = defineMessages({
  eligibilityErrorTitle: {
    id: 'vmst.u2c.application:error.eligibilityErrorTitle',
    defaultMessage: 'Ekki er hægt að sækja um U2 vottorð',
    description: 'Error title when user is not eligible for a U2 certificate',
  },
  cannotApplyErrorSummary: {
    id: 'vmst.u2c.application:error.cannotApplyErrorSummary',
    defaultMessage:
      'Samkvæmt sóttum gögnum er ekki hægt að sækja um U2 vottorð á þessari stundu.',
    description: 'Error summary when user is not eligible for a U2 certificate',
  },
  dataFetchErrorSummary: {
    id: 'vmst.u2c.application:error.dataFetchErrorSummary',
    defaultMessage: 'Ekki tókst að sækja gögn, vinsamlegast reyndu aftur síðar',
    description: 'Generic error summary when data could not be fetched',
  },
  errorWithException: {
    id: 'vmst.u2c.application:error.errorWithException#markdown',
    defaultMessage:
      '{value}\n\n**Undanþága**\n\nVinnumálastofnun er heimilt að veita undanþágu fyrir atvinnuleit í ákveðnu landi ef:\n\n- foreldri, maki, sambúðarmaki eða samvistarmaki þinn er við nám eða störf í því landi.\n- þú átt börn undir 18 ára aldri sem eru búsett í landinu með hinu foreldri sínu.\n- þú hefur þegar fengið tilboð um starf í landinu.\n\nEf þú telur þig uppfylla þessi skilyrði getur þú sent okkur skilaboð í gegnum Mínar síður Vinnumálastofnunar.',
    description: 'Error with exception',
  },
})
