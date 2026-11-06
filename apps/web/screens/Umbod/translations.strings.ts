import { defineMessages } from 'react-intl'

export const m = defineMessages({
  pageTitle: {
    id: 'web.electronicMandates:pageTitle',
    defaultMessage: 'Rafræn umboð',
    description: 'Titill á síðu rafrænna umboða',
  },
  introduction: {
    id: 'web.electronicMandates:introduction',
    defaultMessage: 'Smelltu á þjónustuaðila til að skoða umboð hans.',
    description: 'Inngangstexti á síðu rafrænna umboða',
  },
  searchLabel: {
    id: 'web.electronicMandates:searchLabel',
    defaultMessage: 'Leita eftir nafni eða kennitölu stofnunar',
    description: 'Merking og vísbending í leit að þjónustuaðila',
  },
  noServiceProviders: {
    id: 'web.electronicMandates:noServiceProviders',
    defaultMessage: 'Engir þjónustuaðilar fundust.',
    description: 'Skilaboð þegar leit skilar engum þjónustuaðilum',
  },
  loadServiceProvidersError: {
    id: 'web.electronicMandates:loadServiceProvidersError',
    defaultMessage: 'Ekki tókst að sækja þjónustuaðila.',
    description: 'Villuskilaboð þegar ekki tekst að sækja þjónustuaðila',
  },
  loadMandatesError: {
    id: 'web.electronicMandates:loadMandatesError',
    defaultMessage: 'Ekki tókst að sækja umboð.',
    description: 'Villuskilaboð þegar ekki tekst að sækja umboð',
  },
  noMandates: {
    id: 'web.electronicMandates:noMandates',
    defaultMessage: 'Engin umboð fundust.',
    description: 'Skilaboð þegar þjónustuaðili er ekki með umboð',
  },
  mandateName: {
    id: 'web.electronicMandates:mandateName',
    defaultMessage: 'Heiti umboðs',
    description: 'Dálkafyrirsögn fyrir heiti umboðs',
  },
  description: {
    id: 'web.electronicMandates:description',
    defaultMessage: 'Lýsing',
    description: 'Dálkafyrirsögn fyrir lýsingu umboðs',
  },
})
