import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'fa.application:application.name',
    defaultMessage: 'Fjárhagsaðstoð',
    description: 'name of financial aid application',
  },
})

export const section = defineMessages({
  dataGathering: {
    id: 'fa.application:section.dataGathering',
    defaultMessage: 'Gagnaöflun',
    description: 'Data gathering section',
  },
  personalInterest: {
    id: 'fa.application:section.personalInterest',
    defaultMessage: 'Persónuhagir',
    description: 'Personal interest section',
  },
})

export const approveOptions = defineMessages({
  no: {
    id: 'fa.application:section.approveOptions.no',
    defaultMessage: 'Nei',
    description: 'Applicant selected no as his answer',
  },
  yes: {
    id: 'fa.application:section.approveOptions.yes',
    defaultMessage: 'Já',
    description: 'Applicant selected yes as his answer',
  },
})
