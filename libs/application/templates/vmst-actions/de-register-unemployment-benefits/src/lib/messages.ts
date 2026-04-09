import { defineMessages } from 'react-intl'

export const prerequisitesForm = {
  general: defineMessages({
    tabTitle: {
      id: 'vmst.dub.application:prerequisitesForm.general.tabTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'prerequisites section tab title',
    },
    externalDataTitle: {
      id: 'vmst.dub.application:prerequisitesForm.general.externalDataTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'external data provider title',
    },
  }),
  dataProviders: defineMessages({
    vmstTitle: {
      id: 'vmst.dub.application:prerequisitesForm.dataProviders.vmstTitle',
      defaultMessage: 'Vinnumálastofnun',
      description: 'vmst data provider title',
    },
    vmstSubTitle: {
      id: 'vmst.dub.application:prerequisitesForm.dataProviders.vmstSubTitle',
      defaultMessage: 'Gögn sótt til Vinnumálastofnunar',
      description: 'vmst data provider subtitle',
    },
  }),
}

export const mainForm = {
  general: defineMessages({
    title: {
      id: 'vmst.dub.application:mainForm.general.title',
      defaultMessage: 'Afskráning',
      description: 'main form title',
    },
    description: {
      id: 'vmst.dub.application:mainForm.general.description',
      defaultMessage:
        'Vinsamlegast taktu fram frá hvaða degi þú óskar eftir að vera ekki lengur á atvinnuleysisbótum og skráðu ástæður afskráningar þinnar. Það hjálpar okkur að bæta þjónustuna okkar.',
      description: 'main form description',
    },
    submitApplication: {
      id: 'vmst.dub.application:mainForm.general.submitApplication',
      defaultMessage: 'Staðfesta',
      description: 'main form submit button',
    },
  }),
  deregistrationDate: defineMessages({
    deregistrationDateTitle: {
      id: 'vmst.dub.application:mainForm.deregistrationDate.deregistrationDateTitle',
      defaultMessage:
        'Ég óska eftir því að vera afskráð/ur af atvinnuleysisbótum og úr atvinnuleit frá og með:',
      description: 'deregistration date field title',
    },
    deregistrationDateLabel: {
      id: 'vmst.dub.application:mainForm.deregistrationDate.deregistrationDateLabel',
      defaultMessage: 'Dagsetning afskráningar',
      description: 'deregistration date field label',
    },
    deregistrationDatePlaceholder: {
      id: 'vmst.dub.application:mainForm.deregistrationDate.deregistrationDatePlaceholder',
      defaultMessage: 'Veldu tímabil',
      description: 'deregistration date field placeholder',
    },
  }),
  reason: defineMessages({
    title: {
      id: 'vmst.dub.application:mainForm.reason.title',
      defaultMessage: 'Vinsamlegast tilgreinið ástæðu afskráningar',
      description: 'reason radio field title',
    },
    foundJob: {
      id: 'vmst.dub.application:mainForm.reason.foundJob',
      defaultMessage: 'Fór í vinnu',
      description: 'found job radio option label',
    },
    movingCountries: {
      id: 'vmst.dub.application:mainForm.reason.movingCountries',
      defaultMessage: 'Er að flytja úr landi (vinna/búseta)',
      description: 'moving countries radio option label',
    },
    education: {
      id: 'vmst.dub.application:mainForm.reason.education',
      defaultMessage: 'Fór í nám',
      description: 'education radio option label',
    },
    maternityLeave: {
      id: 'vmst.dub.application:mainForm.reason.maternityLeave',
      defaultMessage: 'Fór í fæðingarorlof',
      description: 'maternity leave radio option label',
    },
    cancelled: {
      id: 'vmst.dub.application:mainForm.reason.cancelled',
      defaultMessage: 'Hætti við / dró umsókn til baka',
      description: 'cancelled radio option label',
    },
    unable: {
      id: 'vmst.dub.application:mainForm.reason.unable',
      defaultMessage: 'Óvinnufær',
      description: 'unable radio option label',
    },
    other: {
      id: 'vmst.dub.application:mainForm.reason.other',
      defaultMessage: 'Aðrar ástæður',
      description: 'other radio option label',
    },
    otherReasonTitle: {
      id: 'vmst.dub.application:mainForm.reason.otherReasonTitle',
      defaultMessage: 'Ástæður afskráningar',
      description: 'other reason text field title',
    },
  }),
}

export const completedForm = defineMessages({
  alertTitle: {
    id: 'vmst.dub.application:completedForm.alertTitle',
    defaultMessage: 'Tilkynning um afskráningu hefur verið móttekin',
    description: 'completed form alert title',
  },
  alertMessage: {
    id: 'vmst.dub.application:completedForm.alertMessage',
    defaultMessage: 'You have completed this boilerplate application',
    description: 'completed form alert message',
  },
  expandableHeader: {
    id: 'vmst.dub.application:completedForm.expandableHeader',
    defaultMessage: 'Hvað gerist næst?',
    description: 'completed form expandable header',
  },
  expandableDescription: {
    id: 'vmst.dub.application:completedForm.expandableDescription',
    defaultMessage:
      'Þetta er lýsing á því hvað gerist eftir að umsókn hefur verið send inn',
    description: 'completed form expandable description',
  },
  descriptionFieldTitle: {
    id: 'vmst.dub.application:completedForm.descriptionFieldTitle',
    defaultMessage: 'Er eitthvað óljóst?',
    description: 'completed form description field title',
  },
  descriptionFieldDescription: {
    id: 'vmst.dub.application:completedForm.descriptionFieldDescription#markdown',
    defaultMessage:
      'Skoðaðu nánari upplýsingar á upplýsingasíðu Vinnumálastofnuna',
    description: 'completed form description field description',
  },
})
