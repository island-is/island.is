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
    prerequisitesSection: {
      id: 'asfte.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
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

  info: defineMessages({
    periodTitle: {
      id: 'asfte.application:info.period.title',
      defaultMessage: 'Tímabil',
      description: 'Period',
    },
    periodDescription: {
      id: 'asfte.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greidda heimilisuppbót. Hægt er að sækja um fyrir þrjá mánuði aftur í tímann.',
      description: `english translation`,
    },
    periodYear: {
      id: 'asfte.application:info.period.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    periodYearDefaultText: {
      id: 'asfte.application:info.period.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    periodMonth: {
      id: 'asfte.application:info.period.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    periodMonthDefaultText: {
      id: 'asfte.application:info.period.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },

  }),

  confirm: defineMessages({
    section: {
      id: 'asfte.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    title: {
      id: 'asfte.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    description: {
      id: 'asfte.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    buttonEdit: {
      id: 'asfte.application:button.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    additionalDocumentsAttachment: {
      id: 'asfte.application:additional.documents.attachment',
      defaultMessage: 'Viðbótargögn til Tryggingastofnunar',
      description: 'Additional documents to Tryggingastofnunar',
    },
  }),

  fileUpload: defineMessages({
    title: {
      id: 'asfte.application:fileUpload.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    attachmentButton: {
      id: 'asfte.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'asfte.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'asfte.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Accepted documents with the following extensions: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'asfte.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    additionalFileTitle: {
      id: 'asfte.application:fileUpload.additionalFile.title',
      defaultMessage: 'Viðbótagögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'asfte.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangra upplýsinga. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
  }),

  comment: defineMessages({
    additionalInfoTitle: {
      id: 'asfte.application:comment.additional.info.title',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional Information',
    },
    commentSection: {
      id: 'asfte.application:comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    description: {
      id: 'asfte.application:comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'If you have any comments, leave them here.',
    },
    placeholder: {
      id: 'asfte.application:comment.placeholder',
      defaultMessage: 'Skrifaðu athugasemd hér',
      description: 'Your comment',
    },
  }),

  months: defineMessages({
    january: {
      id: 'asfte.application:month.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'asfte.application:month.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'asfte.application:month.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'asfte.application:month.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'asfte.application:month.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'asfte.application:month.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'asfte.application:month.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'asfte.application:month.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'asfte.application:month.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'asfte.application:month.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'asfte.application:month.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'asfte.application:month.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
  }),
}

export const errorMessages = defineMessages({
  period: {
    id: 'asfte.application:error.period',
    defaultMessage: 'Ógildur mánuður.',
    description: 'Invalid month.',
  },
})
