import { defineMessages } from 'react-intl'

export const taxReturnForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.taxReturnForm.general.sectionTitle',
      defaultMessage: 'Skattagögn',
      description: 'Tax return files form section Title',
    },
    pageTitle: {
      id: 'fa.application:section.taxReturnForm.general.pageTitle',
      defaultMessage: 'Skattagögn',
      description: 'Tax return files form page title',
    },
    description: {
      id: 'fa.application:section.taxReturnForm.general.description#markup',
      defaultMessage:
        'Við þurfum að fá afrit af nýjasta **skattframtali** þínu og staðfestingarskjal úr **staðreiðsluskrá** Skattsins. Skattframtal er staðfesting á öllum þeim tekjum, eignum og skuldum sem þú áttir á skattárinu og staðgreiðsluskrá er staðfesting/yfirlit frá Skattinum um skattskyldar tekjur umsækjanda á árinu. Bæði gögn eru nauðsynleg fylgigögn fyrir úrvinnslu á fjárhagsaðstoð.',
      description: 'Tax return files form description',
    },
  }),
}
