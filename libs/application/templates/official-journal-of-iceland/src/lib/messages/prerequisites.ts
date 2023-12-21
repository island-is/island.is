import { defineMessages } from 'react-intl'

export const prerequisites = {
  general: defineMessages({
    formTitle: {
      id: 'ojoi.application:prerequisites.general.title',
      defaultMessage: 'Upplýsingar um innsendingar',
      description: 'Title of prerequisites form',
    },
    formIntro: {
      id: 'ojoi.application:prerequisites.general.description',
      defaultMessage:
        'Þú ert að fara að senda mál til birtingar í Stjórnartíðindum. {br} Dómsmálaráðuneytið gefur út Stjórnartíðindi sem skiptast í A-, B- og C-deild. Birting í Stjórnartíðindum hefur réttaráhrif. Í Stjórnartíðindum skal birta öll lög, stjórnvaldsfyrirmæli og samninga við önnur ríki, svo og auglýsingar varðandi gildi þeirra, sbr. lög nr. 15/2005. {br} Á þínu svæði færð þú uppfærða yfirsýn yfir allar auglýsingar þínar, innsendar, í vinnslu og útgefnar. Auglýsendur fá rafrænan reikning á island.is vegna birtingarkostnaðar eftir hvern mánuð.',
      description: 'Description of prerequisites form',
    },
    sectionTitle: {
      id: 'ojoi.application:prerequisites.general.title',
      defaultMessage: 'Upplýsingar',
      description: 'Title of prerequisites section',
    },
  }),
  checkbox: defineMessages({
    label: {
      id: 'ojoi.application:prerequisites.checbox.label',
      defaultMessage:
        'Ég skil ofangreindar upplýsingar og hef leyfi til þess að senda inn mál til birtingar',
      description: 'Label for prerequisites checkbox',
    },
  }),
  button: defineMessages({
    label: {
      id: 'ojoi.application:prerequisites.button.label',
      defaultMessage: 'Yfirlit',
      description: 'Label for prerequisites overview button',
    },
  }),
}
