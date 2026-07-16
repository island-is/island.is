import { defineMessages } from 'react-intl'

export const m = {
  form: defineMessages({
    topDescription: {
      id: 'web.ecoi.calculator:form.topDescription#markdown',
      defaultMessage: 'Merktu við einn valkost fyrir hverja spurningu.',
      description: 'Texti fyrir ofan spurningalista',
    },
    previousStep: {
      id: 'web.ecoi.calculator:form.previousStep',
      defaultMessage: 'Fyrra skref',
      description: 'Fyrra skref',
    },
    nextStep: {
      id: 'web.ecoi.calculator:form.nextStep',
      defaultMessage: 'Næsta skref',
      description: 'Næsta skref',
    },
    seeResults: {
      id: 'web.ecoi.calculator:form.seeResults',
      defaultMessage: 'Senda inn svör',
      description: 'Senda inn svör',
    },
    progress: {
      id: 'web.ecoi.calculator:form.progress',
      defaultMessage: 'Skref {stepIndex} af {stepCount}',
      description: 'Skref {stepIndex} af {stepCount}',
    },
  }),
  answerLabel: defineMessages({
    '0': {
      id: 'web.ecoi.calculator:form.answerLabel0',
      defaultMessage: 'Nei',
      description: 'Nei',
    },
    '1': {
      id: 'web.ecoi.calculator:form.answerLabel1',
      defaultMessage: 'Í vinnslu',
      description: 'Í vinnslu',
    },
    '2': {
      id: 'web.ecoi.calculator:form.answerLabel2',
      defaultMessage: 'Í innleiðingu',
      description: 'Í innleiðingu',
    },
    '3': {
      id: 'web.ecoi.calculator:form.answerLabel3',
      defaultMessage: 'Já',
      description: 'Já',
    },
  }),
  results: defineMessages({
    topDescription: {
      id: 'web.ecoi.calculator:results.topDescription#markdown',
      defaultMessage: '',
      description: 'Texti fyrir ofan niðurstöðuskjá',
    },
    mainHeading: {
      id: 'web.ecoi.calculator:results.mainHeading',
      defaultMessage: 'Niðurstaða',
      description: 'Niðurstaða',
    },
    print: {
      id: 'web.ecoi.calculator:results.print',
      defaultMessage: 'Prenta',
      description: 'Prenta',
    },
    breakdownHeading: {
      id: 'web.ecoi.calculator:results.breakdownHeading',
      defaultMessage: 'Sundurliðun á niðurstöðum',
      description: 'Sundurliðun á niðurstöðum',
    },
    tableCategory: {
      id: 'web.ecoi.calculator:results.tableCategory',
      defaultMessage: 'Flokkur',
      description: 'Flokkur',
    },
    tableAverage: {
      id: 'web.ecoi.calculator:results.tableAverage',
      defaultMessage: 'Niðurstaða sjálfsmats',
      description: 'Niðurstaða sjálfsmats',
    },
    totalAverage: {
      id: 'web.ecoi.calculator:results.totalAverage',
      defaultMessage:
        'Heildarmat aðila á netöryggi (meðaltal af mati allra flokka)',
      description:
        'Heildarmat aðila á netöryggi (meðaltal af mati allra flokka)',
    },
    interpretationHeading: {
      id: 'web.ecoi.calculator:results.interpretationHeading',
      defaultMessage: 'Túlkun',
      description: 'Túlkun',
    },
    bracket4Text: {
      id: 'web.ecoi.calculator:results.bracket4Text',
      defaultMessage: 'Vísbendingar um góða hlítni',
      description: '2,6-3,0',
    },
    bracket3Text: {
      id: 'web.ecoi.calculator:results.bracket3Text',
      defaultMessage: 'Vísbendingar um hlítni',
      description: '1,8-2,5',
    },
    bracket2Text: {
      id: 'web.ecoi.calculator:results.bracket2Text',
      defaultMessage: 'Vísbendingar um að nokkuð vanti upp á hlítni',
      description: '1,2-1,7',
    },
    bracket1Text: {
      id: 'web.ecoi.calculator:results.bracket1Text',
      defaultMessage: 'Vísbendingar um að verulega vanti upp á hlítni',
      description: '0-1,1',
    },
  }),
}
