import { defineMessages } from 'react-intl'

export const m = defineMessages({
  present: {
    id: 'web.landspitaliMenu:present',
    defaultMessage: 'Inniheldur',
    description: 'Inniheldur',
  },
  absent: {
    id: 'web.landspitaliMenu:absent',
    defaultMessage: 'Gæti innihaldið',
    description: 'Gæti innihaldið',
  },
  'RDS kjöt/fiskur': {
    id: 'web.landspitaliMenu:rds-kjot-fiskur',
    defaultMessage: 'RDS kjöt/fiskur',
    description: 'RDS kjöt/fiskur',
  },
  'RDS grænmetisfæði': {
    id: 'web.landspitaliMenu:rds-graenmetisfaedi',
    defaultMessage: 'RDS grænmetisfæði',
    description: 'RDS grænmetisfæði',
  },
  A1: {
    id: 'web.landspitaliMenu:a1',
    defaultMessage: 'Almennt fæði (A1)',
    description: 'Almennt fæði (A1)',
  },
  A2: {
    id: 'web.landspitaliMenu:a2',
    defaultMessage: 'Hentar eldri kynslóðinni (A2)',
    description: 'Hentar eldri kynslóðinni (A2)',
  },
  'A2 - hentar eldri kynslóðinni': {
    id: 'web.landspitaliMenu:a2-hentar-eldri-kynslodinni',
    defaultMessage: 'Hentar eldri kynslóðinni (A2)',
    description: 'Hentar eldri kynslóðinni (A2)',
  },
  A3: {
    id: 'web.landspitaliMenu:a3',
    defaultMessage: 'Grænmetisfæði (A3)',
    description: 'Grænmetisfæði (A3)',
  },
  'A3 - grænmetisfæði': {
    id: 'web.landspitaliMenu:a3-graenmetisfaedi',
    defaultMessage: 'Grænmetisfæði (A3)',
    description: 'Grænmetisfæði (A3)',
  },
  A4: {
    id: 'web.landspitaliMenu:a4',
    defaultMessage: 'Hentar börnum (A4)',
    description: 'Hentar börnum (A4)',
  },
  'A4 - hentar börnum': {
    id: 'web.landspitaliMenu:a4-hentar-bornum',
    defaultMessage: 'Hentar börnum (A4)',
    description: 'Hentar börnum (A4)',
  },
  RDS1: {
    id: 'web.landspitaliMenu:rds1',
    defaultMessage: 'Fyrir fríska (RDS1)',
    description: 'Fyrir fríska (RDS1)',
  },
  RDS2: {
    id: 'web.landspitaliMenu:rds2',
    defaultMessage: 'Fyrir fríska (RDS2)',
    description: 'Fyrir fríska (RDS2)',
  },
  OP: {
    id: 'web.landspitaliMenu:op',
    defaultMessage: 'Orku og próteinþétt (OP)',
    description: 'Orku og próteinþétt (OP)',
  },
  seeMoreAboutCourse: {
    id: 'web.landspitaliMenu:seeMoreAboutCourse',
    defaultMessage: 'Nánari upplýsingar',
    description: 'Nánari upplýsingar',
  },
  hideMoreAboutCourse: {
    id: 'web.landspitaliMenu:hideMoreAboutCourse',
    defaultMessage: 'Fela upplýsingar',
    description: 'Fela upplýsingar',
  },
  todayPrefix: {
    id: 'web.landspitaliMenu:todayPrefix',
    defaultMessage: 'Í dag - ',
    description: 'Prefix for currently selected day',
  },
  nutritionTitle: {
    id: 'web.landspitaliMenu:nutritionTitle',
    defaultMessage: 'Næringargildi',
    description: 'Nutrition section title',
  },
  nutritionFallbackName: {
    id: 'web.landspitaliMenu:nutritionFallbackName',
    defaultMessage: 'Næring',
    description: 'Fallback nutrient name',
  },
  ingredientsTitle: {
    id: 'web.landspitaliMenu:ingredientsTitle',
    defaultMessage: 'Hráefni/Innihald',
    description: 'Ingredients section title',
  },
  co2Label: {
    id: 'web.landspitaliMenu:co2Label',
    defaultMessage: 'CO2: {value}',
    description: 'CO2 equivalents label',
  },
  noMenuPublished: {
    id: 'web.landspitaliMenu:noMenuPublished',
    defaultMessage: 'Ekki er búið að gefa út matseðilinn fyrir {date}.',
    description: 'Fallback text when no menu has been published',
  },
  errorFetchingMenu: {
    id: 'web.landspitaliMenu:errorFetchingMenu',
    defaultMessage:
      'Villa kom upp við að sækja matseðilinn. Reyndu aftur síðar.',
    description: 'Error message shown when fetching the menu fails',
  },
})
