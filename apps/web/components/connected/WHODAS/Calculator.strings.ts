import { defineMessages } from 'react-intl'

export const m = {
  form: defineMessages({
    previousStep: {
      id: 'web.whodas.calculator:form.previousStep',
      defaultMessage: 'Fyrra skref',
      description: 'Fyrra skref',
    },
    nextStep: {
      id: 'web.whodas.calculator:form.nextStep',
      defaultMessage: 'Næsta skref',
      description: 'Næsta skref',
    },
  }),
  answerLabel: defineMessages({
    '0': {
      id: 'web.whodas.calculator:form.answerLabel0',
      defaultMessage: 'Ekkert erfitt',
      description: 'Ekkert erfitt',
    },
    '1': {
      id: 'web.whodas.calculator:form.answerLabel1',
      defaultMessage: 'Svolítið erfitt',
      description: 'Svolítið erfitt',
    },
    '2': {
      id: 'web.whodas.calculator:form.answerLabel2',
      defaultMessage: 'Nokkuð erfitt',
      description: 'Nokkuð erfitt',
    },
    '3': {
      id: 'web.whodas.calculator:form.answerLabel3',
      defaultMessage: 'Talsvert erfitt',
      description: 'Talsvert erfitt',
    },
    '4': {
      id: 'web.whodas.calculator:form.answerLabel4',
      defaultMessage: 'Mjög erfitt eða gekk ekki',
      description: 'Mjög erfitt eða gekk ekki',
    },
  }),
  results: defineMessages({
    mainHeading: {
      id: 'web.whodas.calculator:form.mainHeading',
      defaultMessage: 'Niðurstaða mats á færni',
      description: 'Niðurstaða mats á færni',
    },
    print: {
      id: 'web.whodas.calculator:form.print',
      defaultMessage: 'Prenta',
      description: 'Prenta',
    },
    scoreHeading: {
      id: 'web.whodas.calculator:form.scoreHeading',
      defaultMessage: 'Heildarstig',
      description: 'Heildarstig',
    },
    firstBracketScoreText: {
      id: 'web.whodas.calculator:form.firstBracketScoreText',
      defaultMessage: '0 til 16,9 stig',
      description: 'Lítil skerðing á færni - "Score" texti',
    },
    secondBracketScoreText: {
      id: 'web.whodas.calculator:form.secondBracketScoreText',
      defaultMessage: '17 til 100 stig',
      description: 'Talsverð skerðing á færni - "Score" texti',
    },
    firstBracketInterpretationText: {
      id: 'web.whodas.calculator:form.firstBracketInterpretationText',
      defaultMessage: 'Lítil skerðing á færni',
      description: 'Lítil skerðing á færni - Túlkun',
    },
    secondBracketInterpretationText: {
      id: 'web.whodas.calculator:form.secondBracketInterpretationText',
      defaultMessage: 'Talsverð færniskerðing',
      description: 'Talsverð færniskerðing - Túlkun',
    },
    firstBracketAdviceText: {
      id: 'web.whodas.calculator:form.firstBracketAdviceText#markdown',
      defaultMessage: 'Mælum með að skoða hvað er í boði í þínu nærsamfélagi.',
      description: 'Lítil skerðing á færni - Ráð',
    },
    secondBracketAdviceText: {
      id: 'web.whodas.calculator:form.secondBracketAdviceText#markdown',
      defaultMessage: 'Vert er að sækja um heimaþjónustu í þínu sveitarfélagi.',
      description: 'Talsverð færniskerðing - Ráð',
    },
    interpretationHeading: {
      id: 'web.whodas.calculator:form.interpretationHeading',
      defaultMessage: 'Túlkun',
      description: 'Túlkun',
    },
    adviceHeading: {
      id: 'web.whodas.calculator:form.adviceHeading',
      defaultMessage: 'Ráðleggingar',
      description: 'Ráðleggingar',
    },
    breakdownHeading: {
      id: 'web.whodas.calculator:form.adviceHeading',
      defaultMessage: 'Sundurliðun á niðurstöðum',
      description: 'Sundurliðun á niðurstöðum',
    },
  }),
}
