import { defineMessages } from 'react-intl'

export const error = defineMessages({
  paymentMode: {
    id: `pdpp.application:application.error.paymentMode`,
    defaultMessage: 'Vinsamlegast veldu greiðsludreifingarleið',
    description: 'Choose payment mode',
  },
  nationalId: {
    id: `pdpp.application:application.error.nationalId`,
    defaultMessage: 'Kennitala þarf að vera gild',
    description: 'National ID error message',
  },
  nationalIdIsNotCompany: {
    id: `pdpp.application:application.error.nationalIdIsNotCompany`,
    defaultMessage: 'Ekkert fyrirtæki fannst á kennitölu',
    description: 'National ID is not a company error message',
  },
  invalidNationalIdTitle: {
    id: `pdpp.application:application.error.invalidNationalIdTitle`,
    defaultMessage: 'Ógild kennitala',
    description: 'National ID is invalid error message title',
  },
  invalidNationalIdMessage: {
    id: `pdpp.application:application.error.invalidNationalIdMessage`,
    defaultMessage: 'Vinsamlegast athugaðu hvort að rétt var slegið inn.',
    description: 'National ID is invalid error message',
  },
  noCompanyResultsTitle: {
    id: `pdpp.application:application.error.noCompanyResultsTitle`,
    defaultMessage: 'Engar niðurstöður fundust hjá fyrirtækjaskrá',
    description: 'No results found from company search error message title',
  },
  noCompanyResultsMessage: {
    id: `pdpp.application:application.error.noCompanyResultsMessage`,
    defaultMessage: 'Vinsamlegast athugaðu hvort að rétt var slegið inn.',
    description: 'No results found from company search error message title',
  },
})
