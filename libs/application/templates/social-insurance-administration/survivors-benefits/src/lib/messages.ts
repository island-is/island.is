import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const survivorsBenefitsFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'sb.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'sb.application:applicationTitle',
      defaultMessage: 'Umsókn um dánarbætur',
      description: 'Application for survivors benefits',
    },
    formTitle: {
      id: 'sb.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'sb.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'sb.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'sb.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSection: {
      id: 'sb.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    externalDataSubTitle: {
      id: 'sb.application:externalData.sub.title',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt:',
      description: 'english translation',
    },
    checkboxProvider: {
      id: 'sb.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description: 'english translation',
    },
    registryIcelandTitle: {
      id: 'sb.application:registry.iceland.title',
      defaultMessage: 'Upplýsingar frá þjóðskrá',
      description: 'english translation',
    },
    registryIcelandDescription: {
      id: 'sb.application:registry.iceland.description',
      defaultMessage: 'Upplýsingar um þig, maka og börn.',
      description: 'english translation',
    },
    socialInsuranceAdministrationTitle: {
      id: 'sb.application:social.insurance.administration.title',
      defaultMessage: 'Upplýsingar af mínum síðum hjá Tryggingastofnun',
      description: 'english translation',
    },
    socialInsuranceAdministrationDescription: {
      id: 'sb.application:social.insurance.administration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikningur eru sóttar á mínar síður hjá Tryggingastofnun. TR sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðsla mála. Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar, [https://www.tr.is/tryggingastofnun/personuvernd](https://www.tr.is/tryggingastofnun/personuvernd).',
      description: 'english translation',
    },
    startApplication: {
      id: 'sb.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'sb.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    deceasedSpouseSubSection: {
      id: 'sb.application:deceased.spouse.sub.section',
      defaultMessage: 'Látinn maki/sambúðaraðili',
      description: 'english translation',
    },
    deceasedSpouseTitle: {
      id: 'sb.application:deceased.spouse.title',
      defaultMessage: 'Upplýsingar um látinn maka/sambúðaraðila',
      description: 'english translation',
    },
    deceasedSpouseDescription: {
      id: 'sb.application:deceased.spouse.description',
      defaultMessage:
        'Hérna eru upplýsingar um látinn maka/sambúðaraðila. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim í Þjóðskrá.',
      description: 'english translation',
    },
    deceasedSpouseName: {
      id: 'sb.application:deceased.spouse.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'sb.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'sb.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    title: {
      id: 'sb.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    description: {
      id: 'sb.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    buttonEdit: {
      id: 'sb.application:button.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    additionalDocumentsAttachment: {
      id: 'sb.application:additional.documents.attachment',
      defaultMessage: 'Viðbótargögn til Tryggingastofnunar',
      description: 'Additional documents to Tryggingastofnunar',
    },
  }),

  fileUpload: defineMessages({
    title: {
      id: 'sb.application:fileUpload.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    attachmentButton: {
      id: 'sb.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'sb.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'sb.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Accepted documents with the following extensions: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'sb.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    additionalFileTitle: {
      id: 'sb.application:fileUpload.additionalFile.title',
      defaultMessage: 'Viðbótagögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'sb.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangra upplýsinga. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
  }),

  comment: defineMessages({
    additionalInfoTitle: {
      id: 'sb.application:comment.additional.info.title',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional Information',
    },
    commentSection: {
      id: 'sb.application:comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    description: {
      id: 'sb.application:comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'If you have any comments, leave them here.',
    },
    placeholder: {
      id: 'sb.application:comment.placeholder',
      defaultMessage: 'Skrifaðu athugasemd hér',
      description: 'Your comment',
    },
  }),

}
