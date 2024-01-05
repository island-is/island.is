import { defineMessages } from 'react-intl'

export const taxReturnForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.taxReturnForm.general.sectionTitle',
      defaultMessage: 'Skattagögn',
      description: 'Tax return files form section title',
    },
    pageTitle: {
      id: 'fa.application:section.taxReturnForm.general.pageTitle',
      defaultMessage: 'Skattagögn',
      description: 'Tax return files page title',
    },
    description: {
      id: 'fa.application:section.taxReturnForm.general.description#markdown',
      defaultMessage:
        'Við þurfum að fá afrit af nýjasta **skattframtali** þínu og staðfestingarskjal úr **staðgreiðsluskrá** Skattsins.\n \n Skattframtal er staðfesting á öllum þeim tekjum, eignum og skuldum sem þú áttir á skattárinu og staðgreiðsluskrá er staðfesting/yfirlit frá Skattinum um skattskyldar tekjur umsækjanda á árinu. Bæði gögn eru nauðsynleg fylgigögn fyrir úrvinnslu á fjárhagsaðstoð.',
      description: 'Tax return files page description',
    },
  }),
  alertMessage: defineMessages({
    title: {
      id: 'fa.application:section.taxReturnForm.alertMessage.title',
      defaultMessage: 'Ekki tókst að sækja skattframtal og staðgreiðsluskrá',
      description: 'When fetching tax data fails title in alert box',
    },
    message: {
      id: 'fa.application:section.taxReturnForm.alertMessage.message',
      defaultMessage: 'Það náðist ekki tenging við Skattinn',
      description: 'When fetching tax data fails message in alert box',
    },
  }),
  data: defineMessages({
    taxReturnFailed: {
      id: 'fa.application:section.taxReturnForm.data.taxReturnFailed#markdown',
      defaultMessage:
        'Við þurfum að fá afrit úr **staðgreiðsluskrá**. Skattsins þar sem ekki náðist að sækja gögnin sjálfvirkt.\n \n Staðgreiðsluskrá er staðfesting/yfirlit frá Skattinum um skattskyldar tekjur umsækjanda á árinu. Það er nauðsynlegt fyrir úrvinnslu umsóknar um fjárhagsaðstoð.',
      description: 'When tax return fails, details about uploading it',
    },
    directTaxPaymentsFailed: {
      id: 'fa.application:section.taxReturnForm.data.directTaxPaymentsFailed#markdown',
      defaultMessage:
        'Við þurfum að fá afrit af nýjasta **skattframtali** þínu þar sem ekki náðist að sækja gögnin sjálfvirkt.\n \n Skattframtal er staðfesting á öllum þeim tekjum, eignum og skuldum sem þú áttir á skattárinu og er nauðsynlegt fylgigagn fyrir úrvinnslu á fjárhagsaðstoð.',
      description: 'When tax return fails, details about uploading it',
    },
  }),
  instructions: defineMessages({
    findTaxReturnTitle: {
      id: 'fa.application:section.taxReturnForm.instructions.findTaxReturnTitle',
      defaultMessage: 'Hvar finn ég staðfest afrit af mínu skattframtali?',
      description: 'Where to find tax return files title',
    },
    findTaxReturn: {
      id: 'fa.application:section.taxReturnForm.instructions.findTaxReturn#markdown',
      defaultMessage:
        'Á vef Skattsins finnur þú [leiðbeiningar](https://www.skatturinn.is/einstaklingar/framtal-og-alagning/stadfest-afrit-framtals/) um hvernig sækja má staðfest afrit skattframtals.',
      description: 'Where to find tax return files',
    },
    findDirectTaxPaymentsTitle: {
      id: 'fa.application:section.taxReturnForm.instructions.findDirectTaxPaymentsTitle',
      defaultMessage: 'Hvar finn ég staðfestingarskjal úr staðgreiðsluskrá?',
      description: 'Where to find direct tax payments files title',
    },
    findDirectTaxPayments: {
      id: 'fa.application:section.taxReturnForm.instructions.findDirectTaxPayments',
      defaultMessage:
        'Eftir að þú hefur innskráð þig á Þjónustuvef Skattsins ferð þú í Almennt → Staðgreiðsluskrá RSK → Sækja PDF.',
      description: 'Where to find direct tax payments files',
    },
  }),
}
