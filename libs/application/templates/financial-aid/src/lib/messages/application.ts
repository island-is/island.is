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

export const input = defineMessages({
  label: {
    id: 'fa.application:section.homeCircumstancesForm.general.inputLabel',
    defaultMessage: 'Lýstu þínum aðstæðum',
    description: 'Home circumstances custom form input label',
  },
})
