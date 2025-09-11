import { defineMessages } from 'react-intl'

export const location = {
  general: defineMessages({
    sectionTitleShortTerm: {
      id: 'ta.eft.application:location.general.sectionTitleShortTerm',
      defaultMessage: 'Leið',
      description: 'Title of location section for short-term',
    },
    sectionTitleLongTerm: {
      id: 'ta.eft.application:location.general.sectionTitleLongTerm',
      defaultMessage: 'Svæði',
      description: 'Title of location section for long-term',
    },
    pageTitleShortTerm: {
      id: 'ta.eft.application:location.general.pageTitle',
      defaultMessage: 'Leið',
      description: 'Title of location page for short-term',
    },
    pageTitleLongTerm: {
      id: 'ta.eft.application:location.general.pageTitleLongTerm',
      defaultMessage: 'Svæði',
      description: 'Title of location page for long-term',
    },
  }),
  shortTerm: defineMessages({
    fromSubtitle: {
      id: 'ta.eft.application:location.shortTerm.fromSubtitle',
      defaultMessage: 'Upphafsstaður',
      description: 'Location from subtitle',
    },
    addressFrom: {
      id: 'ta.eft.application:location.shortTerm.addressFrom',
      defaultMessage: 'Heimilisfang/staðsetning',
      description: 'Address from label',
    },
    postalCodeAndCityFrom: {
      id: 'ta.eft.application:location.shortTerm.postalCodeAndCityFrom',
      defaultMessage: 'Póstnúmer og sveitarfélag',
      description: 'Postal code and city from label',
    },
    toSubtitle: {
      id: 'ta.eft.application:location.shortTerm.toSubtitle',
      defaultMessage: 'Áfangastaður',
      description: 'Location to subtitle',
    },
    addressTo: {
      id: 'ta.eft.application:location.shortTerm.addressTo',
      defaultMessage: 'Heimilisfang/staðsetning',
      description: 'Address to label',
    },
    postalCodeAndCityTo: {
      id: 'ta.eft.application:location.shortTerm.postalCodeAndCityTo',
      defaultMessage: 'Póstnúmer og sveitarfélag',
      description: 'Postal code and city to label',
    },
    directions: {
      id: 'ta.eft.application:location.shortTerm.directions',
      defaultMessage: 'Leiðarlýsing',
      description: 'Location directions label',
    },
    directionsPlaceholder: {
      id: 'ta.eft.application:location.shortTerm.directionsPlaceholder',
      defaultMessage:
        '- Leið 49 til Suðurlandsvegur/Þjóðvegur 1.\n- Taktu afreinina Vík/Hveragerði frá leið 49.\n- Fylgdu Þjóðvegur 1 og Suðurlandsvegur til Eyrarbakkavegur/Eyravegur/leið 34 í Selfoss.\n- Haltu áfram á Eyrarbakkavegur/Eyravegur/Leið 34. Aktu Suðurhólar til Hólastekkur.',
      description: 'Location directions placeholder',
    },
  }),
  longTerm: defineMessages({
    regionsSubtitle: {
      id: 'ta.eft.application:location.longTerm.regionsSubtitle',
      defaultMessage:
        'Veljið svæði, gefið leiðarlýsingu eða bæði sem undanþágan á að gilda á',
      description: 'Location regions subtitle',
    },
    regions: {
      id: 'ta.eft.application:location.longTerm.addressFrom',
      defaultMessage: 'Svæði',
      description: 'Regions label',
    },
    regionsPlaceholder: {
      id: 'ta.eft.application:location.longTerm.regionsPlaceholder',
      defaultMessage: 'Veldu svæði',
      description: 'Regions placeholder',
    },
    directions: {
      id: 'ta.eft.application:location.longTerm.directions',
      defaultMessage: 'Leiðarlýsing',
      description: 'Location directions label',
    },
    directionsPlaceholder: {
      id: 'ta.eft.application:location.longTerm.directionsPlaceholder',
      defaultMessage:
        'Placerat odio risus purus feugiat metus tortor mauris ullamcorper. Nisi et enim in nunc. Quam vel vulputate adipiscing risus nec. Urna aenean integer ac magna ipsum odio nam vestibulum. Ac mauris dictum eget mi et. Sed tellus fermentum dignissim tortor mi duis aenean pharetra. Leo aliquam enim fusce maecenas facilisis adipiscing. Ipsum.',
      description: 'Location directions placeholder',
    },
    fileUploadHeader: {
      id: 'ta.eft.application:location.longTerm.fileUploadHeader',
      defaultMessage: 'Dragðu inn fylgisköl, sem dæmi umsögn byggingafulltrúa',
      description: 'Location file upload header',
    },
    fileUploadDescription: {
      id: 'ta.eft.application:location.longTerm.fileUploadDescription',
      defaultMessage: 'Tekið er við skjölum með endingu: {allowedTypes}',
      description: 'Location file upload description',
    },
    fileUploadButtonLabel: {
      id: 'ta.eft.application:location.longTerm.fileUploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Location file upload button label',
    },
  }),
  regionOptions: defineMessages({
    SOUTH_WEST: {
      id: 'ta.eft.application:location.regionOptions.SOUTH_WEST',
      defaultMessage: 'Suðvesturland',
      description: 'South west option',
    },
    WESTFJORDS_NORTH: {
      id: 'ta.eft.application:location.regionOptions.WESTFJORDS_NORTH',
      defaultMessage: 'Vestfirðir norður',
      description: 'Westfjords north option',
    },
    WESTFJORDS_SOUTH: {
      id: 'ta.eft.application:location.regionOptions.WESTFJORDS_SOUTH',
      defaultMessage: 'Vestfirðir suður',
      description: 'Westfjords south option',
    },
    NORTH_WEST: {
      id: 'ta.eft.application:location.regionOptions.NORTH_WEST',
      defaultMessage: 'Norðurlandvestra',
      description: 'North west option',
    },
    NORTH_EAST: {
      id: 'ta.eft.application:location.regionOptions.NORTH_EAST',
      defaultMessage: 'Norðurlandeystra',
      description: 'North east option',
    },
    EAST: {
      id: 'ta.eft.application:location.regionOptions.EAST',
      defaultMessage: 'Austurland',
      description: 'East option',
    },
    OTHER: {
      id: 'ta.eft.application:location.regionOptions.OTHER',
      defaultMessage: 'Annað',
      description: 'Other option',
    },
  }),
}
