import { defineMessages } from 'react-intl'

export const indictmentsCaseFilesAccordionItem = defineMessages({
  title: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.title',
    defaultMessage: 'Gögn úr LÖKE máli {policeCaseNumber}',
    description:
      'Notaður sem titill á fellilista í skjalaskrá skrefi í ákærum.',
  },
  explanation: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.explanation',
    defaultMessage:
      'Færðu hvert skjal undir réttan kafla í skjalaskránni og gefðu því lýsandi heiti.',
    description:
      'Notaður sem texti í fellilista í skjalaskrá skrefi í ákærum sem útskýrir hvernig gagnapakkinn virkar.',
  },
  unorderedFilesTitle: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.unordered_files_title',
    defaultMessage: 'Óflokkuð gögn',
    description:
      'Notaður sem titill fyrir óflokkuð gögn í skjalaskrá skrefi í ákærum.',
  },
  unorderedFilesExplanation: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.unordered_files_explanation',
    defaultMessage: 'Dragðu hvert skjal hér fyrir neðan undir réttan kafla',
    description:
      'Notaður sem útskýringartexti fyrir óflokkuð gögn í skjalaskrá skrefi í ákærum.',
  },
  noCaseFiles: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.no_case_files',
    defaultMessage: 'Engin óflokkuð gögn',
    description:
      'Notaður sem texti í fellilista í skjalaskrá skrefi í ákærum þegar engin skjöl eru hengd við LÖKE númer.',
  },
  chapterIndictmentAndAccompanyingDocuments: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.chapter_indictment_and_accompanying_documents',
    defaultMessage: 'Kæra og fylgiskjöl',
    description:
      'Notaður sem titill á kafla í fellilista í skjalaskrá skrefi í ákærum.',
  },
  chapterInvesitgationProcess: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.chapter_invesitgation_process',
    defaultMessage: 'Rannsóknartilvik',
    description:
      'Notaður sem titill á kafla í fellilista í skjalaskrá skrefi í ákærum.',
  },
  chapterWitnesses: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.chapter_witnesses',
    defaultMessage: 'Vitni',
    description:
      'Notaður sem titill á kafla í fellilista í skjalaskrá skrefi í ákærum.',
  },
  chapterDefendant: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.chapter_defendant',
    defaultMessage: 'Sakborningur',
    description:
      'Notaður sem titill á kafla í fellilista í skjalaskrá skrefi í ákærum.',
  },
  chapterCaseFiles: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.chapter_case_files',
    defaultMessage: 'Réttarfarsgögn',
    description:
      'Notaður sem titill á kafla í fellilista í skjalaskrá skrefi í ákærum.',
  },
  chapterElectronicDocuments: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.chapter_electronic_documents',
    defaultMessage: 'Rafræn gögn',
    description:
      'Notaður sem titill á kafla í fellilista í skjalaskrá skrefi í ákærum.',
  },
  simpleInputPlaceholder: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.simple_input_placeholder',
    defaultMessage: 'Skráðu inn heiti á skjali',
    description:
      'Notaður sem skýritexti í textasvæði reit til að breyta heiti skjals.',
  },
  invalidDateErrorMessage: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.invalid_date_error_message',
    defaultMessage:
      'Ekki tókst að uppfæra skjal, dagsetning er ekki á réttu formi',
    description:
      'Notaður sem villuboð þegar tekst ekki að uppfæra dagsetningu á skjali.',
  },
  renameFailedErrorMessage: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.rename_failed_error_message',
    defaultMessage: 'Ekki tókst að endurnefna skjal',
    description: 'Notaður sem villuboð þegar endurnefning á skjali mistókst.',
  },
  reorderFailedErrorMessage: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.reorder_failed_error_message',
    defaultMessage: 'Ekki tókst að endurraða skjölum',
    description: 'Notaður sem villuboð þegar endurröðun á skjölum mistókst.',
  },
  removeFailedErrorMessage: {
    id: 'judicial.system.core:indictments_case_files_accordion_item.remove_failed_error_message',
    defaultMessage: 'Ekki tókst að eyða skjali',
    description: 'Notaður sem villuboð þegar eyða skjali mistókst.',
  },
})
