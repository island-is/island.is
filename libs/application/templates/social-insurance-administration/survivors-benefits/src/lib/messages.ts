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
    socialInsuranceAdministrationInformationTitle: {
      id: 'sb.application:prerequisites.socialInsuranceAdministration.title',
      defaultMessage: 'Upplýsingar um tekjur og aðstæður',
      description: 'Information about income and circumstances',
    },
    socialInsuranceAdministrationInformationDescription: {
      id: 'sb.application:prerequisites.socialInsuranceAdministration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikningur eru sóttar á mínar síður hjá Tryggingastofnun. Tryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðsla mála. Þær upplýsingar geta varðað bæði tekjur og aðrar aðstæður þínar. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar, [https://www.tr.is/tryggingastofnun/personuvernd](https://www.tr.is/tryggingastofnun/personuvernd). Ef tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.',
      description: 'english translation',
    },
    startApplication: {
      id: 'sb.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
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

  confirm: defineMessages({
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
}
