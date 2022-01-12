import { defineMessages } from 'react-intl'

export const incomeForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.incomeForm.general.sectionTitle',
      defaultMessage: 'Tekjur',
      description: 'Income form section Title',
    },
    pageTitle: {
      id: 'fa.application:section.incomeForm.general.pageTitle',
      defaultMessage: 'Hefur þú fengið tekjur í þessum eða síðustu tvo mánuði?',
      description: 'Income form page title',
    },
  }),
  bulletList: defineMessages({
    headline: {
      id: 'fa.application:section.incomeForm.bulletList.headline',
      defaultMessage: 'Dæmi um tekjur',
      description: 'Income form bullet list headline',
    },
  }),
  examplesOfIncome: defineMessages({
    fromEmployer: {
      id: 'fa.application:section.incomeForm.examplesOfIncome.fromEmployer',
      defaultMessage: 'Greiðslur frá atvinnurekanda',
      description: 'Income form examples payments from employer',
    },
    fromDirectorateOfLabor: {
      id:
        'fa.application:section.incomeForm.examplesOfIncome.fromDirectorateOfLabor',
      defaultMessage: 'Greiðslur frá Vinnumálastofnun',
      description:
        'Income form examples payments from directorate of labor (Vinnumálastofnun)',
    },
    fromInsurance: {
      id: 'fa.application:section.incomeForm.examplesOfIncome.fromInsurance',
      defaultMessage: 'Greiðslur frá Tryggingastofnun',
      description: 'Income form examples payments from insurance company',
    },
    fromMaternityLeaveFund: {
      id:
        'fa.application:section.incomeForm.examplesOfIncome.fromMaternityLeaveFund',
      defaultMessage: 'Greiðslur frá fæðingarorlofssjóði',
      description:
        'Income form examples payments from maternity/parent leave fund',
    },
    fromHealthInsurance: {
      id:
        'fa.application:section.incomeForm.examplesOfIncome.fromHealthInsurance',
      defaultMessage: 'Greiðslur frá Sjúkratryggingum Íslands',
      description:
        'Income form examples payments from Icelandic health insurance',
    },
    fromPensionFund: {
      id: 'fa.application:section.incomeForm.examplesOfIncome.fromPensionFund',
      defaultMessage: 'Styrkir frá lífeyrissjóðum',
      description: 'Income form examples grants from pension funds',
    },
  }),
}
