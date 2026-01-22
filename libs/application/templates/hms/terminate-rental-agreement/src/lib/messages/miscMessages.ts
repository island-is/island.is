import { defineMessages } from 'react-intl'

export const miscMessages = defineMessages({
  applicationName: {
    id: 'tra.application:misc.applicationName',
    defaultMessage: 'Uppsögn eða riftun leigusamnings',
    description: 'Application name',
  },
  personalInformationSectionTitle: {
    id: 'tra.application:misc.personalInformationSectionTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'Personal information section title',
  },
  actionCardDone: {
    id: 'tra.application:misc.actionCardDone',
    defaultMessage: 'Send til HMS',
    description: 'Action card done',
  },
  actioncardDoneTitleCancelation: {
    id: 'tra.application:misc.actioncardDoneTitleCancelation',
    defaultMessage: 'Tilkynning um riftun send til HMS',
    description: 'Action card done title cancelation',
  },
  actioncardDoneTitleTermination: {
    id: 'tra.application:misc.actioncardDoneTitleTermination',
    defaultMessage: 'Tilkynning um uppsögn send til HMS',
    description: 'Action card done title termination',
  },
  actioncardDoneTitleCancelationWithAddress: {
    id: 'tra.application:misc.actioncardDoneTitleCancelationWithAddress',
    defaultMessage: 'Tilkynning um riftun vegna {address} send til HMS',
    description: 'Action card done title cancelation with address',
  },
  actioncardDoneTitleTerminationWithAddress: {
    id: 'tra.application:misc.actioncardDoneTitleTerminationWithAddress',
    defaultMessage: 'Tilkynning um uppsögn vegna {address} send til HMS',
    description: 'Action card done title termination with address',
  },
})
