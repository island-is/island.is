import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: 'crc.application:application.name',
    defaultMessage: 'Samningur um breytt lögheimili barns og meðlag',
    description: 'Name of the Children Residence Change application',
  },
  signature: {
    id: 'crc.application:application.signature',
    defaultMessage: 'Skrifa undir umsókn',
    description: 'Button text for signing application',
  },
  confirm: {
    id: 'crc.application:application.confirm',
    defaultMessage: 'Staðfesta',
    description: 'Button text for confirming application',
  },
})

export const copyUrl = defineMessages({
  title: {
    id: 'crc.application:copyUrl.title',
    defaultMessage: 'Deila hlekk',
    description: 'Copy url title',
  },
  inputLabel: {
    id: 'crc.application:copyUrl.inputLabel',
    defaultMessage: 'Hlekkur á umsóknina',
    description: 'Copy url input label',
  },
  buttonLabel: {
    id: 'crc.application:copyUrl.buttonLabel',
    defaultMessage: 'Afrita hlekk',
    description: 'Copy url button text',
  },
  successMessage: {
    id: 'crc.application:copyUrl.successMessage',
    defaultMessage: 'Hlekkur afritaður',
    description: 'Copy url success text',
  },
})

// All sections in the application
export const section = defineMessages({
  backgroundInformation: {
    id: 'crc.application:section.backgroundInformation',
    defaultMessage: 'Grunnupplýsingar',
    description: 'Background information',
  },
  arrangement: {
    id: 'crc.application:section.arrangement',
    defaultMessage: 'Fyrirkomulag',
    description: 'Arrangement',
  },
  effect: {
    id: 'crc.application:section.effect',
    defaultMessage: 'Áhrif umsóknar',
    description: 'Effect of Application',
  },
  overview: {
    id: 'crc.application:section.overview',
    defaultMessage: 'Yfirlit og undirritun',
    description: 'Overview and Signing',
  },
  received: {
    id: 'crc.application:section.received',
    defaultMessage: 'Umsókn móttekin',
    description: 'Application Received',
  },
  waiting: {
    id: 'crc.application:section.waiting',
    defaultMessage: 'Beðið eftir sýslumanni',
    description: 'Application waiting for organization',
  },
  rejected: {
    id: 'crc.application:section.rejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application rejected',
  },
  approved: {
    id: 'crc.application:section.approved',
    defaultMessage: 'Umsókn samþykkt',
    description: 'Application approved',
  },
})

export const stateDescriptions = defineMessages({
  draft: {
    id: 'crc.application:stateDescriptions.draft',
    defaultMessage:
      'Samningur um breytt lögheimili barna og meðlag er í vinnslu hjá þér og hefur ekki verið undirritaður.',
    description: 'Draft',
  },
  inReview: {
    id: 'crc.application:stateDescriptions.inReview',
    defaultMessage:
      'Foreldrið sem hóf málið hefur gert drög að samningi um breytt lögheimili barna og meðlag. Hitt forsjárforeldrið þarf nú að lesa yfir og samþykkja samninginn með rafrænni undirritun. Eftir að báðir foreldrar hafa undirritað samning fer hann í afgreiðslu hjá sýslumanni.',
    description: 'In review for parent B',
  },
  submitted: {
    id: 'crc.application:stateDescriptions.submitted',
    defaultMessage:
      'Samningur ykkar um breytt lögheimili og meðlag er í afgreiðsluferli hjá sýslumanni. Ef sýslumaður telur þörf á frekari upplýsingum mun hann hafa samband. Afgreiðsla sýslumanns getur tekið allt að tvær vikur. ',
    description: 'Submitted to the Commissioner',
  },
  rejectedByParentB: {
    id: 'crc.application:stateDescriptions.rejectedByParentB',
    defaultMessage:
      'Samningi sem var útbúinn á Island.is var hafnað af seinna forsjárforeldrinu. Hægt er að hefja samningsferlið aftur, senda beiðni um breytingu á sýslumann eða óska eftir viðtali til að ræða næstu skref.',
    description: 'Rejected by parent B',
  },
  rejected: {
    id: 'crc.application:stateDescriptions.rejected',
    defaultMessage:
      'Umsókn ykkar um breytt lögheimili og meðlag var hafnað af sýslumanni. Ástæður höfnunar koma fram í bréfi sem er að finna undir Rafræn skjöl á Island.is.',
    description: 'Waiting for the Commissioner',
  },
  waiting: {
    id: 'crc.application:stateDescriptions.waiting',
    defaultMessage:
      'Umsókn ykkar um breytt lögheimili barns er í vinnslu hjá sýslumanni.',
    description: 'Rejected by the Commissioner',
  },
  approved: {
    id: 'crc.application:stateDescriptions.approved',
    defaultMessage:
      'Samningur ykkar um breytt lögheimili og meðlag var staðfestur af sýslumanni. Formlega staðfestingu er að finna undir Rafræn skjöl á Island.is. Til að meðlag fari í innheimtu þarf nýtt lögheimilisforeldri að skila staðfestingunni rafrænt til Tryggingastofnunar.',
    description: 'Approved by the Commissioner',
  },
})

export const stateLabels = defineMessages({
  rejected: {
    id: 'crc.application:stateLabels.rejected',
    defaultMessage: 'Hafnað',
    description: 'Rejected',
  },
  submitted: {
    id: 'crc.application:stateLabels.submitted',
    defaultMessage: 'Í afgreiðslu',
    description: 'Submitted to the Commissioner',
  },
  approved: {
    id: 'crc.application:stateLabels.approved',
    defaultMessage: 'Samþykkt',
    description: 'Approved',
  },
})
