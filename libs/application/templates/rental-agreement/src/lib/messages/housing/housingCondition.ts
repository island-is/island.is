import { defineMessages } from 'react-intl'

export const housingCondition = defineMessages({
  subSectionName: {
    id: 'ra.application:housingCondition.subSectionName',
    defaultMessage: 'Ástandsskoðun',
    description: 'Housing condition inspection sub section name',
  },
  pageTitle: {
    id: 'ra.application:housingCondition.pageTitle',
    defaultMessage: 'Ástand húsnæðis',
    description: 'Housing condition inspection page title',
  },
  pageDescription: {
    id: 'ra.application:housingCondition.pageDescription#markdown',
    defaultMessage:
      'Leigusamningur þarf lögum samkvæmt að innihalda ástandsúttekt á húsnæðinu. Sú úttekt þarf að fara fram við samningsgerðina. Gott er að skoða húsnæðið gaumgæfilega og taka myndir af ástandi. [Sjá nánar hér](https://island.is/skraning-leigusamnings-i-leiguskra#astandsuttekt-og-brunauttekt).',
    description: 'Housing condition inspection page description',
  },
  inspectorTitle: {
    id: 'ra.application:housingCondition.inspectorTitle',
    defaultMessage: 'Framkvæmdaraðili ástandsskoðunar',
    description: 'Housing condition inspector title',
  },
  inspectorDescription: {
    id: 'ra.application:housingCondition.inspectorDescription',
    defaultMessage:
      'Athugið að aðilar geta sjálfir gert ástandsúttekt eða fengið óháðan aðila til þess og þá skiptist kostnaðurinn við það jafnt á milli aðila.',
    description: 'Housing condition inspector description',
  },
  inspectorOptionContractParties: {
    id: 'ra.application:housingCondition.inspectorOptionContractParties',
    defaultMessage: 'Samningsaðilar',
    description: 'Housing condition inspector option contract parties',
  },
  inspectorOptionIndependentParty: {
    id: 'ra.application:housingCondition.inspectorOptionIndependentParty',
    defaultMessage: 'Óháður aðili',
    description: 'Housing condition inspector option independent party',
  },
  independentInspectorNamePlaceholder: {
    id: 'ra.application:housingCondition.independentInspectorNamePlaceholder',
    defaultMessage: 'Skrifaðu hér fullt nafn óháðs aðila',
    description: 'Housing condition independent inspector name placeholder',
  },
  inspectionResultsTitle: {
    id: 'ra.application:housingCondition.inspectionResultsTitle',
    defaultMessage: 'Niðurstöður ástandsúttektar',
    description: 'Housing condition inspection results title',
  },
  inspectionResultsDescription: {
    id: 'ra.application:housingCondition.inspectionResultsDescription',
    defaultMessage:
      'Hér á að setja inn helstu niðurstöður ástandsúttektar. Gott er að taka myndir af þeim atriðum sem skipta máli. Ef óháður aðili hefur framkvæmt úttektina má setja niðurstöðurnar með sem fylgiskjal.',
    description: 'Housing condition inspection results description',
  },
  inspectionResultsInputLabel: {
    id: 'ra.application:housingCondition.inspectionResultsInputLabel',
    defaultMessage: 'Ástandsúttekt',
    description: 'Housing condition inspection results input label',
  },
  inspectionResultsInputPlaceholder: {
    id: 'ra.application:housingCondition.inspectionResultsInputPlaceholder',
    defaultMessage: 'Skrifaðu hér allt sem á við',
    description: 'Housing condition inspection results placeholder',
  },
  fileUploadTitle: {
    id: 'ra.application:housingCondition.fileUploadTitle',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description: 'Housing condition file upload title',
  },
  fileUploadDescription: {
    id: 'ra.application:housingCondition.fileUploadDescription#markdown',
    defaultMessage:
      'Tekið er við skjölum með endingu: \n.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
    description: 'Housing condition file upload description',
  },

  // Error messages
  inspectorNameRequired: {
    id: 'ra.application:housingCondition.inspectorNameRequired',
    defaultMessage: 'Fullt nafn óháðs aðila þarf að vera til staðar',
    description: 'Housing condition inspector name required',
  },
  inspectionResultsRequired: {
    id: 'ra.application:housingCondition.inspectionResultsRequired',
    defaultMessage: 'Lýsing ástandsúttektar eða skjöl þurfa að vera til staðar',
    description: 'Housing condition inspection results required',
  },
})
