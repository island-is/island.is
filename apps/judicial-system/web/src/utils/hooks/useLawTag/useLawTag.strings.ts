import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  lawsBrokenTag: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.laws_broken_tag',
    defaultMessage: '{paragraph}. mgr. {article}. gr. umfl.',
    description: 'Notaður sem texti í lagaákvæði taggi.',
  },
  lawsBrokenTagArticleOnly: {
    id: 'judicial.system.core:indictments_indictment.indictment_count.laws_broken_tag_article_only',
    defaultMessage: '{article}. gr. umfl.',
    description: 'Notaður sem texti í lagaákvæði taggi.',
  },
})
