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
  invalidEmployer: {
    id: `pdpp.application:application.error.invalidEmployer`,
    defaultMessage: 'Ekki er hægt að velja þennan launagreiðanda',
    description: 'Invalid employer error message',
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
  noDebtsTitle: {
    id: `pdpp.application:error.noDebtsTitle`,
    defaultMessage: 'Engar ógreiddar kröfur',
    description: 'Error Modal: Debts title',
  },
  noDebtsSummary: {
    id: `pdpp.application:error.noDebtsSummary`,
    defaultMessage: `Engar ógreiddar kröfur fundust á þinni kennitölu sem hægt er að gera greiðsluáætlun um í sjálfsafgreiðslu.
        Vinsamlegast hafðu samband við innheimtumenn ríkissjóðs fyrir frekari upplýsingar.`,
    description: 'Error Modal: Debts summary',
  },
  noDebtsLinkOne: {
    id: `pdpp.application:error.noDebtsLinkOne`,
    defaultMessage: 'https://island.is/minarsidur/fjarmal/stada',
    description: 'Error Modal: Debts link one',
  },
  noDebtsLinkOneName: {
    id: `pdpp.application:error.noDebtsLinkOneName`,
    defaultMessage: 'Skoða fjármál á mínum síðum island.is',
    description: 'Error Modal: Debts name of link one',
  },
  paymentplanErrorTitle: {
    id: `pdpp.application:error.paymentplanError`,
    defaultMessage: 'Villa í greiðsluáætlun',
    description: 'Error Modal: Payment plan error',
  },
  maxDebtAmount: {
    id: `pdpp.application:error.maxDebtAmount`,
    defaultMessage: 'Heildarskuld er hærri en leyfilegt hámark',
    description: 'Error Modal: Max debt amount',
  },
  maxPaymentAmount: {
    id: `pdpp.application:error.maxPaymentAmount`,
    defaultMessage: 'Greiðsluupphæð er hærri en leyfilegt hámark',
    description: 'Error Modal: Max payment amount',
  },
  minPaymentAmount: {
    id: `pdpp.application:error.minPaymentAmount`,
    defaultMessage: 'Greiðsluupphæð er lægri en leyfilegt lágmark',
    description: 'Error Modal: Min payment amount',
  },
  maxCountMonth: {
    id: `pdpp.application:error.maxCountMonth`,
    defaultMessage: 'Fjöldi gjalddaga er meiri en leyfilegt hámark',
    description: 'Error Modal: Max count month',
  },
  totalAmountMismatch: {
    id: `pdpp.application:error.totalAmountMismatch`,
    defaultMessage: 'Heildarskuld passar ekki við greiðsluupphæð',
    description: 'Error Modal: Total amount mismatch',
  },
})
