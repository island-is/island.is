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
  onBehalfOfACompany: {
    id: 'dpac.application:error.onBehalfOfACompany',
    defaultMessage: 'Hér er ekki hægt að senda inn kvörtun á vegum fyrirtækis',
    description: 'Error message when onBehalf has been answered as company',
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
  concernsBanMarkingTitle: {
    id: 'dpac.application:error.concernsBanMarking.card.title',
    defaultMessage:
      'TODO: Við tökum því miður ekki á málum sem varða bannmerkingu',
    description:
      'Shown in a card when concernsBanMarking has been answered as yes',
  },
  concernsBanMarkingDescription: {
    id: 'dpac.application:error.concernsBanMarking.card.description',
    defaultMessage:
      'Ef sama mál er til meðferðar hjá öðru stjórnvaldi eða dómstólum tekur Persónuvernd slík mál allajafna ekki til meðferðar fyrr en viðkomandi stjórnvald/dómstóll hefur lokið sinni málsmeðferð. Er þessi framkvæmd viðhöfð á grundvelli almennra reglna stjórnsýsluréttarins um meðalhóf.',
    description:
      'Shown in a card when concernsBanMarking has been answered as yes',
  },
  concernsLibelTitle: {
    id: 'dpac.application:error.concernsLibel.card.title',
    defaultMessage: 'TODO: Við tökum því miður ekki á málum sem varða meiðyrði',
    description: 'Shown in a card when concernsLibel has been answered as yes',
  },
  concernsLibelDescription: {
    id: 'dpac.application:error.concernsLibel.card.description',
    defaultMessage:
      'Ef sama mál er til meðferðar hjá öðru stjórnvaldi eða dómstólum tekur Persónuvernd slík mál allajafna ekki til meðferðar fyrr en viðkomandi stjórnvald/dómstóll hefur lokið sinni málsmeðferð. Er þessi framkvæmd viðhöfð á grundvelli almennra reglna stjórnsýsluréttarins um meðalhóf.',
    description: 'Shown in a card when concernsLibel has been answered as yes',
  },
  concernsPersonalLettersOrSocialMediaTitle: {
    id:
      'dpac.application:error.concernsPersonalLettersOrSocialMedia.card.title',
    defaultMessage:
      'TODO: Við tökum því miður ekki á málum sem varða opnun persónulegra bréfa',
    description:
      'Shown in a card when concernsPersonalLettersOrSocialMedia has been answered as yes',
  },
  concernsPersonalLettersOrSocialMediaDescription: {
    id:
      'dpac.application:error.concernsPersonalLettersOrSocialMedia.card.description',
    defaultMessage:
      'Ef sama mál er til meðferðar hjá öðru stjórnvaldi eða dómstólum tekur Persónuvernd slík mál allajafna ekki til meðferðar fyrr en viðkomandi stjórnvald/dómstóll hefur lokið sinni málsmeðferð. Er þessi framkvæmd viðhöfð á grundvelli almennra reglna stjórnsýsluréttarins um meðalhóf.',
    description:
      'Shown in a card when concernsPersonalLettersOrSocialMedia has been answered as yes',
  },
  onBehalfOfACompanyTitle: {
    id: 'dpac.application:error.onBehalfOfACompany.card.title',
    defaultMessage: 'Hér er ekki hægt að senda inn kvörtun á vegum fyrirtækis',
    description: 'Shown in a card when onBehalf has been answered as company',
  },
  onBehalfOfACompanyDescription: {
    id: 'dpac.application:error.onBehalfOfACompany.card.description',
    defaultMessage:
      'Ef þú vilt senda inn tilkynningu um öryggisbrest þá getur þú gert það með því að senda inn í gáttina: Tilkynning um öryggisbrest sem er samvinnuverkefni samgöngu- og sveitarstjórnarráðuneytis, Persónuverndar, Póst- og fjarskiptastofnunar/CERT-IS og Lögreglunnar.',
    description: 'Shown in a card when onBehalfOf has been answered as company',
  },
})
