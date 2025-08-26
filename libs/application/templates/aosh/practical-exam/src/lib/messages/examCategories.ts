import { defineMessages } from 'react-intl'

export const examCategories = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.pe.application:examCategories.general.pageTitle',
      defaultMessage: 'Prófflokkar',
      description: `Exam categories's page title`,
    },
    pageDescription: {
      id: 'aosh.pe.application:examCategories.general.pageDescription',
      defaultMessage:
        'Hér eru þeir vélaflokkar sem einstaklingur er með bókleg réttindi á og má fara í verklegt próf. Fyrir aðra vélaflokka þarf að standast bókleg námskeið.',
      description: `Exam categories's page description`,
    },
    sectionTitle: {
      id: 'aosh.pe.application:examCategories.general.sectionTitle',
      defaultMessage: 'Prófflokkar',
      description: `Exam categories's section title`,
    },
  }),
  fileUpload: defineMessages({
    downloadButton: {
      id: 'aosh.pe.application:examCategories.fileUpload.downloadButton',
      defaultMessage: 'Hlaða inn læknisvottorði',
      description: `Button label for downloading medical certificate`,
    },
    title: {
      id: 'aosh.pe.application:examCategories.fileUpload.title',
      defaultMessage: 'Skrá læknisvottorð vegna prófflokka {value}',
      description: `Title for downloading medical certificate`,
    },
    description: {
      id: 'aosh.pe.application:examCategories.fileUpload.description',
      defaultMessage:
        'Eingöngu er tekið við skjölum með endingunum: .pdf., jpg., jpeg., png. ',
      description: `Title for downloading medical certificate`,
    },
    error: {
      id: 'aosh.pe.application:examCategories.fileUpload.error',
      defaultMessage: 'Eitthvað fór úrskeiðis að hlaða inn skjali',
      description: `Warning when there is an error uploading a file`,
    },
  }),
  labels: defineMessages({
    examCategoryLabel: {
      id: 'aosh.pe.application:examCategories.labels.examCategoryLabel',
      defaultMessage: 'Prófflokkar',
      description: `exam catagory label`,
    },
    examCategoryPlaceholder: {
      id: 'aosh.pe.application:examCategories.labels.examCategoryPlaceholder',
      defaultMessage: 'Velja leiðbeinanda',
      description: `exam catagory placeholder`,
    },
    categoryTableColumn: {
      id: 'aosh.pe.application:examCategories.labels.categoryTableColumn',
      defaultMessage: 'Prófflokkar',
      description: `exam catagory label for table`,
    },
    saveButton: {
      id: 'aosh.pe.application:examCategories.labels.saveButton',
      defaultMessage: 'Vista og skrá',
      description: `Save button on examCategories screen`,
    },
    includedCategoriesAlertInfoTitle: {
      id: 'aosh.pe.application:examCategories.labels.includedCategoriesAlertInfoTitle',
      defaultMessage: 'Prófflokkar',
      description: `Title for the alert info for included categories`,
    },
    includedCategoriesAlertInfoMessage: {
      id: 'aosh.pe.application:examCategories.labels.includedCategoriesAlertInfoMessage',
      defaultMessage: 'Útskýring á flokkum sem innihalda aðra flokka',
      description: `included categories info message`,
    },
    inputErrorTitle: {
      id: 'aosh.pe.application:examCategories.labels.inputErrorTitle',
      defaultMessage: 'Villa að vista prófflokka',
      description: `Error saving exam categories (no input for example) title`,
    },
    inputErrorMessage: {
      id: 'aosh.pe.application:examCategories.labels.inputErrorMessage',
      defaultMessage:
        'Vinsamlega sláðu inn leiðbeinanda fyrir hvern prófflokk, ef ekki er hægt að velja leiðbeinanda er engin leiðbeinandi gjaldgengur fyrir prófflokki',
      description: `Error saving exam categories (no input for example) message`,
    },
    invalidValidationTitle: {
      id: 'aosh.pe.application:examCategories.labels.invalidValidationTitle',
      defaultMessage: 'Próftaki ekki gjaldgengur í valin verkleg próf',
      description: `Error validating exam categories for examinee`,
    },
    webServiceFailureTitle: {
      id: 'aosh.pe.application:examCategories.labels.webServiceFailureTitle',
      defaultMessage: 'Óvænt villa í vefþjónustu',
      description: `Error validating exam categories for examinee`,
    },
    webServiceFailureMessage: {
      id: 'aosh.pe.application:examCategories.labels.webServiceFailureMessage',
      defaultMessage:
        'Vefþjónustan skilaði villu. Reyndu aftur síðar. Ef vandamálið varir, vinsamlegast hafðu samband við Vinnueftirlitið.',
      description: `Error validating exam categories for examinee`,
    },
    missingFileUploadTitle: {
      id: 'aosh.pe.application:examCategories.labels.missingFileUploadTitle',
      defaultMessage: 'Villa vegna læknisvottorðs',
      description: `Error missing file upload title`,
    },
    missingFileUploadMessage: {
      id: 'aosh.pe.application:examCategories.labels.missingFileUploadMessage',
      defaultMessage:
        'Vantar að hlaða upp læknisvottorði, eða það hefur mistekist, vinsamlegas reyndu aftur',
      description: `Error missing file upload message`,
    },
    chooseExamCategory: {
      id: 'aosh.pe.application:examCategories.labels.chooseExamCategory',
      defaultMessage: 'Veldu prófflokka',
      description: `Choose exam category label`,
    },
  }),
}
