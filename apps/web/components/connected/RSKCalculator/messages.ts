import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  title: {
    id: 'web.rsk.calculator:title',
    defaultMessage: '',
    description: 'Titill reiknivélar',
  },
  disclaimer: {
    id: 'web.rsk.calculator:disclaimer',
    defaultMessage: '',
    description: 'Fyrirvari undir reiknivél',
  },
  sectionPaymentsTitle: {
    id: 'web.rsk.calculator:sectionPaymentsTitle',
    defaultMessage: 'Launagreiðslur',
    description: 'Titill á reit fyrir launagreiðslur',
  },
  sectionContributionsTitle: {
    id: 'web.rsk.calculator:sectionContributionsTitle',
    defaultMessage: 'Iðgjald',
    description: 'Titill á reit fyrir iðgjöld',
  },
  sectionPersonalTaxCreditTitle: {
    id: 'web.rsk.calculator:sectionPersonalTaxCreditTitle',
    defaultMessage: 'Persónuafsláttur',
    description: 'Titill á reit fyrir persónuafslátt',
  },
  sectionPersonalTaxCreditDescription: {
    id: 'web.rsk.calculator:sectionPersonalTaxCreditDescription',
    defaultMessage:
      'Ef persónuafsláttur er ekki fullnýttur safnast hann upp og má nýta hann innan tekjuársins. Makar geta samnýtt persónuafslátt, til dæmis ef annar er ekki með reglulegar tekjur.',
    description: 'Lýsing á reit fyrir persónuafslátt',
  },
  sectionDeductionsTitle: {
    id: 'web.rsk.calculator:sectionDeductionsTitle',
    defaultMessage: 'Frádráttur',
    description: 'Titill á reit fyrir frádrátt',
  },
  sectionDeductionsDescription: {
    id: 'web.rsk.calculator:sectionDeductionsDescription',
    defaultMessage: 'Liðir sem dregnir eru frá launum fyrir útborgun.',
    description: 'Lýsing á reit fyrir frádrátt',
  },
  sectionEmployerPaymentsTitle: {
    id: 'web.rsk.calculator:sectionEmployerPaymentsTitle',
    defaultMessage: 'Aðrar greiðslur launagreiðanda',
    description: 'Titill á reit fyrir aðrar greiðslur launagreiðanda',
  },
  sectionEmployerPaymentsDescription: {
    id: 'web.rsk.calculator:sectionEmployerPaymentsDescription',
    defaultMessage:
      'Mótframlag launagreiðana í lífeyrissjóð, ökutækjastyrkur utan staðgreiðslu og iðgjöld slysatrygginga.',
    description: 'Lýsing á reit fyrir aðrar greiðslur launagreiðanda',
  },
  calculate: {
    id: 'web.rsk.calculator:calculate',
    defaultMessage: 'Reikna',
    description: 'Texti á takka til að reikna',
  },
  results: {
    id: 'web.rsk.calculator:results',
    defaultMessage: 'Niðurstöður',
    description: 'Titill á niðurstöðum',
  },
  yes: {
    id: 'web.rsk.calculator:yes',
    defaultMessage: 'Já',
    description: 'Já valkostur fyrir já/nei reit',
  },
  no: {
    id: 'web.rsk.calculator:no',
    defaultMessage: 'Nei',
    description: 'Nei valkostur fyrir já/nei reit',
  },
  selectPlaceholder: {
    id: 'web.rsk.calculator:selectPlaceholder',
    defaultMessage: 'Veldu',
    description: 'Placeholder fyrir val-reiti',
  },
  errorOccurredTitle: {
    id: 'web.rsk.calculator:errorOccurredTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Titill þegar villa kemur upp',
  },
  errorOccurredMessage: {
    id: 'web.rsk.calculator:errorOccurredMessage',
    defaultMessage: 'Ekki tókst að sækja niðurstöður',
    description: 'Skilaboð þegar villa kemur upp',
  },
  fieldsErrorMessage: {
    id: 'web.rsk.calculator:fieldsErrorMessage',
    defaultMessage: 'Ekki tókst að sækja reiknivél',
    description: 'Skilaboð þegar ekki tekst að sækja form reiknivélar',
  },
})
