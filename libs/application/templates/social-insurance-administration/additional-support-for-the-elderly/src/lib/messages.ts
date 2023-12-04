import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const additionalSupportForTheElderyFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'asfte.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'asfte.application:applicationTitle',
      defaultMessage: 'Umsókn um félagslegan viðbótarstuðning',
      description: 'Application for additional support for the eldery',
    },
    formTitle: {
      id: 'asfte.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'asfte.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'asfte.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    alertTitle: {
      id: 'asfte.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'asfte.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    externalDataDescription: {
      id: 'asfte.application:externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'english translation',
    },
    checkboxProvider: {
      id: 'asfte.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    skraInformationTitle: {
      id: 'asfte.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    skraInformationSubTitle: {
      id: 'asfte.application:prerequisites.national.registry.subtitle',
      defaultMessage: 'Upplýsingar um þig og maka. Upplýsingar um búsetu.',
      description:
        'Information about you and spouse. Information about residence.',
    },
    socialInsuranceAdministrationInformationTitle: {
      id: 'asfte.application:prerequisites.socialInsuranceAdministration.title',
      defaultMessage: 'Upplýsingar um tekjur og aðstæður',
      description: 'Information about income and circumstances',
    },
    socialInsuranceAdministrationInformationDescription: {
      id: 'asfte.application:prerequisites.socialInsuranceAdministration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikningur eru sóttar á mínar síður hjá Tryggingastofnun. Tryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðsla mála. Þær upplýsingar geta varðað bæði tekjur og aðrar aðstæður þínar. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar, [https://www.tr.is/tryggingastofnun/personuvernd](https://www.tr.is/tryggingastofnun/personuvernd). Ef tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.',
      description: 'english translation',
    },
    startApplication: {
      id: 'asfte.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),
}
