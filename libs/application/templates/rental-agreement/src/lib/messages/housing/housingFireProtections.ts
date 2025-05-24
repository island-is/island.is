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
      'Nauðsynlegt er að hafa að minnsta kosti **1 CE merktan reykskynjara** á hverja 80m2 og **1 slökkvitæki** í eigninni.',
    description: 'Smoke detector and fire extinguisher requirements',
  },
  smokeDetectorsLabel: {
    id: 'ra.application:housingFireProtections.smokeDetectorsLabel',
    defaultMessage: 'Reykskynjari',
    description: 'Smoke dectectors label',
  },
  fireExtinguisherLabel: {
    id: 'ra.application:housingFireProtections.fireExtinguisherLabel',
    defaultMessage: 'Slökkvitæki',
    description: 'Fire extinguisher label',
  },
  exitFireBlanketRequirements: {
    id: 'ra.application:housingFireProtections.exitFireBlanketRequirements',
    defaultMessage:
      'Flóttaleiðir þurfa að vera auðrataðar og greiðfærar en ekki er gerð krafa um eldvarnarteppi.',
    description: 'Smoke detector and fire blanket requirements',
  },
  exitsTitle: {
    id: 'ra.application:housingFireProtections.exitsTitle',
    defaultMessage: 'Flóttaleiðir',
    description: 'Exits title',
  },
  exitsLabel: {
    id: 'ra.application:housingFireProtections.exitsLabel',
    defaultMessage: 'Já, það er amk 1 flóttaleið',
    description: 'Exits label',
  },
  fireBlanketLabel: {
    id: 'ra.application:housingFireProtections.fireBlanketLabel',
    defaultMessage: 'Eldvarnarteppi',
    description: 'Fire blanket label',
  },

  // dataSchema
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
  emergencyExitNullError: {
    id: 'ra.application:housingFireProtections.emergencyExitNullError',
    defaultMessage: 'Það þarf að vera a.m.k. ein flóttaleið úr eigninni',
    description: 'Emergency exit 0 error',
  },
})
