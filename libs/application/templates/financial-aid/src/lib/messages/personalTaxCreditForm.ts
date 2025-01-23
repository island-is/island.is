import { defineMessages } from 'react-intl'

export const personalTaxCreditForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.personalTaxCreditForm.general.sectionTitle',
      defaultMessage: 'Persónuafsláttur',
      description: 'Student form section title',
    },
    pageTitle: {
      id: 'fa.application:section.personalTaxCreditForm.general.pageTitle',
      defaultMessage: 'Viltu nota persónuafslátt?',
      description: 'Student form page title',
    },
    descriptionTitle: {
      id: 'fa.application:section.personalTaxCreditForm.general.descriptionTitle',
      defaultMessage: 'Nánar um persónuafslátt',
      description: 'Student form description title',
    },
    description: {
      id: 'fa.application:section.personalTaxCreditForm.general.description#markdown',
      defaultMessage:
        '#####Persónuafsláttur er skattaafsláttur sem veittur er öllum einstaklingum eldri en 16 ára. Persónuafslætti má safna upp á milli mánaða og nýta síðar. Uppsafnaður persónuafsláttur sem ekki er nýttur innan árs fellur niður við lok þess.',
      description: 'Student form description of tax credit ',
    },
    recommendedChoice: {
      id: 'fa.application:section.personalTaxCreditForm.general.recommendedChoice',
      defaultMessage:
        'Langflestir sem fá fjárhagsaðstoð kjósa að nýta sér persónuafsláttinn. Almennt má segja að „Já“ sé besti kostur nema þú vitir sérstaklega um annað sem þú vilt nýta hann í.',
      description:
        'Student form recommend answer of wheter to use personal tax credit or not',
    },
  }),
  radioChoices: defineMessages({
    useTaxCredit: {
      id: 'fa.application:section.personalTaxCreditForm.radioChoices.useTaxCredit',
      defaultMessage: 'Já, nýta persónuafslátt',
      description: 'Student form radio button choice to use tax credit',
    },
    wontUseTaxCredit: {
      id: 'fa.application:section.personalTaxCreditForm.radioChoices.notToUseTaxCredit',
      defaultMessage: 'Nei, ekki nýta persónuafslátt',
      description: 'Student form radio button choice to not use tax credit',
    },
  }),
}
