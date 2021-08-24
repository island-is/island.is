import { defineMessages } from 'react-intl'

export const courtAction = defineMessages({
  title: {
    id: 'ctao.application:courtAction.title',
    defaultMessage: 'Hefur málið verið lagt fyrir dómstóla?',
    description: 'Title of the court action section',
  },
  description: {
    id: 'ctao.application:courtAction.description',
    defaultMessage: `Starfssvið umboðsmanns Alþingis tekur hvorki til starfa dómstóla né ákvarðana 
		sem lög gera ráð fyrir að menn leiti leiðréttingar með málskoti til dómstóla.
		Ef málið hefur verið lagt fyrir dómstóla er líklegt að umboðsmaður geti ekki tekið það til skoðunar.`,
    description: 'Description of the court action section',
  },
})
