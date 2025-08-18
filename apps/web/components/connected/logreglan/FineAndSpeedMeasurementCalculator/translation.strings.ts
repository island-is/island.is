import { defineMessages } from 'react-intl'

export const m = {
  fines: defineMessages({
    heading: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:fines.heading',
      defaultMessage: 'Umferðarlagabrot',
      description: 'Umferðarlagabrot',
    },
    total: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:fines.total',
      defaultMessage: 'Samtals',
      description: 'Samtals',
    },
    inputPlaceholder: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:fines.inputPlaceholder',
      defaultMessage: 'Leitaðu að sekt',
      description: 'Placeholder fyrir inntak',
    },
    pointsPrefix: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:fines.pointsPrefix',
      defaultMessage: 'Punktar: ',
      description: 'Punktar: ',
    },
    pointsPostfixPlural: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:fines.pointsPostfixPlural',
      defaultMessage: ' punktar',
      description: ' punktar',
    },
    pointsPostfixSingular: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:fines.pointsPostfixSingular',
      defaultMessage: ' punktur',
      description: ' punktur',
    },
    countPostfix: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:fines.countPostfix',
      defaultMessage: ' brot',
      description: ' brot',
    },
    calculate: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:fines.calculate',
      defaultMessage: 'Sjá sundurliðun',
      description: 'Reikna',
    },
  }),
  results: defineMessages({
    heading: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.heading',
      defaultMessage: 'Sundurliðun',
      description: 'Sundurliðun',
    },
    goBack: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.goBack',
      defaultMessage: 'Sjá sektir',
      description: 'Sjá sektir',
    },
    itemHeading: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.itemHeading',
      defaultMessage: 'Atriði',
      description: 'Atriði',
    },
    fineHeading: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.fineHeading',
      defaultMessage: 'Sekt',
      description: 'Sekt',
    },
    quarterOfHeading: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.quarterOfHeading',
      defaultMessage: '25% af',
      description: '25% af',
    },
    pointsHeading: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.pointsHeading',
      defaultMessage: 'Punktar',
      description: 'Punktar',
    },
    total: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.total',
      defaultMessage: 'Samtals',
      description: 'Samtals',
    },
    jailTime: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.jailTime',
      defaultMessage: 'Vararefsing: {days} dagar',
      description: 'Vararefsing: {days} dagar',
    },
    speedMeasurementOverviewText: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.speedMeasurementOverviewText',
      defaultMessage:
        'Hraðasekt mældur hraði {measuredSpeed} km/klst, að mt.vikmörkum, {measuredSpeedMinusVikmork} km/klst á {speedLimit} svæði',
      description:
        'Hraðasekt mældur hraði {measuredSpeed} km/klst, að mt.vikmörkum, {measuredSpeedMinusVikmork} km/klst á {speedLimit} svæði',
    },
    speedMeasurementLaw: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.speedMeasurementLaw',
      defaultMessage: 'Grein 37 í umferðalögum',
      description: 'Grein 37 í umferðalögum',
    },
    speedMeasurementAkaera: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:results.speedMeasurementAkaera',
      defaultMessage: '(Ákært verður vegna brotsins)',
      description: 'Ákært verður vegna brotsins',
    },
  }),
  speedMeasurementCalculator: defineMessages({
    heading: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.heading',
      defaultMessage: 'Hraðamæling',
      description: 'Hraðamæling',
    },
    measuredSpeedInputLabel: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.measuredSpeedInputLabel',
      defaultMessage: 'Mældur hraði',
      description: 'Mældur hraði',
    },
    vikmorkInputLabel: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.vikmorkInputLabel',
      defaultMessage: 'Vikmörk',
      description: 'Vikmörk',
    },
    nidurstadaInputLabel: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.nidurstadaInputLabel',
      defaultMessage: 'Niðurstaða',
      description: 'Niðurstaða',
    },
    speedLimitSelectLabel: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.speedLimitSelectLabel',
      defaultMessage: 'Hámarkshraði',
      description: 'Hámarkshraði',
    },
    yes: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.yes',
      defaultMessage: 'Já',
      description: 'Já',
    },
    no: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.no',
      defaultMessage: 'Nei',
      description: 'Nei',
    },
    over3500kgOrWithTrailerLabel: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.over3500kgOrWithTrailerLabel',
      defaultMessage: 'Bifreiðar þyngri en 3500kg eða með eftirvagn?',
      description: 'Bifreiðar þyngri en 3500kg eða með eftirvagn?',
    },
    finePrefix: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.finePrefix',
      defaultMessage: 'Sekt: ',
      description: 'Sekt: ',
    },
    pointsPrefix: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.pointsPrefix',
      defaultMessage: 'Punktar: ',
      description: 'Punktar: ',
    },
    twentyPercentLoadPrefix: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.twentyPercentLoadPrefix',
      defaultMessage: '20% álag: ',
      description: '20% álag: ',
    },
    monthsOfDrivingLicenseLossPrefix: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.monthsOfDrivingLicenseLossPrefix',
      defaultMessage: 'Svipting ökuréttinda í: ',
      description: 'Svipting ökuréttinda í: ',
    },
    months: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.months',
      defaultMessage: 'mánuði',
      description: 'mánuði',
    },
    akaeraText: {
      id: 'web.logreglan.fineAndSpeedMeasurementCalculator:speedMeasurementCalculator.akaeraText',
      defaultMessage: 'Ákært verður vegna brotsins',
      description: 'Ákært verður vegna brotsins',
    },
  }),
}
