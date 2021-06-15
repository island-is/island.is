import { defineMessages, defineMessage } from 'react-intl'

// Legal Residence
export const selectLegalResidence = {
  general: defineMessages({
    sectionTitle: {
      id:
        'jca.application:section.arrangement.selectLegalResidence.sectionTitle',
      defaultMessage: 'Lögheimili',
      description: 'Legal residence section title',
    },
    pageTitle: {
      id: 'jca.application:section.arrangement.selectLegalResidence.pageTitle',
      defaultMessage: 'Hjá hvoru foreldrinu verður lögheimilið?',
      description: 'Legal residence page title',
    },
    description: {
      id:
        'jca.application:section.arrangement.selectLegalResidence.description#markdown',
      defaultMessage:
        'Þó að foreldrar fari sameiginlega með forsjá barna sinna geta börnin aðeins átt eitt lögheimili. Ákveða þarf hjá hvoru foreldrinu það á að vera.\\n\\nLitið er svo á að barn hafi að jafnaði fasta búsetu hjá því foreldri þar sem það á lögheimili. Margvísleg áhrif fylgja skráningu lögheimilis hjá foreldri, meðal annars á meðlag og barnabætur, auk þess sem lögheimilisforeldri hefur meiri heimildir til að taka afgerandi ákvarðanir um daglegt líf barnsins.',
      description: 'Legal residence page description',
    },
  }),
  inputs: defineMessage({
    label: {
      id:
        'jca.application:section.arrangement.selectLegalResidence.inputs.label',
      defaultMessage: 'Lögheimilisforeldri verður',
      description: 'Label for legal residence',
    },
  }),
}
