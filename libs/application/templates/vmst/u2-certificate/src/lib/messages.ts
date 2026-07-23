import { defineMessages } from 'react-intl'

export const applicationMessages = defineMessages({
  actionCardPrerequisites: {
    id: 'vmst.u2c.application:applicationMessages.actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description: 'Action card tag for prerequisites',
  },
  actionCardDraft: {
    id: 'vmst.u2c.application:applicationMessages.actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description: 'Action card tag for draft application',
  },
  actionCardSubmitted: {
    id: 'vmst.u2c.application:applicationMessages.actionCardSubmitted',
    defaultMessage: 'Umsókn send inn',
    description: 'Action card tag for submitted application',
  },
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
    defaultMessage: 'Í vinnslu hjá innsendanda',
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
    defaultMessage: 'Hafnað',
    description: `action card tag for sent in state`,
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
    // alertTitle: {
    //   id: 'vmst.u2c.application:prerequisitesForm.general.alertTitle',
    //   defaultMessage: 'Undanþága',
    //   description: 'Prerequisite info title',
    // },
    // alertMessage: {
    //   id: 'vmst.u2c.application:prerequisitesForm.general.alertMessage#markdown',
    //   defaultMessage:
    //     'Vinnumálastofnun er heimilt að veita undanþágu fyrir atvinnuleit í ákveðnu landi ef:\n- foreldri, maki, sambúðarmaki eða samvistarmaki þinn er við nám eða störf í því landi.\n- þú átt börn undir 18 ára aldri sem eru búsett í landinu með hinu foreldri sínu.\n- þú hefur þegar fengið tilboð um starf í landinu.\nEf þú telur þig uppfylla þessi skilyrði getur þú sent okkur skilaboð í gegnum Mínar síður Vinnumálastofnunar.',
    //   description: 'Prerequisite info message',
    // },
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
      defaultMessage: 'Ég hef kynnt mér upplýsingar um U2 vottorð ',
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

export const completedForm = defineMessages({})

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
})
