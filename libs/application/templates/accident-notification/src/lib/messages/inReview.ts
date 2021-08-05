import { defineMessages } from 'react-intl'

export const inReview = {
  general: defineMessages({
    formTitle: {
      id: 'an.application:inReview.form.title',
      defaultMessage: 'Staða umsóknar',
      description: 'Parental Leave',
    },
    titleInReview: {
      id: 'an.application:inReview.titleInReview',
      defaultMessage: 'Umsókn þín er í skoðun',
      description: 'Your application is in review',
    },
    titleApproved: {
      id: 'an.application:inReview.titleApproved',
      defaultMessage: 'Umsókn þín er samþykkt',
      description: 'Your application is in approved',
    },
  }),
  tags: defineMessages({
    missingDocuments: {
      id: 'an.application:inReview.tags.missingDocuments',
      defaultMessage: 'Skjöl vantar',
      description: 'Missing documents',
    },
    approved: {
      id: 'an.application:inReview.tags.approved',
      defaultMessage: 'Samþykkt',
      description: 'Approved',
    },
    pending: {
      id: 'an.application:inReview.tags.pending',
      defaultMessage: 'Í bið',
      description: 'Pending',
    },
    received: {
      id: 'an.application:inReview.tags.received',
      defaultMessage: 'Móttekin',
      description: 'Received',
    },
    objected: {
      id: 'an.application:inReview.tags.objected',
      defaultMessage: 'Andmælt',
      description: 'Objected',
    },
  }),
  application: defineMessages({
    title: {
      id: 'an.application:inReview.application.title',
      defaultMessage: 'Tilkynning móttekin',
      description: 'Title for application section in review',
    },
    summary: {
      id: 'an.application:inReview.application.summary',
      defaultMessage:
        'Slysatilkynning hefur verið send til Sjúkratryggingar Íslands',
      description: 'Summary for application section in review',
    },
  }),
  documents: defineMessages({
    title: {
      id: 'an.application:inReview.documents.title',
      defaultMessage: 'Afhending skjala',
      description: 'Title for documents section in review',
    },
    summary: {
      id: 'an.application:inReview.documents.summary',
      defaultMessage: 'Nauðsynleg gögn vantar: ',
      description: 'Summary for documents section in review',
    },
    summaryApproved: {
      id: 'an.application:inReview.documents.summaryApproved',
      defaultMessage: 'Nauðsynleg gögn móttekin',
      description: 'Summary for documents section in review',
    },
  }),
  representative: defineMessages({
    title: {
      id: 'an.application:inReview.representative.title',
      defaultMessage: 'Forsvarsmaður fer yfir tilkynningu',
      description: 'Title for representative section in review',
    },
    summary: {
      id: 'an.application:inReview.representative.summary',
      defaultMessage:
        'Svo hægt er að greiða út bætur fyrir slysið þarf þriðji aðilli að staðfesta að upplýsingar eru réttar',
      description: 'Summary for representative section in review',
    },
  }),
  sjukratrygging: defineMessages({
    title: {
      id: 'an.application:inReview.sjukratrygging.title',
      defaultMessage: 'Sjúkratryggingar Íslands fer yfir umsókn',
      description: 'Title for sjukratrygging section in review',
    },
    summary: {
      id: 'an.application:inReview.sjukratrygging.summary',
      defaultMessage:
        'Þegar öll nauðsynleg gögn hafa borist, fer Sjúkratryggingar Íslands yfir umsókn og er þá afstaða tekin til bótaskyldu.',
      description: 'Summary for sjukratrygging section in review',
    },
  }),
  infoMessages: defineMessages({
    applicationUpdated: {
      id: 'an.application:inReview.infoMessages.applicationUpdated',
      defaultMessage: 'Tilkynning uppfærð',
      description: 'Message to user when application has been updated',
    },
  }),
}
