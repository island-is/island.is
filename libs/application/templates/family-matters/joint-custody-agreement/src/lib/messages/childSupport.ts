import { defineMessages } from 'react-intl'

// Child Support
export const childSupport = {
  general: defineMessages({
    sectionTitle: {
      id: 'jca.application:section.effect.childSupport.sectionTitle',
      defaultMessage: 'Meðlag',
      description: 'Child support section title',
    },
    pageTitle: {
      id: 'jca.application:section.effect.childSupport.pageTitle',
      defaultMessage: 'Hvaða áhrif hefur breytingin á meðlagsgreiðslur?',
      description: 'Child support page title',
    },
    description: {
      id: 'jca.application:section.effect.childSupport.description#markdown',
      defaultMessage:
        'Hluti af þessum samningi er nýtt samkomulag á milli foreldranna um meðlagsgreiðslur.\\n\\n####Lögheimilisforeldri á rétt á meðlagi frá hinu foreldrinu\\n\\nEf foreldrar fara sameiginlega með forsjá á foreldrið sem barn er með lögheimili rétt á meðlagi frá hinu foreldrinu. Ef annað foreldrið fer með forsjá ber hinu foreldrinu að greiða meðlag með barninu.\\n\\n####Semja þarf sérstaklega um aukið meðlag\\n\\nÍ samningnum sem foreldrar gera á Island.is er kveðið á um einfalt meðlag. Ef greitt er aukið meðlag og/eða foreldrar vilja semja sín á milli um slíkt þarf að gera sérstakan samning um meðlag og fá staðfestingu sýslumanns á honum.\\n\\nUpplýsingar um núverandi upphæð meðlags er að finna á medlag.is.\\n\\n####Lögheimilisforeldri ber ábyrgð á að innheimta meðlag\\n\\nForeldrar geta samið sín á milli um greiðslu meðlags samkvæmt nýjum samningi. Einnig er hægt að senda meðlag í innheimtu hjá Tryggingastofnun en það er gert með því að afhenda Tryggingastofnun samninginn eftir staðfestingu sýslumanns. Hægt er að gera það rafrænt á Mínum síðum hjá Tryggingastofnun.',
      description: 'Child support page description',
    },
  }),
  childBenefitCheckbox: defineMessages({
    label: {
      id: 'jca.application:section.effect.childSupport.label',
      defaultMessage: 'Samkomulag er á milli foreldra um meðlagsgreiðslur',
      description: 'Label for child benefit checkbox',
    },
  }),
}
