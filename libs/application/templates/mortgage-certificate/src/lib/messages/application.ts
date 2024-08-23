import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'mc.application:application.general.name',
      defaultMessage: 'Umsókn um veðbókarvottorð',
      description: "Application's name",
    },
    institutionName: {
      id: 'mc.application:application.general.institutionName',
      defaultMessage: 'Sýslumenn',
      description: "Institution's name",
    },
  }),
  values: defineMessages({
    maxPropertiesValue: {
      id: 'mc.application:application.values.maxPropertiesValue',
      defaultMessage: '10',
      description: 'Max properties value',
    },
  }),
  labels: defineMessages({
    continue: {
      id: 'mc.application:application.labels.continue',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
    actionCardPrerequisites: {
      id: 'mc.application:application.labels.actionCardPrerequisites',
      defaultMessage: 'Gagnaöflun',
      description:
        'Description of application state/status when the application is in prerequisites',
    },
    actionCardDraft: {
      id: 'mc.application:application.labels.actionCardDraft',
      defaultMessage: 'Í vinnslu',
      description:
        'Description of application state/status when the application is in progress',
    },
    actionCardPayment: {
      id: 'mc.application:application.labels.actionCardPayment',
      defaultMessage: 'Greiðslu vantar',
      description:
        'Description of application state/status when payment is pending',
    },
    actionCardDone: {
      id: 'mc.application:application.labels.actionCardDone',
      defaultMessage: 'Afgreidd',
      description:
        'Description of application state/status when application is processed',
    },
    pendingActionTryingToSubmitRequestToSyslumennTitle: {
      id: 'mc.application:application.labels.pendingActionTryingToSubmitRequestToSyslumennTitle',
      defaultMessage: 'Senda sýslumanni beiðni',
      description: 'Trying to submit request to syslumenn title',
    },
    pendingActionTryingToSubmitRequestToSyslumennDescription: {
      id: 'mc.application:application.labels.pendingActionTryingToSubmitRequestToSyslumennDescription',
      defaultMessage:
        'Það er verið að reyna að senda sýslumanni beiðni um lagfæringu á veðbókarvottorði',
      description: 'Trying to submit request to syslumenn description',
    },
    historyLogSubmittedRequestToSyslumenn: {
      id: 'mc.application:application.labels.historyLogSubmittedRequestToSyslumenn',
      defaultMessage:
        'Beiðni um lagfæringu á veðbókarvottorði hefur verið send sýslumanni',
      description: 'Submitted request to syslumenn',
    },
    pendingActionCheckIfSyslumennHasFixedKMarkingTitle: {
      id: 'mc.application:application.labels.pendingActionCheckIfSyslumennHasFixedKMarkingTitle',
      defaultMessage: 'Lagfæring á veðbókarvottorði í vinnslu',
      description: 'Check if syslumenn has fixed k marking title',
    },
    pendingActionCheckIfSyslumennHasFixedKMarkingDescription: {
      id: 'mc.application:application.labels.pendingActionCheckIfSyslumennHasFixedKMarkingDescription',
      defaultMessage:
        'Ef þú hefur fengið póst um að búið sé að lagfæra veðbókarvottorð, þarf að opna umsókn aftur og klára ferlið',
      description: 'Check if syslumenn has fixed k marking description',
    },
    historyLogSyslumennHasFixedKMarking: {
      id: 'mc.application:application.labels.historyLogSyslumennHasFixedKMarking',
      defaultMessage: 'Sýslumaður er búin að lagfæra veðbókarvottorðið',
      description: 'Syslumenn has fixed k marking',
    },
    pendingActionApplicationCompletedTitle: {
      id: 'mc.application:application.labels.pendingActionApplicationCompletedTitle',
      defaultMessage:
        'Umsókn þín hefur verið móttekin og er vottorðið aðgengilegt í stafrænu pósthólfi á Ísland.is.',
      description: 'Title of pending action',
    },
  }),
}
