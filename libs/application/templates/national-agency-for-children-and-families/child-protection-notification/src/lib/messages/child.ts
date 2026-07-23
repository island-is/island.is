import { defineMessages } from 'react-intl'

export const childMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'cpn.application:child.shared.sectionTitle',
      defaultMessage: 'Barn',
      description: 'Child section title',
    },
  }),
  nationalIdLookup: defineMessages({
    childInfoTitle: {
      id: 'cpn.application:child.nationalIdLookup.childInfoTitle',
      defaultMessage: 'Upplýsingar um barnið',
      description:
        'Title for the child info fields shown when user knows national ID',
    },
    description: {
      id: 'cpn.application:child.nationalIdLookup.description',
      defaultMessage:
        'Hjálpaðu okkur að tryggja að réttu barni sé veittur réttur stuðningur á réttum tíma. \n\nMeð því að finna til og skrá kennitölu eða kerfiskennitölu barnsins hér í fyrsta skrefi gerir þú okkur kleift að sækja fyrir þig allar upplýsingar sem nauðsynlegar eru til að auðkenna barnið með sjálfvirkum hætti. Með því sparar þú þér einnig fjölmörg skref sem á eftir koma hér í tilkynningunni. \n\nEf kennitala barnsins er ekki við höndina, biðjum við þig að skrá umbeðnar upplýsingar eftir bestu getu og vitneskju.',
      description:
        'Combined intro description for the child national ID lookup page',
    },
    radioLabel: {
      id: 'cpn.application:child.nationalIdLookup.radioLabel',
      defaultMessage: 'Þekkir þú kennitölu barns?',
      description:
        "Radio label asking whether the user knows the child's national ID",
    },
    radioOptionUnborn: {
      id: 'cpn.application:child.nationalIdLookup.radioOptionUnborn',
      defaultMessage: 'Barnið er ófætt',
      description: 'The child is unborn',
    },
    usePronounAndPreferredName: {
      id: 'cpn.application:child.nationalIdLookup.usePronounAndPreferredName',
      defaultMessage:
        'Barnið kýs að vera ávarpað með öðru nafni og/eða persónufornafni en hann eða hún',
      description: 'Checkbox label for preferred pronoun or name',
    },
    usePronounAndPreferredNameTooltip: {
      id: 'cpn.application:child.nationalIdLookup.usePronounAndPreferredNameTooltip',
      defaultMessage:
        'Forsjáraðilar geta óskað eftir breytingu á skráðu kyni og nafni barns hjá Þjóðskrá eða barnið sjálft sé það orðið 15 ára. Ef sú breyting er ótímabært má breyta nafni barnsins hér og skrá það nafn sem barn hefur valið sér.',
      description:
        'Tooltip explaining how to change a registered name or pronoun',
    },
    fetchedDataInfo: {
      id: 'cpn.application:child.nationalIdLookup.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar um kyn barns, lögheimili, póstnúmer og sveitarfélag eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown after child data is fetched from national registry',
    },
    preferredName: {
      id: 'cpn.application:child.nationalIdLookup.preferredName',
      defaultMessage: 'Valið nafn',
      description: 'Label for preferred name field',
    },
    preferredPronoun: {
      id: 'cpn.application:child.nationalIdLookup.preferredPronoun',
      defaultMessage: 'Valið persónufornafn',
      description: 'Label for preferred pronoun select field',
    },
    preferredPronounPlaceholder: {
      id: 'cpn.application:child.nationalIdLookup.preferredPronounPlaceholder',
      defaultMessage: 'Veldu persónufornafn',
      description: 'Placeholder for preferred pronoun select field',
    },
  }),
  noNationalId: defineMessages({
    reasonLabel: {
      id: 'cpn.application:child.noNationalId.reasonLabel',
      defaultMessage: 'Nánari skýring',
      description: 'Label for the reason dropdown when no national ID is known',
    },
    reasonPlaceholder: {
      id: 'cpn.application:child.noNationalId.reasonPlaceholder',
      defaultMessage: 'Veldu nánari skýringu',
      description: 'Placeholder for the reason dropdown',
    },
    reasonExpectedButUnknown: {
      id: 'cpn.application:child.noNationalId.reasonExpectedButUnknown',
      defaultMessage:
        'Barnið er væntanlegt með kennitölu en ég þekki hana ekki',
      description:
        'Reason: child is expected to have a national ID but user does not know it',
    },
    reasonTraveler: {
      id: 'cpn.application:child.noNationalId.reasonTraveler',
      defaultMessage: 'Barnið er ferðamaður',
      description: 'Reason: child is a traveler',
    },
    reasonBorderReception: {
      id: 'cpn.application:child.noNationalId.reasonBorderReception',
      defaultMessage: 'Móttaka barns við landamæri',
      description: 'Reason: child is being received at the border',
    },
  }),
  manualInfo: defineMessages({
    sectionTitle: {
      id: 'cpn.application:child.manualInfo.sectionTitle',
      defaultMessage: 'Upplýsingar um barn',
      description: 'Title for the manual child info subsection',
    },
    intro: {
      id: 'cpn.application:child.manualInfo.intro',
      defaultMessage:
        'Vinsamlegar fylltu út allar þær upplýsingar sem þú hefur vitneskju um. Þetta hjálpar okkur að tryggja að réttu barni sé veittur réttur stuðningur á réttum tíma.',
      description: 'Intro text for the manual child info page',
    },
    nameAgeGenderTitle: {
      id: 'cpn.application:child.manualInfo.nameAgeGenderTitle',
      defaultMessage: 'Veistu nafn, aldur og/eða kyn barnsins?',
      description: 'Title for name/age/gender group',
    },
    addressTitle: {
      id: 'cpn.application:child.manualInfo.addressTitle',
      defaultMessage: 'Veistu hvar barnið býr?',
      description: 'Title for address group',
    },
    languageTitle: {
      id: 'cpn.application:child.manualInfo.languageTitle',
      defaultMessage: 'Á hvaða tungumáli finnst barninu best að tjá sig?',
      description: 'Title for the language group',
    },
  }),
}
