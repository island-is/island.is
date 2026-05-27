import { defineMessages } from 'react-intl'

export const applicationMessages = defineMessages({
  actionCardPrerequisites: {
    id: 'vmst.ct.application:applicationMessages.actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description: 'Action card tag for prerequisites',
  },
  actionCardDraft: {
    id: 'vmst.ct.application:applicationMessages.actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description: 'Action card tag for draft application',
  },
  actionCardSubmitted: {
    id: 'vmst.ct.application:applicationMessages.actionCardSubmitted',
    defaultMessage: 'Umsókn send inn',
    description: 'Action card tag for submitted application',
  },
  institutionName: {
    id: 'vmst.ct.application:institution',
    defaultMessage: 'Vinnumálastofnun',
    description: `Institution's name`,
  },
  name: {
    id: 'vmst.ct.application:name',
    defaultMessage: 'Tilkynna dvöl erlendis',
    description: `Application's name`,
  },
  applicationSent: {
    id: 'vmst.ct.application:applicationMessages.applicationSent',
    defaultMessage: 'Tilkynning móttekin fyrir tímabil: {from} - {to}',
    description: 'History log message when application is sent',
  },
})

export const prerequisitesForm = {
  general: defineMessages({
    tabTitle: {
      id: 'vmst.ct.application:prerequisitesForm.general.tabTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'prerequisites section tab title',
    },
    externalDataTitle: {
      id: 'vmst.ct.application:prerequisitesForm.general.externalDataTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'external data provider title',
    },
  }),
  dataProviders: defineMessages({
    vmstTitle: {
      id: 'vmst.ct.application:prerequisitesForm.dataProviders.vmstTitle',
      defaultMessage: 'Vinnumálastofnun',
      description: 'vmst data provider title',
    },
    vmstSubTitle: {
      id: 'vmst.ct.application:prerequisitesForm.dataProviders.vmstSubTitle',
      defaultMessage: 'Gögn sótt til Vinnumálastofnunar',
      description: 'vmst data provider subtitle',
    },
    dataProviderCheckboxLabel: {
      id: 'vmst.ct.application:prerequisitesForm.dataProviders.dataProviderCheckboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'data provider checkbox label',
    },
  }),
}

export const mainForm = defineMessages({
  title: {
    id: 'vmst.ct.application:mainForm.general.title',
    defaultMessage: 'Tilkynna dvöl erlendis',
    description: 'main form title',
  },
  description: {
    id: 'vmst.ct.application:mainForm.general.description',
    defaultMessage: 'Hægt er að skrá sig erlendis í allt að einn mánuð.',
    description: 'main form description',
  },
  submitApplication: {
    id: 'vmst.ct.application:mainForm.general.submitApplication',
    defaultMessage: 'Tilkynna utanlandsferð',
    description: 'main form submit button',
  },
  dateTitle: {
    id: 'vmst.ct.application:mainForm.dateTitle',
    defaultMessage:
      'Ég óska eftir því að vera skráð/ur tímabundið af atvinnuleysisbótum  á þessu tímabili:',
    description: 'main form date field title',
  },
  dateFrom: {
    id: 'vmst.ct.application:mainForm.dateFrom',
    defaultMessage: 'Frá',
    description: 'main form date from field title',
  },
  dateTo: {
    id: 'vmst.ct.application:mainForm.dateTo',
    defaultMessage: 'Til',
    description: 'main form date to field title',
  },
  datePlaceholder: {
    id: 'vmst.ct.application:mainForm.datePlaceholder',
    defaultMessage: 'Veldu tímabil',
    description: 'main form date field placeholder',
  },
  addDateButtonLabel: {
    id: 'vmst.ct.application:mainForm.addDateButtonLabel',
    defaultMessage: 'Bæta við dagsetningu',
    description: 'main form add date button label',
  },
  removeDateButtonLabel: {
    id: 'vmst.ct.application:mainForm.removeDateButtonLabel',
    defaultMessage: 'Fjarlægja dagsetningu',
    description: 'main form remove date button label',
  },
})

export const completedForm = defineMessages({
  multiFieldTitle: {
    id: 'vmst.ct.application:completedForm.multiFieldTitle',
    defaultMessage: 'Staðfesting',
    description: 'Title for the multi field on completed form',
  },
  alertTitle: {
    id: 'vmst.ct.application:completedForm.alertTitle',
    defaultMessage: 'Tilkynning um dvöl erlendis hefur verið móttekin',
    description: 'completed form alert title',
  },
  descriptionFieldTitle: {
    id: 'vmst.ct.application:completedForm.descriptionFieldTitle',
    defaultMessage: 'Er eitthvað óljóst?',
    description: 'completed form description field title',
  },
  descriptionFieldDescription: {
    id: 'vmst.ct.application:completedForm.descriptionFieldDescription#markdown',
    defaultMessage:
      'Skoðaðu nánari upplýsingar á upplýsingasíðu Vinnumálastofnuna',
    description: 'completed form description field description',
  },
  bottomButtonMessage: {
    id: 'vmst.ct.application:completedForm.bottomButtonMessage',
    defaultMessage:
      'Á mínum síðum og í appi ísland.is getur þú nú nálgast staðfestingu á því að þessi aðgerð hafi verið framkvæmd.',
    description: 'Bottom info message on completed form',
  },
  bottomButtonLabel: {
    id: 'vmst.ct.application:completedForm.bottomButtonLabel',
    defaultMessage: 'Opna Mínar síður',
    description: 'Bottom button label on completed form',
  },
  bottomButtonLink: {
    id: 'vmst.ct.application:completedForm.bottomButtonLink',
    defaultMessage: '/minarsidur/umsoknir',
    description: 'Bottom button link on completed form',
  },
})

export const errorMessages = defineMessages({
  cannotApplyErrorTitle: {
    id: 'vmst.ct.application:errorMessages.cannotApplyErrorTitle',
    defaultMessage: 'Vinsamlegast athugið',
    description: `Error title when user can not apply`,
  },
  cannotApplyErrorSummary: {
    id: 'vmst.ct.application:errorMessages.cannotApplyErrorSummary',
    defaultMessage:
      'Samkvæmt sóttum gögnum getur viðkomandi ekki tilkynnt um dvöl erlendis, ef þú telur að mistök séu að ræða vinsamlegast hafðu samband við Vinnumálastofnun',
    description: `Error summary when user can not apply`,
  },
  submitError: {
    id: 'vmst.ct.application:errorMessages.submitError',
    defaultMessage:
      'Villa við að skila inn umsókn. Reyndu aftur eða hafðu samband við Ísland.is',
    description: 'Error message when submit fails',
  },
  dateMustBeGreater: {
    id: 'vmst.ct.application:errorMessages.dateMustBeGreater',
    defaultMessage:
      'Dagsetning "Til" verður að vera seinna en dagsetning "Frá"',
    description: 'Error message when date range is wrong',
  },
})
