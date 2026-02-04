import { defineMessages } from 'react-intl'

export const propertySearch = {
  search: defineMessages({
    subsectionName: {
      id: 'ra.application:registerProperty.search.subSectionName',
      defaultMessage: 'Húsnæðið',
      description: 'Register property sub section name',
    },
    pageTitle: {
      id: 'ra.application:registerProperty.search.pageTitle',
      defaultMessage: 'Húsnæðið',
      description: 'Register property page title',
    },
    pageDescription: {
      id: 'ra.application:registerProperty.search.pageDescription',
      defaultMessage:
        'Finndu eignina með heimilisfangi eða fasteignanúmeri. Nánari upplýsingar er að finna í [fasteignaskrá HMS](https://leit.fasteignaskra.is/).',
      description: 'Register property page description',
    },
    spouseFamilyNotice: {
      id: 'ra.application:registerProperty.search.spouseFamilyNotice',
      defaultMessage:
        'Ef hið leigða er bústaður fjölskyldu leigusala eða notað við atvinnurekstur hjóna, eða ætlað til þess, þá ber að fá undirskrift maka sbr. IX. kafla hjúskaparlaga. Hægt er að skila slíku samþykki maka í tölvupósti til HMS og verður það þá fylgiskjal hins skráða samnings.',
      description:
        'Notice message regarding property being used for family purposes',
    },
    propertySearchPlaceholder: {
      id: 'ra.application:registerProperty.search.propertySearchPlaceholder',
      defaultMessage: 'Leitaðu eftir heimilisfangi eða fasteignanúmeri',
      description: 'Placeholder for property search',
    },
    searchResultHeaderPropertyId: {
      id: 'ra.application:registerProperty.search.searchResultHeaderPropertyId',
      defaultMessage: 'Fasteignanúmer',
      description: 'Search result header for property number',
    },
    searchResultHeaderMarking: {
      id: 'ra.application:registerProperty.search.searchResultHeaderMarking',
      defaultMessage: 'Merking',
      description: 'Search result header for "merking"',
    },
    searchResultsErrorBannerTitle: {
      id: 'ra.application:registerProperty.search.searchResultsErrorBannerTitle',
      defaultMessage:
        'Laga þarf eftirfarandi villur í skráningu í töflunni hér að ofan',
      description: 'Error banner title when edits fail validation',
    },

    // Error messages
    addressSearchError: {
      id: 'ra.application:registerProperty.search.addressSearchError',
      defaultMessage: 'Ekki tókst að sækja heimilisföng',
      description: 'Error message when address search fails',
    },
    propertyInfoError: {
      id: 'ra.application:registerProperty.search.propertyInfoError',
      defaultMessage:
        'Ekki tókst að sækja fasteignir út frá völdu heimilisfangi',
      description: 'Error message when property info search fails',
    },
    searchResultsNoUnitChosenError: {
      id: 'ra.application:registerProperty.search.searchResultsNoUnitChosenError',
      defaultMessage:
        'Velja þarf a.m.k. eina einingu undir fasteignanúmeri til að halda áfram',
      description: 'Error message when no unit is selected in search results',
    },
    numOfRoomsMinimumError: {
      id: 'ra.application:registerProperty.search.numOfRoomsMinimumError',
      defaultMessage: 'Skrá þarf fjölda herbergja leigðra eininga',
      description:
        'Error message when number of rooms is less than one in search results',
    },
    numOfRoomsMaximumError: {
      id: 'ra.application:registerProperty.search.numOfRoomsMaximumError',
      defaultMessage:
        'Heildarfjöldi herbergja leigðra eininga getur ekki verið fleiri en 20',
      description:
        'Error message when number of rooms is larger than max in search results',
    },
    numOfRoomsForRoomTypeError: {
      id: 'ra.application:registerProperty.search.numOfRoomsForRoomTypeError',
      defaultMessage:
        'Fjöldi herbergja má ekki vera fleiri en 1 þegar tegund húsnæðis er herbergi',
      description:
        'Error message when number of rooms is more than 1 for room type rental',
    },
    changedSizeTooLargeError: {
      id: 'ra.application:registerProperty.search.changedSizeTooLargeError',
      defaultMessage:
        'Stærð leiguhúsnæðis getur ekki verið stærri en 500m² fermetrar',
      description: 'Error message when changed size is too large',
    },
    changedSizeTooSmallError: {
      id: 'ra.application:registerProperty.search.changedSizeTooSmallError',
      defaultMessage:
        'Heildarstærð leiguhúsnæðis getur ekki verið minni en 3m² fermetrar',
      description:
        'Error message when changed size is smaller than min size in search results',
    },
  }),

  info: defineMessages({
    subsectionName: {
      id: 'ra.application:registerProperty.info.subSectionName',
      defaultMessage: 'Skrá húsnæði',
      description: 'Register property sub section name',
    },
    pageTitle: {
      id: 'ra.application:registerProperty.info.pageTitle',
      defaultMessage: 'Húsnæðið',
      description: 'Property info summary page title',
    },
    pageDescription: {
      id: 'ra.application:registerProperty.info.pageDescription',
      defaultMessage:
        'Eftirtaldar upplýsingar eru samantekt af skráningu frá fyrra skrefi. Farðu vel yfir skráninguna til að vera viss um að allar upplýsingar séu réttar. Þú getur farið til baka til að breyta upplýsingum.',
      description: 'Property info summary page description',
    },
    propertyAddressAnswer: {
      id: 'ra.application:registerProperty.info.propertyAddressAnswer',
      defaultMessage: '{propertyAddress}',
      description: 'Property address from search result',
    },
    tableHeaderUsablity: {
      id: 'ra.application:registerProperty.info.tableHeaderUsablity',
      defaultMessage: 'Notkun',
      description: 'Summary table header for property number',
    },
    tableHeaderUnitId: {
      id: 'ra.application:registerProperty.info.tableHeaderUnitId',
      defaultMessage: 'Merking',
      description: 'Summary table header for property unit id',
    },
  }),

  category: defineMessages({
    pageTitle: {
      id: 'ra.application:registerProperty.category.pageTitle',
      defaultMessage: 'Skráning húsnæðis',
      description: 'Property category page title',
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

    // Error messages
    classGroupRequiredError: {
      id: 'ra.application:registerProperty.category.categoryClassGroupError',
      defaultMessage: 'Veldu flokk húsnæðis',
      description:
        'Error message when property category class group is not selected',
    },
  }),
}
