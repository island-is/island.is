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
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
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
  }),
}
