import { defineMessages } from 'react-intl'

export const paymentInfo = defineMessages({
  noticeTitle: {
    id: 'dp.application:paymentInfo.noticeTitle',
    defaultMessage: 'Til athugunar!',
    description: 'Notice title',
  },
  notice: {
    id: 'dp.application:paymentInfo.notice#markdown',
    defaultMessage: `Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reikning. \n\n
Mikilvægt er að bankaupplýsingarnar séu réttar. Gott er að hafa samband við viðskiptabanka sinn til að ganga úr skugga um að upplýsingarnar séu réttar ásamt því að fá upplýsingar um ÍBAN-númer og SWIFT-númer. \n\n
Vinsamlegast athugið að greiðslur inn á erlenda reiknginga geta tekið 3-4 daga. Banki sem sér um millifærslu leggur á þjónustugjald fyrir millifærslunni.`,
    description: 'TODO',
  },
  accountType: {
    id: 'dp.application:paymentInfo.accountType',
    defaultMessage: 'Tegund reiknings',
    description: 'Account type',
  },

  foreignAccount: {
    id: 'dp.application:paymentInfo.foreignAccount',
    defaultMessage: 'Erlendur reikningur',
    description: 'Foreign account',
  },
  foreignAccountNotice: {
    id: 'dp.application:paymentInfo.foreignAccountNotice',
    defaultMessage:
      'Ef þú ert með erlendan bankareikning sér Tryggingastofnun um að millifæra greiðslur. Greiðslurnar samræmast milliríkjasamningi Íslands við EES, Bandaríkin og Kanada og verður reikningur því að vera skráður í þeim löndum (?). Millifærslur á erlenda reikninga fara í gegnum viðskiptabanka til erlendra banka, sem getur falið í sér kostnað vegna millifærslu. Einnig getur það falið í sér gengistap. Því er almennt dýrara að fá lífeyrisgreiðslur greiddar inn á erlendan reikning . ',
    description: 'TODO',
  },
  bank: {
    id: 'dp.application:paymentInfo.bank',
    defaultMessage: 'Banki',
    description: 'Bank',
  },
  bankAddress: {
    id: 'dp.application:paymentInfo.bankAddress',
    defaultMessage: 'Heimilisfang banka',
    description: 'Bank address',
  },
  personalAllowanceLabel: {
    id: 'dp.application:paymentInfo.personalAllowanceLabel',
    defaultMessage: 'Persónuafsláttur',
    description: 'Personal allowance',
  },
  personalAllowance: {
    id: 'dp.application:paymentInfo.personalAllowance',
    defaultMessage: 'Vilt þú nýta þér persónuafsláttinn þinn?',
    description: 'Do you want to use your personal allowance',
  },
  personalAllowanceRatio: {
    id: 'dp.application:paymentInfo.personalAllowanceRatio',
    defaultMessage: 'Hlutfall',
    description: 'Personal allowance ratio',
  },
  taxationLevel: {
    id: 'dp.application:paymentInfo.taxationLevel',
    defaultMessage: 'Skattþrep',
    description: 'Taxation level',
  },

  yes: {
    id: 'dp.application:paymentInfo.yes',
    defaultMessage: 'Já',
    description: 'Yes',
  },
  no: {
    id: 'dp.application:paymentInfo.no',
    defaultMessage: 'Nei',
    description: 'No',
  },
})
