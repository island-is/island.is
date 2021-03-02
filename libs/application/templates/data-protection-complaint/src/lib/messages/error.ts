import { defineMessages } from 'react-intl'

// Error messages in the application
export const error = defineMessages({
  inCourtProceedings: {
    id: 'dpac.application:error.inCourtProceedings',
    defaultMessage: 'In court proceedings error message',
    description:
      'Error message when inCourtProceedings has been answered as yes',
  },
  concernsMediaCoverage: {
    id: 'dpac.application:error.concernsMediaCoverage',
    defaultMessage: 'concernsMediaCoverage message',
    description:
      'Error message when concernsMediaCoverage has been answered as yes',
  },
  concernsBanMarking: {
    id: 'dpac.application:error.concernsBanMarking',
    defaultMessage: 'concernsBanMarking message',
    description:
      'Error message when concernsBanMarking has been answered as yes',
  },
  concernsLibel: {
    id: 'dpac.application:error.concernsLibel',
    defaultMessage: 'concernsLibel message',
    description: 'Error message when concernsLibel has been answered as yes',
  },
  concernsPersonalLettersOrSocialMedia: {
    id: 'dpac.application:error.concernsPersonalLettersOrSocialMedia',
    defaultMessage: 'concernsPersonalLettersOrSocialMedia message',
    description:
      'Error message when concernsPersonalLettersOrSocialMedia has been answered as yes',
  },
})

export const errorCards = defineMessages({
  inCourtProceedingsTitle: {
    id: 'dpac.application:error.inCourtProceedings.card.title',
    defaultMessage:
      'Við tökum því miður ekki á málum sem eru í meðferð hjá dómstólum eða öðrum stjórnvöldum',
    description:
      'Shown in a card when inCourtProceedings has been answered as yes',
  },
  inCourtProceedingsDescription: {
    id: 'dpac.application:error.inCourtProceedings.card.description',
    defaultMessage:
      'Ef sama mál er til meðferðar hjá öðru stjórnvaldi eða dómstólum tekur Persónuvernd slík mál allajafna ekki til meðferðar fyrr en viðkomandi stjórnvald/dómstóll hefur lokið sinni málsmeðferð. Er þessi framkvæmd viðhöfð á grundvelli almennra reglna stjórnsýsluréttarins um meðalhóf.',
    description:
      'Shown in a card when inCourtProceedings has been answered as yes',
  },
  concernsMediaCoverageTitle: {
    id: 'dpac.application:error.concernsMediaCoverage.card.title',
    defaultMessage:
      'TODO: Við tökum því miður ekki á málum sem varða umfjöllun í fjölmiðlum',
    description:
      'Shown in a card when concernsMediaCoverage has been answered as yes',
  },
  concernsMediaCoverageDescription: {
    id: 'dpac.application:error.concernsMediaCoverage.card.description',
    defaultMessage:
      'Ef sama mál er til meðferðar hjá öðru stjórnvaldi eða dómstólum tekur Persónuvernd slík mál allajafna ekki til meðferðar fyrr en viðkomandi stjórnvald/dómstóll hefur lokið sinni málsmeðferð. Er þessi framkvæmd viðhöfð á grundvelli almennra reglna stjórnsýsluréttarins um meðalhóf.',
    description:
      'Shown in a card when concernsMediaCoverage has been answered as yes',
  },
})
