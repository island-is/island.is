import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

export const paymentPlan = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.paymentPlan.pageTitle`,
      defaultMessage: 'Yfirlit yfir skuldir ',
      description: 'Payment plan page title',
    },
    pageDescription: {
      id: `${t}:section.paymentPlan.pageDescription`,
      defaultMessage: `Hér gefur að líta yfirlit yfir þær
      skuldir þar sem boðið er upp á greiðsludreifingu.
      Til að ganga frá greiðsludreifingu þarf að gera
      greiðsluáætlun fyrir allar útistandandi skuldir og undirrita áætlunina rafrænt.`,
    },
    paymentPlanDescription: {
      id: `${t}:section.paymentPlan.paymentPlanDescription`,
      defaultMessage: 'Vinsamlegast veldu greiðslutímabil',
      description: 'Payment plan page description',
    },
  }),
  labels: defineMessages({
    sentAsAClaim: {
      id: `${t}:section.paymentPlan.sentAsAClaim`,
      defaultMessage: `Þessi skuld verður send sem krafa`,
      description: 'Notes that this payment will be sent as a claim',
    },
    deductedFromSalary: {
      id: `${t}:section.paymentPlan.deductedFromSalary`,
      defaultMessage: `Þessi skuld verður dregin af launum`,
      description: `Notes that this payment will be deducted from the user's salary`,
    },
    totalAmount: {
      id: `${t}:section.paymentPlan.totalAmount`,
      defaultMessage: `Heildarupphæð`,
      description: `Total amount label`,
    },
    moreInfo: {
      id: `${t}:section.paymentPlan.moreInfo`,
      defaultMessage: `Nánari upplýsingar`,
      description: `More info label`,
    },
    feeCategory: {
      id: `${t}:section.paymentPlan.feeCategory`,
      defaultMessage: `Gjaldflokkur`,
      description: `Fee category label`,
    },
    principal: {
      id: `${t}:section.paymentPlan.principal`,
      defaultMessage: `Höfuðstóll`,
      description: `Principal amount label`,
    },
    interest: {
      id: `${t}:section.paymentPlan.interest`,
      defaultMessage: `Vextir`,
      description: `Interest amount label`,
    },
    expense: {
      id: `${t}:section.paymentPlan.expense`,
      defaultMessage: `Kostnaður`,
      description: `Expense label`,
    },
    editPaymentPlan: {
      id: `${t}:section.paymentPlan.editPaymentPlan`,
      defaultMessage: `Breyta greiðsludreifingu`,
      description: `Edit payment plan label`,
    },
    paymentModeTitle: {
      id: `${t}:section.paymentPlan.paymentModeTitle`,
      defaultMessage: `Veldu greiðsludreifingu skuldar`,
      description: `Payment mode label`,
    },
    payByAmount: {
      id: `${t}:section.paymentPlan.payByAmount`,
      defaultMessage: `Velja eftir fjárhæð`,
      description: `Pay by amount radio label`,
    },
    payByMonths: {
      id: `${t}:section.paymentPlan.payByMonths`,
      defaultMessage: `Velja fjölda mánaða`,
      description: `Pay by months label`,
    },
  }),
}
