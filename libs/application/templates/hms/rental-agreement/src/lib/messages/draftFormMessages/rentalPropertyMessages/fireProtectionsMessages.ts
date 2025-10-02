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
  smokeDetectorsFireExtinguisherTitle: {
    id: 'ra.application:housingFireProtections.smokeDetectorsFireExtinguisherTitle',
    defaultMessage: 'Reikskynjarar og slökkvitæki',
    description: 'Smoke detectors and fire extinguisher title',
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
  fireExtinguisherAlertTitle: {
    id: 'ra.application:housingFireProtections.fireExtinguisherAlertTitle',
    defaultMessage: 'Húsnæðið ætti að hafa slökkvitæki',
    description: 'Fire extinguisher alert title',
  },
  fireExtinguisherAlertMessage: {
    id: 'ra.application:housingFireProtections.fireExtinguisherAlertMessage',
    defaultMessage: 'Leiguhúsnæði ættu að hafa að minnsta kosti 1 slökkvitæki',
    description: 'Fire extinguisher alert message',
  },
  fireExtinguisherLabel: {
    id: 'ra.application:housingFireProtections.fireExtinguisherLabel',
    defaultMessage: 'Slökkvitæki',
    description: 'Fire extinguisher label',
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
  fireBlanketRequirements: {
    id: 'ra.application:housingFireProtections.fireBlanketRequirements',
    defaultMessage: 'Er eldvarnarteppi til staðar?',
    description: 'Fire blanket requirements',
  },
  eldklarMessage: {
    id: 'ra.application:housingFireProtections.eldklarMessage#markdown',
    defaultMessage:
      'Ítarefni um brunavarnir má finna á heimasíðu [Eldklár](https://www.vertueldklar.is/)',
    description: 'Eldklar message',
  },

  // dataSchema
  fireExtinguisherNullError: {
    id: 'ra.application:housingFireProtections.fireExtinguisherNullError',
    defaultMessage: 'Það þarf að vera a.m.k. eitt slökkvitæki í eigninni',
    description: 'Fire extinguisher 0 error',
  },
})
