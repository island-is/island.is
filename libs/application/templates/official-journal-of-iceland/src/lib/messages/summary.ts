import { defineMessages } from 'react-intl'

export const summary = {
  general: defineMessages({
    formTitle: {
      id: 'ojoi.application:summary.general.formTitle',
      defaultMessage: 'Samantekt',
      description: 'Title of the summary form',
    },
    formIntro: {
      id: 'ojoi.application:summary.general.formIntro',
      defaultMessage:
        'Með því að senda auglýsingu til birtingar staðfestir þú eftirfarandi forsendur og felur Stjórnartíðindum að undirbúa útgáfu hennar.',
      description: 'Intro of the summary form',
    },
    sectionTitle: {
      id: 'ojoi.application:summary.general.sectionTitle',
      defaultMessage: 'Samantekt',
      description: 'Title of the summary section',
    },
  }),
  properties: defineMessages({
    sender: {
      id: 'ojoi.application:summary.properties.sender',
      defaultMessage: 'Sendandi',
      description: 'Sender of the advertisement',
    },
    type: {
      id: 'ojoi.application:summary.properties.type',
      defaultMessage: 'Tegund',
      description: 'Type of the advertisement',
    },
    title: {
      id: 'ojoi.application:summary.properties.title',
      defaultMessage: 'Heiti auglýsingar',
      description: 'Title of the advertisement',
    },
    department: {
      id: 'ojoi.application:summary.properties.department',
      defaultMessage: 'Deild',
      description: 'Department of the advertisement',
    },
    submissionDate: {
      id: 'ojoi.application:summary.properties.submissionDate',
      defaultMessage: 'Dagsetning innsendingar',
      description: 'Submission date of the advertisement',
    },
    fastTrack: {
      id: 'ojoi.application:summary.properties.fastTrack',
      defaultMessage: 'Óskir um hraðbirtingu',
      description: 'Fast track of the advertisement',
    },
    estimatedDate: {
      id: 'ojoi.application:summary.properties.estimatedDate',
      defaultMessage: 'Áætluð dagsetning birtingar',
      description: 'Estimated date of the advertisement',
    },
    estimatedPrice: {
      id: 'ojoi.application:summary.properties.estimatedPrice',
      defaultMessage: 'Áætlað verð',
      description: 'Estimated price of the advertisement',
    },
    classification: {
      id: 'ojoi.application:summary.properties.classification',
      defaultMessage: 'Málalokkun auglýsingar',
      description: 'Classification of the advertisement',
    },
  }),
}
