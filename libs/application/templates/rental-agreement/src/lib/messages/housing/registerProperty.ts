import { defineMessages } from 'react-intl'

export const registerProperty = {
  subsection: defineMessages({
    name: {
      id: 'ra.application:registerProperty.subSection.name',
      defaultMessage: 'Skrá húsnæði',
      description: 'Register property subsection name',
    },
  }),

  info: defineMessages({
    pageTitle: {
      id: 'ra.application:registerProperty.info.pageTitle',
      defaultMessage: 'Húsnæðið',
      description: 'Register property page title',
    },
    pageDescription: {
      id: 'ra.application:registerProperty.info.pageDescription',
      defaultMessage:
        'Finndu eignina með fasteignanúmeri eða heimilisfangi. Nánari upplýsingar er að finna í [fasteignaskrá HMS](https://leit.fasteignaskra.is/).',
      description: 'Register property page description',
    },
    propertySearchPlaceholder: {
      id: 'ra.application:registerProperty.info.propertySearchPlaceholder',
      defaultMessage: 'Leitaðu eftir heimilisfangi',
      description: 'Placeholder for property search',
    },
    searchResultHeaderPropertyId: {
      id: 'ra.application:registerProperty.info.searchResultHeaderPropertyId',
      defaultMessage: 'Fasteignanúmer',
      description: 'Search result header for property number',
    },
    searchResultHeaderMarking: {
      id: 'ra.application:registerProperty.info.searchResultHeaderMarking',
      defaultMessage: 'Merking',
      description: 'Search result header for "merking"',
    },
    searchResultHeaderPropertySize: {
      id: 'ra.application:registerProperty.info.searchResultHeaderPropertySize',
      defaultMessage: 'Stærð',
      description: 'Search result header for property size',
    },
    searchResultsHeaderNumOfRooms: {
      id: 'ra.application:registerProperty.info.searchResultsHeaderNumOfRooms',
      defaultMessage: 'Herbergi',
      description: 'Search result header for number of rooms',
    },

    // Error messages
    searchError: {
      id: 'ra.application:registerProperty.info.searchError',
      defaultMessage: 'Ekki tókst að sækja staðföng',
      description: 'Error message when search fails',
    },
    searchResultsEmptyError: {
      id: 'ra.application:registerProperty.category.searchResultsEmptyError',
      defaultMessage:
        'Skráning leiguhúsnæðis þarf að vera til staðar til að halda áfram',
      description: 'Error message when no search results',
    },
  }),

  infoSummary: defineMessages({
    pageTitle: {
      id: 'ra.application:registerProperty.infoSummary.pageTitle',
      defaultMessage: 'Húsnæðið',
      description: 'Property info summary page title',
    },
    pageDescription: {
      id: 'ra.application:registerProperty.infoSummary.pageDescription',
      defaultMessage:
        'Eftirtaldar upplýsingar eru samantekt af skráningu frá fyrra skrefi. Farðu vel yfir skráninguna til að vera viss um að allar upplýsingar séu réttar. Þú getur farið til baka til að breyta upplýsingum.',
      description: 'Property info summary page description',
    },
    propertyAddressAnswer: {
      id: 'ra.application:registerProperty.infoSummary.propertyAddressAnswer',
      defaultMessage: '{propertyAddress}',
      description: 'Property address from search result',
    },
    tableHeaderUsablity: {
      id: 'ra.application:registerProperty.infoSummary.tableHeaderUsablity',
      defaultMessage: 'Notkun',
      description: 'Summary table header for property number',
    },
    tableHeaderUnitId: {
      id: 'ra.application:registerProperty.infoSummary.tableHeaderUnitId',
      defaultMessage: 'Merking',
      description: 'Summary table header for property unit id',
    },
    tableHeaderSize: {
      id: 'ra.application:registerProperty.infoSummary.tableHeaderSize',
      defaultMessage: 'Stærð',
      description: 'Summary table header for size',
    },
    tableHeaderNumOfRooms: {
      id: 'ra.application:registerProperty.infoSummary.tableHeaderNumOfRooms',
      defaultMessage: 'herbergi',
      description: 'Summary table header for number of rooms',
    },
  }),

  category: defineMessages({
    pageTitle: {
      id: 'ra.application:registerProperty.category.pageTitle',
      defaultMessage: 'Skráning húsnæðis',
      description: 'Property category page title',
    },
    pageDescription: {
      id: 'ra.application:registerProperty.category.pageDescription',
      defaultMessage:
        'Hér þarft þú að velja tegund og flokkun leiguhúsnæðisins.',
      description: 'Property category page description',
    },

    typeTitle: {
      id: 'ra.application:registerProperty.category.typeTitle',
      defaultMessage: 'Tegund húsnæðis',
      description: 'Title for property type',
    },
    typeDescription: {
      id: 'ra.application:registerProperty.category.typeDescription',
      defaultMessage:
        'Veldu hér hvort um er að ræða heila íbúð, herbergi eða atvinnuhúsnæði.',
      description: 'Description for property type',
    },
    typeSelectLabelEntireHome: {
      id: 'ra.application:registerProperty.category.typeSelectLabelEntireHome',
      defaultMessage: 'Íbúð / Einbýlishús',
      description: 'Label for entire home select option',
    },
    typeSelectLabelRoom: {
      id: 'ra.application:registerProperty.category.typeSelectLabelRoom',
      defaultMessage: 'Herbergi',
      description: 'Label for room select option',
    },
    typeSelectLabelCommercial: {
      id: 'ra.application:registerProperty.category.typeSelectLabelCommercial',
      defaultMessage: 'Atvinnuhúsnæði',
      description: 'Label for commercial select option',
    },

    classTitle: {
      id: 'ra.application:registerProperty.category.classTitle',
      defaultMessage: 'Sérstakir hópar',
      description: 'Title for property class',
    },
    classDescription: {
      id: 'ra.application:registerProperty.category.classDescription',
      defaultMessage:
        'Er húsnæðið ætlað fyrir sérstaka hópa, t.d. námsfólk, eldri borgara eða tekjulægri hópa.',
      description: 'Description for property class',
    },
    classSelectLabelNotSpecialGroups: {
      id: 'ra.application:registerProperty.category.classSelectLabelNotSpecialGroups',
      defaultMessage: 'Nei',
      description: 'Label for general market select option',
    },
    classSelectLabelIsSpecialGroups: {
      id: 'ra.application:registerProperty.category.classSelectLabelIsSpecialGroups',
      defaultMessage: 'Já',
      description: 'Label for special groups select option',
    },

    classGroupLabel: {
      id: 'ra.application:registerProperty.category.classGroupLabel',
      defaultMessage: 'Sérstakur flokkur húsnæðis',
      description: 'Label for property class group select',
    },
    classGroupPlaceholder: {
      id: 'ra.application:registerProperty.category.classGroupPlaceholder',
      defaultMessage: 'Veldu',
      description: 'Placeholder for property class group select',
    },
    classGroupSelectLabelStudentHousing: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelStudentHousing',
      defaultMessage: 'Námsmenn',
      description: 'Label for student housing select option',
    },
    classGroupSelectLabelSeniorCitizenHousing: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelSeniorCitizenHousing',
      defaultMessage: 'Eldri borgarar',
      description: 'Label for senior citizen housing select option',
    },
    classGroupSelectLabelCommune: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelCommune',
      defaultMessage: 'Sambýli og íbúðakjarnar',
      description: 'Label for commune select option',
    },
    classGroupSelectLabelHalfwayHouse: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelHalfwayHouse',
      defaultMessage: 'Áfangaheimili',
      description: 'Label for halfway house select option',
    },
    classGroupSelectLabelIncomeBasedHousing: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelIncomeBasedHousing',
      defaultMessage: 'Tekjumark',
      description: 'Label for income based housing select option',
    },
    classGroupSelectLabelEmployeeHousing: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelEmployeeHousing',
      defaultMessage: 'Starfsmannaíbúð eða -herbergi',
      description: 'Label for employee housing select option',
    },

    // Error messages
    classGroupRequiredError: {
      id: 'ra.application:registerProperty.category.categoryClassGroupError',
      defaultMessage: 'Veldu flokk húsnæðis',
      description:
        'Error message when property category class group is not selected',
    },
  }),
}
