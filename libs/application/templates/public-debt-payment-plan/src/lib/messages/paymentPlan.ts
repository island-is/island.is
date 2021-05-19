import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

export const paymentPlan = {
  general: defineMessages({
    pageTitle: {
      id: `pdpp.application:section.paymentPlan.pageTitle`,
      defaultMessage: 'Yfirlit yfir skuldir ',
      description: 'Payment plan page title',
    },
    pageDescription: {
      id: `pdpp.application:section.paymentPlan.pageDescription`,
      defaultMessage: `Hér gefur að líta yfirlit yfir þær
      skuldir þar sem boðið er upp á greiðsludreifingu.
      Til að ganga frá greiðsludreifingu þarf að gera
      greiðsluáætlun fyrir allar útistandandi skuldir og undirrita áætlunina rafrænt.`,
    },
    paymentPlanDescription: {
      id: `pdpp.application:section.paymentPlan.paymentPlanDescription`,
      defaultMessage: 'Vinsamlegast veldu greiðslutímabil',
      description: 'Payment plan page description',
    },
  }),
  labels: defineMessages({
    sentAsAClaim: {
      id: `pdpp.application:section.paymentPlan.sentAsAClaim`,
      defaultMessage: `Þessi skuld verður send sem krafa`,
      description: 'Notes that this payment will be sent as a claim',
    },
    deductedFromSalary: {
      id: `pdpp.application:section.paymentPlan.deductedFromSalary`,
      defaultMessage: `Þessi skuld verður dregin af launum`,
      description: `Notes that this payment will be deducted from the user's salary`,
    },
    totalAmount: {
      id: `pdpp.application:section.paymentPlan.totalAmount`,
      defaultMessage: `Heildarupphæð`,
      description: `Total amount label`,
    },
    moreInfo: {
      id: `pdpp.application:section.paymentPlan.moreInfo`,
      defaultMessage: `Nánari upplýsingar`,
      description: `More info label`,
    },
    feeCategory: {
      id: `pdpp.application:section.paymentPlan.feeCategory`,
      defaultMessage: `Gjaldflokkur`,
      description: `Fee category label`,
    },
    principal: {
      id: `pdpp.application:section.paymentPlan.principal`,
      defaultMessage: `Höfuðstóll`,
      description: `Principal amount label`,
    },
    interest: {
      id: `pdpp.application:section.paymentPlan.interest`,
      defaultMessage: `Vextir`,
      description: `Interest amount label`,
    },
    expense: {
      id: `pdpp.application:section.paymentPlan.expense`,
      defaultMessage: `Kostnaður`,
      description: `Expense label`,
    },
    editPaymentPlan: {
      id: `pdpp.application:section.paymentPlan.editPaymentPlan`,
      defaultMessage: `Breyta greiðsludreifingu`,
      description: `Edit payment plan label`,
    },
    paymentModeTitle: {
      id: `pdpp.application:section.paymentPlan.paymentModeTitle`,
      defaultMessage: `Veldu greiðsludreifingu skuldar`,
      description: `Payment mode label`,
    },
    payByAmount: {
      id: `pdpp.application:section.paymentPlan.payByAmount`,
      defaultMessage: `Velja eftir fjárhæð`,
      description: `Pay by amount radio label`,
    },
    payByMonths: {
      id: `pdpp.application:section.paymentPlan.payByMonths`,
      defaultMessage: `Velja fjölda mánaða`,
      description: `Pay by months label`,
    },
    chooseAmountPerMonth: {
      id: `pdpp.application:section.paymentPlan.chooseAmountPerMonth`,
      defaultMessage: `Veldu upphæðina sem þú vilt greiða á mánuði`,
      description: `Amount slider heading`,
    },
    chooseNumberOfMonths: {
      id: `pdpp.application:section.paymentPlan.chooseNumberOfMonths`,
      defaultMessage: `Veldu fjölda mánaða sem þú vilt dreifa á`,
      description: `Amount slider heading`,
    },
  }),
}
