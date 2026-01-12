import { defineMessages } from 'react-intl'

export const requirements = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:requirements.general.title',
      defaultMessage: 'Upplýsingar um innsendingar',
      description: 'Title of requirements form',
    },
    intro: {
      id: 'ojoi.application:requirements.general.intro',
      defaultMessage:
        'Þú ert að fara að senda mál til birtingar í Stjórnartíðindum. {br} Dómsmálaráðuneytið gefur út Stjórnartíðindi sem skiptast í A-, B- og C-deild. Birting í Stjórnartíðindum hefur réttaráhrif. Í Stjórnartíðindum skal birta öll lög, stjórnvaldsfyrirmæli og samninga við önnur ríki, svo og auglýsingar varðandi gildi þeirra, sbr. lög nr. 15/2005. {br} Á þínu svæði færð þú uppfærða yfirsýn yfir allar auglýsingar þínar, innsendar, í vinnslu og útgefnar. Auglýsendur fá rafrænan reikning á island.is vegna birtingarkostnaðar eftir hvern mánuð.',
      description: 'Description of requirements form',
    },
    section: {
      id: 'ojoi.application:requirements.general.section',
      defaultMessage: 'Upplýsingar',
      description: 'Title of requirements section',
    },
  }),
  buttons: defineMessages({
    overview: {
      id: 'ojoi.application:requirements.buttons.overview',
      defaultMessage: 'Yfirlit',
      description: 'Label for the overview button',
    },
  }),
  inputs: defineMessages({
    accept: {
      id: 'ojoi.application:requirements.inputs.accept',
      defaultMessage:
        'Ég skil ofangreindar upplýsingar og hef umboð til þess að senda inn mál til birtingar',
      description: 'Label for the accept input',
    },
  }),
}
