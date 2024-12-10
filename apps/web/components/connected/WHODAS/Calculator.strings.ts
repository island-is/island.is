import { defineMessages } from 'react-intl'

export const m = {
  form: defineMessages({
    topDescription: {
      id: 'web.whodas.calculator:form.topDescription#markdown',
      defaultMessage: 'Merktu við einn valkost fyrir hverja spurningu.',
      description: 'Texti fyrir ofan spurningalista',
    },
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
    seeResults: {
      id: 'web.whodas.calculator:form.seeResults',
      defaultMessage: 'Senda inn svör',
      description: 'Senda inn svör',
    },
    progress: {
      id: 'web.whodas.calculator:form.progress',
      defaultMessage: 'Skref {stepIndex} af {stepCount}',
      description: 'Skref {stepIndex} af {stepCount}',
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
    topDescription: {
      id: 'web.whodas.calculator:results.topDescription#markdown',
      defaultMessage:
        'Takk fyrir að svara spurningalistanum, Mat á færni þinni. Mat þitt á færni er stuðningur við að meta þörf þína fyrir heimaþjónustu. Ef þú hefur ekki svarað öllum spurningum getur það haft áhrif á niðurstöðuna.',
      description: 'Texti fyrir ofan niðurstöðuskjá',
    },
    resultDisclaimer: {
      id: 'web.whodas.calculator:results.resultDisclaimer',
      defaultMessage:
        'Gott er að prenta út eða senda sér svarið. Það getur gangast við umsókn um heimaþjónustu.',
      description:
        'Gott er að prenta út eða senda sér svarið. Það getur gangast við umsókn um heimaþjónustu.',
    },
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
      id: 'web.whodas.calculator:form.breakdownHeading',
      defaultMessage: 'Sundurliðun á niðurstöðum',
      description: 'Sundurliðun á niðurstöðum',
    },
    outOf100: {
      id: 'web.whodas.calculator:results.outOf100',
      defaultMessage: 'af 100',
      description: 'af 100',
    },
  }),
}
