import { defineMessages } from 'react-intl'

// Error messages in the application
export const error = defineMessages({
  inCourtProceedings: {
    id: 'dpac.application:error.inCourtProceedings',
    defaultMessage:
      'Persónuvernd getur ekki fjallað um mál sem eru til meðferðar hjá dómstólum eða öðrum stjórnvöldum',
    description:
      'Error message when inCourtProceedings has been answered as yes',
  },
  concernsMediaCoverage: {
    id: 'dpac.application:error.concernsMediaCoverage',
    defaultMessage:
      'Persónuvernd getur ekki tekið til úrlausnar kvartanir yfir umfjöllun í fjölmiðlum.',
    description:
      'Error message when concernsMediaCoverage has been answered as yes',
  },
  concernsBanMarking: {
    id: 'dpac.application:error.concernsBanMarking',
    defaultMessage:
      'Persónuvernd getur ekki fjallað um kvartanir yfir því að x-merking í símaskrá eða bannmerking í þjóðskrá hafi ekki verið virt.',
    description:
      'Error message when concernsBanMarking has been answered as yes',
  },
  concernsLibel: {
    id: 'dpac.application:error.concernsLibel',
    defaultMessage:
      'Persónuvernd getur ekki fjallað um meiðyrði eða ærumeiðingar',
    description: 'Error message when concernsLibel has been answered as yes',
  },
  concernsPersonalDataConflict: {
    id: 'dpac.application:error.concernsPersonalDataConflict',
    defaultMessage:
      'Vinsamlegast athugaðu að nauðsynlegt er að leita fyrst til ábyrgðaraðila vinnslunnar og óska eftir að fá aðgang að upplýsingum, þær verði leiðréttar eða þeim eytt. Ef þú færð ekki svör innan mánaðar getur þú leitað til Persónuverndar.',
    description:
      'Error message when concernsPersonalDataConflict has been answered as yes',
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
  required: {
    id: 'dpac.application:error.required',
    defaultMessage: 'Skylda er að fylla út reitinn',
    description: 'Error message when a required field has not been filled out',
  },
  wordCountReached: {
    id: 'dpac.application:error.wordCountReached',
    defaultMessage: 'Lýsingin má vera 500 orð að hámarki',
    description: 'Error message when a word count has been reached',
  },
  nationalId: {
    id: 'dpac.application:error.nationalId',
    defaultMessage: 'Kennitala er ekki á réttu sniðmáti',
    description: 'Error message when a nationalId is incorrect',
  },
})

export const errorCards = defineMessages({
  inCourtProceedingsTitle: {
    id: 'dpac.application:error.inCourtProceedings.card.title',
    defaultMessage:
      'Persónuvernd getur ekki fjallað um mál sem eru til meðferðar hjá dómstólum eða öðrum stjórnvöldum',
    description:
      'Shown in a card when inCourtProceedings has been answered as yes',
  },
  inCourtProceedingsDescription: {
    id: 'dpac.application:error.inCourtProceedings.card.description',
    defaultMessage:
      'Ef sama mál er til meðferðar hjá öðru stjórnvaldi eða dómstólum tekur Persónuvernd það allajafna ekki til skoðunar fyrr en viðkomandi stjórnvald/dómstóll hefur lokið sinni málsmeðferð.',
    description:
      'Shown in a card when inCourtProceedings has been answered as yes',
  },
  concernsMediaCoverageTitle: {
    id: 'dpac.application:error.concernsMediaCoverage.card.title',
    defaultMessage:
      'Persónuvernd getur ekki tekið til úrlausnar kvartanir yfir umfjöllun í fjölmiðlum.',
    description:
      'Shown in a card when concernsMediaCoverage has been answered as yes',
  },
  concernsMediaCoverageDescription: {
    id: 'dpac.application:error.concernsMediaCoverage.card.description',
    defaultMessage:
      'Eftir atvikum er hægt að leita til Fjölmiðlanefndar eða siðanefndar Blaðamannafélags Íslands. Nánari skýringu má finna hér að neðan.',
    description:
      'Shown in a card when concernsMediaCoverage has been answered as yes',
  },
  concernsBanMarkingTitle: {
    id: 'dpac.application:error.concernsBanMarking.card.title',
    defaultMessage:
      'Persónuvernd getur ekki fjallað um kvartanir yfir því að x-merking í símaskrá eða bannmerking í þjóðskrá hafi ekki verið virt. ',
    description:
      'Shown in a card when concernsBanMarking has been answered as yes',
  },
  concernsBanMarkingDescription: {
    id: 'dpac.application:error.concernsBanMarking.card.description',
    defaultMessage:
      'Þú getur snúið þér til Póst- og fjarskiptastofnunar vegna x-merkingar í símaskrá, eða Þjóðskrár Íslands  vegna bannmerkingar í þjóðskrá. ',
    description:
      'Shown in a card when concernsBanMarking has been answered as yes',
  },
  concernsLibelTitle: {
    id: 'dpac.application:error.concernsLibel.card.title',
    defaultMessage:
      'Persónuvernd getur ekki fjallað um meiðyrði eða ærumeiðingar',
    description: 'Shown in a card when concernsLibel has been answered as yes',
  },
  concernsLibelDescription: {
    id: 'dpac.application:error.concernsLibel.card.description',
    defaultMessage:
      'Önnur úrræði kunna að vera í boði, svo sem að leita til lögreglu eða dómstóla, en það þarf að meta í hverju tilviki. Hægt er að leita aðstoðar lögmanns ef þarf.',
    description: 'Shown in a card when concernsLibel has been answered as yes',
  },
  concernsPersonalDataConflictTitle: {
    id: 'dpac.application:error.concernsPersonalDataConflict.card.title',
    defaultMessage: 'Athugaðu',
    description:
      'Shown in a card when concernsPersonalDataConflict has been answered as yes',
  },

  concernsPersonalDataConflictDescription: {
    id: 'dpac.application:error.concernsPersonalDataConflict.card.description',
    defaultMessage:
      'Vinsamlegast athugaðu að nauðsynlegt er að leita fyrst til ábyrgðaraðila vinnslunnar og óska eftir að fá aðgang að upplýsingum, þær verði leiðréttar eða þeim eytt. Ef þú færð ekki svör innan mánaðar getur þú leitað til Persónuverndar. Nánari upplýsingar um þín réttindi samkvæmt persónuverndarlögum.',
    description:
      'Shown in a card when concernsPersonalDataConflict has been answered as yes',
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
