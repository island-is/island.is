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
    radioOptionYes: {
      id: 'cpn.application:child.nationalIdLookup.radioOptionYes',
      defaultMessage: 'Já',
      description: "Yes — user knows the child's national ID",
    },
    radioOptionNo: {
      id: 'cpn.application:child.nationalIdLookup.radioOptionNo',
      defaultMessage: 'Nei',
      description: "No — user does not know the child's national ID",
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
    email: {
      id: 'cpn.application:child.nationalIdLookup.email',
      defaultMessage: 'Netfang',
      description: 'Label for email field',
    },
    phone: {
      id: 'cpn.application:child.nationalIdLookup.phone',
      defaultMessage: 'Símanúmer',
      description: 'Label for phone field',
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
    pronounHann: {
      id: 'cpn.application:child.nationalIdLookup.pronounHann',
      defaultMessage: 'Hann',
      description: 'Pronoun option: he/him',
    },
    pronounHun: {
      id: 'cpn.application:child.nationalIdLookup.pronounHun',
      defaultMessage: 'Hún',
      description: 'Pronoun option: she/her',
    },
    pronounHan: {
      id: 'cpn.application:child.nationalIdLookup.pronounHan',
      defaultMessage: 'Hán',
      description: 'Pronoun option: they/them (gender neutral)',
    },
  }),
  noNationalId: defineMessages({
    reasonLabel: {
      id: 'cpn.application:child.noNationalId.reasonLabel',
      defaultMessage: 'Skýring',
      description: 'Label for the reason dropdown when no national ID is known',
    },
    reasonPlaceholder: {
      id: 'cpn.application:child.noNationalId.reasonPlaceholder',
      defaultMessage: 'Veldu menntun eða gæslu',
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
    nameAgeGenderDescription: {
      id: 'cpn.application:child.manualInfo.nameAgeGenderDescription',
      defaultMessage: 'Fylltu út upplýsingar eftir bestu vitneskju og getu.',
      description: 'Description under the name/age/gender group title',
    },
    name: {
      id: 'cpn.application:child.manualInfo.name',
      defaultMessage: 'Nafn',
      description: 'Label for name field',
    },
    age: {
      id: 'cpn.application:child.manualInfo.age',
      defaultMessage: 'Aldur',
      description: 'Label for age field',
    },
    gender: {
      id: 'cpn.application:child.manualInfo.gender',
      defaultMessage: 'Kyn',
      description: 'Label for gender select field',
    },
    genderPlaceholder: {
      id: 'cpn.application:child.manualInfo.genderPlaceholder',
      defaultMessage: 'Veldu kyn',
      description: 'Placeholder for gender select field',
    },
    addressTitle: {
      id: 'cpn.application:child.manualInfo.addressTitle',
      defaultMessage: 'Veistu hvar barnið býr?',
      description: 'Title for address group',
    },
    addressDescription: {
      id: 'cpn.application:child.manualInfo.addressDescription',
      defaultMessage: 'Fylltu út upplýsingar eftir bestu vitneskju og getu.',
      description: 'Description under the address group title',
    },
    country: {
      id: 'cpn.application:child.manualInfo.country',
      defaultMessage: 'Land',
      description: 'Label for country select field',
    },
    countryPlaceholder: {
      id: 'cpn.application:child.manualInfo.countryPlaceholder',
      defaultMessage: 'Veldu land',
      description: 'Placeholder for country select field',
    },
    address: {
      id: 'cpn.application:child.manualInfo.address',
      defaultMessage: 'Heimilisfang',
      description: 'Label for address field',
    },
    postalCode: {
      id: 'cpn.application:child.manualInfo.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Label for postal code field',
    },
    municipality: {
      id: 'cpn.application:child.manualInfo.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Label for municipality select field',
    },
    municipalityPlaceholder: {
      id: 'cpn.application:child.manualInfo.municipalityPlaceholder',
      defaultMessage: 'Veldu sveitarfélag',
      description: 'Placeholder for municipality select field',
    },
    languageTitle: {
      id: 'cpn.application:child.manualInfo.languageTitle',
      defaultMessage: 'Á hvaða tungumáli finnst barninu best að tjá sig?',
      description: 'Title for the language group',
    },
    language: {
      id: 'cpn.application:child.manualInfo.language',
      defaultMessage: 'Tungumál',
      description: 'Label for language select field',
    },
    languagePlaceholder: {
      id: 'cpn.application:child.manualInfo.languagePlaceholder',
      defaultMessage: 'Veldu tungumál',
      description: 'Placeholder for language select field',
    },
    needsInterpreter: {
      id: 'cpn.application:child.manualInfo.needsInterpreter',
      defaultMessage: 'Er þörf á túlkþjónustu?',
      description: 'Checkbox label for interpreter need',
    },
  }),
}
