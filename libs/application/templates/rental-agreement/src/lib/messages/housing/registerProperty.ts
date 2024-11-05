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
    addressLabel: {
      id: 'ra.application:registerProperty.info.addressLabel',
      defaultMessage: 'Heimilisfang leiguhúsnæðis',
      description: 'Register property address input label',
    },
    addressPlaceholder: {
      id: 'ra.application:registerProperty.info.addressPlaceholder',
      defaultMessage: 'Sláðu inn Heimilisfang leiguhúsnæðis',
      description: 'Register property address input placeholder',
    },
    propertyIdLabel: {
      id: 'ra.application:registerProperty.info.propertyIdLabel',
      defaultMessage: 'Fasteignanúmer',
      description: 'Input label for property number',
    },
    propertyIdPlaceholder: {
      id: 'ra.application:registerProperty.info.propertyIdPlaceholder',
      defaultMessage: 'Sláðu inn fasteignanúmer húsnæðis (án F)',
      description: 'Input placeholder for property number',
    },
    propertyUnitIdLabel: {
      id: 'ra.application:registerProperty.info.propertyUnitIdLabel',
      defaultMessage: 'Merking fasteignahluta',
      description: 'Input label for property unit marking',
    },
    propertyUnitIdPlaceholder: {
      id: 'ra.application:registerProperty.info.propertyUnitIdPlaceholder',
      defaultMessage: 'Sláðu inn merkingu fasteignar sem á að leigja',
      description: 'Input placeholder for property unit marking',
    },
    postalCodeLabel: {
      id: 'ra.application:registerProperty.info.postalCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Input label for property postal code',
    },
    postalCodePlaceholder: {
      id: 'ra.application:registerProperty.info.postalCodePlaceholder',
      defaultMessage: 'Veldu póstnúmer',
      description: 'Input placeholder for property postal code',
    },
    municipalityLabel: {
      id: 'ra.application:registerProperty.info.municipalityLabel',
      defaultMessage: 'Sveitarfélag',
      description: 'Input label for property municipality',
    },
    municipalityPlaceholder: {
      id: 'ra.application:registerProperty.info.municipalityPlaceholder',
      defaultMessage: 'Sláðu inn sveitarfélag',
      description: 'Input placeholder for property municipality',
    },
    sizeLabel: {
      id: 'ra.application:registerProperty.info.sizeLabel',
      defaultMessage: 'Stærð húsnæðis (m²)',
      description: 'Input label for property size',
    },
    numOfRoomsLabel: {
      id: 'ra.application:registerProperty.info.numOfRoomsLabel',
      defaultMessage: 'Fjöldi herbergja',
      description: 'Input label for number of rooms in property',
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
    tableHeaderPropertyId: {
      id: 'ra.application:registerProperty.infoSummary.tableHeaderPropertyId',
      defaultMessage: 'Fasteignanúmer',
      description: 'Summary table header for property number',
    },
    tableHeaderAddress: {
      id: 'ra.application:registerProperty.infoSummary.tableHeaderAddress',
      defaultMessage: 'Heimilisfang',
      description: 'Summary table header for address',
    },
    tableHeaderUnitId: {
      id: 'ra.application:registerProperty.infoSummary.tableHeaderUnitId',
      defaultMessage: 'Merking',
      description: 'Summary table header for property unit id',
    },
    tableHeaderSize: {
      id: 'ra.application:registerProperty.infoSummary.tableHeaderSize',
      defaultMessage: 'Birt stærð',
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
      defaultMessage: 'Flokkun húsnæðis',
      description: 'Title for property class',
    },
    classDescription: {
      id: 'ra.application:registerProperty.category.classDescription',
      defaultMessage:
        'Veldu hér hvort húsnæðið sé á almennum leigumarkaði eða fyrir sérstaka hópa, t.d. námsfólk, eldri borgara eða tekjulægri hópa.',
      description: 'Description for property class',
    },
    classSelectLabelGeneralMarket: {
      id: 'ra.application:registerProperty.category.classSelectLabelGeneralMarket',
      defaultMessage: 'Almennur leigumarkaður',
      description: 'Label for general market select option',
    },
    classSelectLabelSpecialGroups: {
      id: 'ra.application:registerProperty.category.classSelectLabelSpecialGroups',
      defaultMessage: 'Húsnæði fyrir sérstaka hópa',
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
      defaultMessage: 'Námsmannaíbúðir',
      description: 'Label for student housing select option',
    },
    classGroupSelectLabelSeniorCitizenHousing: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelSeniorCitizenHousing',
      defaultMessage: 'Íbúðir fyrir eldri borgara',
      description: 'Label for senior citizen housing select option',
    },
    classGroupSelectLabelCommune: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelCommune',
      defaultMessage: 'Sambýli',
      description: 'Label for commune select option',
    },
    classGroupSelectLabelHalfwayHouse: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelHalfwayHouse',
      defaultMessage: 'Áfangaheimili',
      description: 'Label for halfway house select option',
    },
    classGroupSelectLabelSocialHousing: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelSocialHousing',
      defaultMessage: 'Félagslegt húsnæði',
      description: 'Label for social housing select option',
    },
    classGroupSelectLabelIncomeBasedHousing: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelIncomeBasedHousing',
      defaultMessage: 'Tekjumarksíbúð',
      description: 'Label for income based housing select option',
    },
    classGroupSelectLabelEmployeeHousing: {
      id: 'ra.application:registerProperty.category.classGroupSelectLabelEmployeeHousing',
      defaultMessage: 'Starfsmannaíbúð eða -herbergi',
      description: 'Label for employee housing select option',
    },
  }),
}
