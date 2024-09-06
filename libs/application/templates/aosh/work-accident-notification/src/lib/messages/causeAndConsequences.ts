import { defineMessages } from 'react-intl'

export const causeAndConsequences = {
  absence: defineMessages({
    title: {
      id: 'aosh.wan.application:causeAndConsequences.absence.title',
      defaultMessage: 'Fjarvera vegna slyss',
      description: 'Title of the absence sub section',
    },
    description: {
      id: 'aosh.wan.application:causeAndConsequences.absence.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of the absence sub section',
    },
    alertMessageTitle: {
      id: 'aosh.wan.application:causeAndConsequences.absence.alertMessageTitle',
      defaultMessage: 'Fjarverudagar',
      description:
        'Title of the alert message field in the absence sub section',
    },
    alertMessage: {
      id: 'aosh.wan.application:causeAndConsequences.absence.alertMessage',
      defaultMessage:
        'Fjöldi almanaksdaga þar sem starfsmaðurinn er óvinnufær vegna vinnuslyss. Allir almanaksdagar telja óháð því hvort starfsmaður átti að vera í vinnu á þeim degi eða ekki.',
      description:
        'Message of the alert message field in the absence sub section',
    },
    absenceDueToAccident: {
      id: 'aosh.wan.application:causeAndConsequences.absence.absenceDueToAccident',
      defaultMessage: 'Fjarvera vegna slyssins',
      description: 'Label of select field, selecting absence due to accident',
    },
  }),
  circumstances: defineMessages({
    title: {
      id: 'aosh.wan.application:causeAndConsequences.circumstances.title',
      defaultMessage: 'Aðstæður slyss',
      description: 'Title of the circumstance page',
    },
  }),
}
