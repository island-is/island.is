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
    directionsSubtitle: {
      id: 'ta.eft.application:location.shortTerm.directionsSubtitle',
      defaultMessage: 'Leiðarlýsing',
      description: 'Location directions subtitle',
    },
    directionsDescription: {
      id: 'ta.eft.application:location.shortTerm.directionsDescription',
      defaultMessage:
        'Skrá þarf ítarlega leiðarlýsingu sem inniheldur númer og heiti allra vega á flutningsleið. Leiðarlýsing skal ná yfir alla þá vegi sem ekið er um frá upphafsstað flutningsins og allt til áfangastaðar. Hægt er að notast við gervigreind og kortavefi eins og ja.is eða Google maps til að finna leið og vegnúmer hverju sinni.',
      description: 'Location directions description',
    },
    directions: {
      id: 'ta.eft.application:location.shortTerm.directions',
      defaultMessage: 'Leiðarlýsing',
      description: 'Location directions label',
    },
    directionsPlaceholder: {
      id: 'ta.eft.application:location.shortTerm.directionsPlaceholder',
      defaultMessage:
        'Um Lambhagaveg, nr. 1 Hringveg, nr. 47 Hvalfjarðarveg, nr. 1 Hringveg, nr. 60 Vestfjarðarveg...',
      description: 'Location directions placeholder',
    },
  }),
  longTerm: defineMessages({
    regionsSubtitle: {
      id: 'ta.eft.application:location.longTerm.regionsSubtitle',
      defaultMessage:
        'Veljið svæði sem undanþágan á að gilda á. Ef það á ekki við er hægt að setja inn nákvæma lýsingu á því svæði eða þeim vegum sem óskað er eftir að undanþágan taki til',
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
      defaultMessage: 'Ósk um svæði',
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
      defaultMessage: 'Dragðu inn fylgiskjöl',
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
      defaultMessage: 'Norðurland vestra',
      description: 'North west option',
    },
    NORTH_EAST: {
      id: 'ta.eft.application:location.regionOptions.NORTH_EAST',
      defaultMessage: 'Norðurland eystra',
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
