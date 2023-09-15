import { defineMessages } from 'react-intl'

export const serviceErrors = {
  createApplication: defineMessages({
    title: {
      id: 'fa.application:section.serviceErrors.createApplication.title',
      defaultMessage: 'Villa kom upp',
      description: 'Title of the createApplication error',
    },
    summary: {
      id: 'fa.application:section.serviceErrors.createApplication.summary',
      defaultMessage: 'Ekki tókst að senda inn umsóknina',
      description: 'Summary of the createApplication error',
    },
  }),
  veita: defineMessages({
    title: {
      id: 'fa.application:section.serviceErrors.veita.title',
      defaultMessage: 'Villa kom upp',
      description: 'Title of veita error',
    },
    summary: {
      id: 'fa.application:section.serviceErrors.veita.summary',
      defaultMessage: 'Eitthvað fór úrskeiðis við að sækja gögn',
      description: 'Summary of the veita error',
    },
  }),
  tax: defineMessages({
    title: {
      id: 'fa.application:section.serviceErrors.tax.title',
      defaultMessage: 'Villa kom upp',
      description: 'Title of the tax error',
    },
    summary: {
      id: 'fa.application:section.serviceErrors.tax.summary',
      defaultMessage: 'Eitthvað fór úrskeiðis við að sækja skattagögn',
      description: 'Summary of the tax error',
    },
  }),
}
