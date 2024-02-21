import { defineMessages } from 'react-intl'

export const requirements = {
  general: defineMessages({
    formTitle: {
      id: 'ojoi.application:requirements.general.formTitle',
      defaultMessage: 'Upplýsingar um innsendingar',
      description: 'Title of requirements form',
    },
    formIntro: {
      id: 'ojoi.application:requirements.general.formIntro',
      defaultMessage:
        'Þú ert að fara að senda mál til birtingar í Stjórnartíðindum. {br} Dómsmálaráðuneytið gefur út Stjórnartíðindi sem skiptast í A-, B- og C-deild. Birting í Stjórnartíðindum hefur réttaráhrif. Í Stjórnartíðindum skal birta öll lög, stjórnvaldsfyrirmæli og samninga við önnur ríki, svo og auglýsingar varðandi gildi þeirra, sbr. lög nr. 15/2005. {br} Á þínu svæði færð þú uppfærða yfirsýn yfir allar auglýsingar þínar, innsendar, í vinnslu og útgefnar. Auglýsendur fá rafrænan reikning á island.is vegna birtingarkostnaðar eftir hvern mánuð.',
      description: 'Description of requirements form',
    },
    sectionTitle: {
      id: 'ojoi.application:requirements.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of requirements section',
    },
  }),
  checkbox: defineMessages({
    label: {
      id: 'ojoi.application:requirements.checbox.label',
      defaultMessage:
        'Ég skil ofangreindar upplýsingar og hef leyfi til þess að senda inn mál til birtingar',
      description: 'Label for requirements checkbox',
    },
  }),
  button: defineMessages({
    label: {
      id: 'ojoi.application:requirements.button.label',
      defaultMessage: 'Yfirlit',
      description: 'Label for requirements overview button',
    },
  }),
}
