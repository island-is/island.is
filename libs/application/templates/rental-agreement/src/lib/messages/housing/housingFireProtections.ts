import { defineMessages } from 'react-intl'

export const housingFireProtections = defineMessages({
  subSectionName: {
    id: 'ra.application:housingFireProtections.subSectionName',
    defaultMessage: 'Brunavarnir',
    description: 'Fire protections sub section name',
  },
  pageTitle: {
    id: 'ra.application:housingFireProtections.pageTitle',
    defaultMessage: 'Staða brunavarna í húsnæðinu',
    description: 'Fire protections page title',
  },
  pageDescription: {
    id: 'ra.application:housingFireProtections.pageDescription',
    defaultMessage:
      'Leigusamningur þarf lögum samkvæmt að innihalda  úttekt á brunavörnum í húsnæðinu. Sú úttekt þarf að fara fram við samningsgerðina. Gott er að skoða húsnæðið gaumgæfilega út frá öryggismálum.',
    description: 'Fire protections page description',
  },
  smokeDetectorsFireExtinguisherRequirements: {
    id: 'ra.application:housingFireProtections.smokeDetectorsFireExtinguisherRequirements#markdown',
    defaultMessage:
      'Nauðsynlegt er að hafa að minnsta kosti **1 CE merktan reykskynjara** á hverja 80m2 og **1 slökkvitæki** í eigninni. Ekki er gerð krafa um eldvarnarteppi.',
    description: 'Smoke detector and fire extinguisher requirements',
  },
  smokeDetectorsLabel: {
    id: 'ra.application:housingFireProtections.smokeDetectorsLabel',
    defaultMessage: 'Reykskynjari',
    description: 'Smoke dectectors label',
  },
  smokeDetectorsAlertTitle: {
    id: 'ra.application:housingFireProtections.smokeDetectorsAlertTitle',
    defaultMessage: 'Húsnæðið ætti að hafa fleiri reykskynjara',
    description: 'Smoke detectors alert title',
  },
  smokeDetectorsAlertMessage: {
    id: 'ra.application:housingFireProtections.smokeDetectorsAlertMessage',
    defaultMessage:
      'Húsnæðið er {propertySize}m2 og ætti að hafa að minnsta kosti {requiredSmokeDetectors} reykskynjara',
    description: 'Smoke detectors alert message',
  },
  fireExtinguisherLabel: {
    id: 'ra.application:housingFireProtections.fireExtinguisherLabel',
    defaultMessage: 'Slökkvitæki',
    description: 'Fire extinguisher label',
  },
  fireExtinguisherAlertTitle: {
    id: 'ra.application:housingFireProtections.fireExtinguisherAlertTitle',
    defaultMessage: 'Húsnæðið ætti að hafa slökkvitæki',
    description: 'Fire extinguisher alert title',
  },
  fireExtinguisherAlertMessage: {
    id: 'ra.application:housingFireProtections.fireExtinguisherAlertMessage',
    defaultMessage: 'Húsnæðið ætti að hafa að minnsta kosti 1 slökkvitæki',
    description: 'Fire extinguisher alert message',
  },
  exitsLabel: {
    id: 'ra.application:housingFireProtections.exitsLabel',
    defaultMessage: 'Er flóttaleið til staðar?',
    description: 'Exits label',
  },
  exitRequirements: {
    id: 'ra.application:housingFireProtections.exitFireBlanketRequirements',
    defaultMessage: 'Flóttaleiðir þurfa að vera auðrataðar og greiðfærar.',
    description: 'Exit requirements',
  },
  fireBlanketLabel: {
    id: 'ra.application:housingFireProtections.fireBlanketLabel',
    defaultMessage: 'Eldvarnarteppi',
    description: 'Fire blanket label',
  },
  typeRadioYesExit: {
    id: 'ra.application:housingFireProtections.typeRadioYesExit',
    defaultMessage: 'Já',
    description: 'Label for yes - property has emergency exit',
  },
  typeRadioNoExit: {
    id: 'ra.application:housingFireProtections.typeRadioNoExit',
    defaultMessage: 'Nei',
    description: 'Label for no - property does not have an emergency exit',
  },
  fireBlanketRequirements: {
    id: 'ra.application:housingFireProtections.fireBlanketRequirements',
    defaultMessage: 'Er eldvarnarteppi til staðar?',
    description: 'Fire blanket requirements',
  },

  // dataSchema
  smokeDetectorNullError: {
    id: 'ra.application:housingFireProtections.smokeDetectorNullError',
    defaultMessage: 'Reykskynjara þarf að skrá',
    description: 'Smoke detectors 0 error',
  },
  smokeDetectorMinRequiredError: {
    id: 'ra.application:housingFireProtections.smokeDetectorMinRequiredError',
    defaultMessage: 'Reykskynjarar þurfa að vera a.m.k. 1 á hverja 80m2',
    description: 'Smoke detectors min 1 per 80 square meters',
  },
  fireExtinguisherNullError: {
    id: 'ra.application:housingFireProtections.fireExtinguisherNullError',
    defaultMessage: 'Það þarf að vera a.m.k. eitt slökkvitæki í eigninni',
    description: 'Fire extinguisher 0 error',
  },
})
