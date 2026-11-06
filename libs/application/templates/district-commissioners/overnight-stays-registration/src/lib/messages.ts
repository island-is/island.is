import { defineMessages } from 'react-intl'

export const applicationMessages = defineMessages({
  name: {
    id: 'osr.application:name',
    defaultMessage: 'Skráning á nýtingu gistinátta',
    description: 'Name of the application',
  },
  institutionName: {
    id: 'osr.application:institutionName',
    defaultMessage: 'Sýslumenn',
    description: `Institution's name`,
  },
  homeLodgingSectionTitle: {
    id: 'osr.application:homeLodgingSectionTitle',
    defaultMessage: 'Heimagisting',
    description: 'Title of the home lodging section',
  },
  homeLodgingInfoTitle: {
    id: 'osr.application:homeLodgingInfoTitle',
    defaultMessage: 'Athugið',
    description: 'Title of the info box on the home lodging screen',
  },
  homeLodgingInfoMessage: {
    id: 'osr.application:homeLodgingInfoMessage',
    defaultMessage:
      'Þú þarft að skila yfirliti yfir hvert ár sem heimagistingarnúmer er virkt, líka þegar engin nýting var. Aðeins er hægt að skrá eina eign í einu.',
    description: 'Body of the info box on the home lodging screen',
  },
  yearSelectionTitle: {
    id: 'osr.application:yearSelectionTitle',
    defaultMessage: 'Veldu ár sem þú ætlar að skrá',
    description: 'Heading above the year selector',
  },
  grantYearTitle: {
    id: 'osr.application:grantYearTitle',
    defaultMessage: 'Ártal',
    description: 'Year selector title',
  },
  yearPlaceholder: {
    id: 'osr.application:yearPlaceholder',
    defaultMessage: 'Veldu ár',
    description: 'Year selector placeholder',
  },
  submittedYearLabel: {
    id: 'osr.application:submittedYearLabel',
    defaultMessage: '{year} (hefur verið skilað)',
    description: 'Label for a year where every home lodging was submitted',
  },
  noOvernightStaysLabel: {
    id: 'osr.application:noOvernightStaysLabel',
    defaultMessage: 'Engar gistinætur þetta ár',
    description: 'Label of the no overnight stays checkbox',
  },
  homeLodgingSelectionTitle: {
    id: 'osr.application:homeLodgingSelectionTitle',
    defaultMessage: 'Veldu gistingu sem þú ætlar að skrá nýtingu fyrir',
    description: 'Heading above the home lodging radio buttons',
  },
  homeLodgingSelectYearFirst: {
    id: 'osr.application:homeLodgingSelectYearFirst',
    defaultMessage: 'Veldu ártal til að sjá skráðar gistingar.',
    description: 'Shown before a year has been selected',
  },
  homeLodgingNoneForYear: {
    id: 'osr.application:homeLodgingNoneForYear',
    defaultMessage: 'Engin gisting er skráð á valið ár.',
    description: 'Shown when no lodgings exist for the selected year',
  },
  homeLodgingAlreadySubmitted: {
    id: 'osr.application:homeLodgingAlreadySubmitted',
    defaultMessage:
      'Þegar hefur verið skilað yfirliti fyrir þessa gistingu á völdu ári.',
    description: 'Tooltip for lodgings that have already been submitted',
  },
  homeLodgingRequired: {
    id: 'osr.application:homeLodgingRequired',
    defaultMessage: 'Veldu gistingu sem þú ætlar að skrá nýtingu fyrir.',
    description: 'Validation message when no lodging is selected',
  },
  advertisementTitle: {
    id: 'osr.application:advertisementTitle',
    defaultMessage: 'Auglýsing heimagistingar',
    description: 'Heading of the advertisement part of the screen',
  },
  advertisementDescription: {
    id: 'osr.application:advertisementDescription',
    defaultMessage:
      'Settu inn hlekki á þær síður þar sem heimagistingin er auglýst, til dæmis Airbnb, Booking.com eða eigin heimasíðu.',
    description: 'Description of the advertisement part of the screen',
  },
  noActiveAdvertisementLabel: {
    id: 'osr.application:noActiveAdvertisementLabel',
    defaultMessage:
      'Það er ekki til virkur hlekkur fyrir eignina að svo stöddu',
    description: 'Label of the no active advertisement checkbox',
  },
  advertisementUrlLabel: {
    id: 'osr.application:advertisementUrlLabel',
    defaultMessage: 'Hlekkur á gistingu',
    description: 'Label of an advertisement url input',
  },
  advertisementUrlPlaceholder: {
    id: 'osr.application:advertisementUrlPlaceholder',
    defaultMessage: 'https://',
    description: 'Placeholder of an advertisement url input',
  },
  addAdvertisementLink: {
    id: 'osr.application:addAdvertisementLink',
    defaultMessage: 'Bæta við hlekk',
    description: 'Label of the button that adds another advertisement url',
  },
  advertisementRequired: {
    id: 'osr.application:advertisementRequired',
    defaultMessage:
      'Skráðu hlekk eða merktu við að enginn virkur hlekkur sé til.',
    description: 'Validation message when no advertisement has been provided',
  },
  advertisementInvalidUrl: {
    id: 'osr.application:advertisementInvalidUrl',
    defaultMessage: 'Sláðu inn gildan hlekk, til dæmis https://booking.com.',
    description: 'Validation message for an invalid advertisement url',
  },
  monthlyPricingOption: {
    id: 'osr.application:monthlyPricingOption',
    defaultMessage: 'Heildarupphæð á mánuði',
    description: 'Label for pricing overnight stays by month',
  },
  perVisitPricingOption: {
    id: 'osr.application:perVisitPricingOption',
    defaultMessage: 'Heildarupphæð á heimsókn',
    description: 'Label for pricing each visit separately',
  },
  pricingNoticeTitle: {
    id: 'osr.application:pricingNoticeTitle',
    defaultMessage: 'Vinsamlegast athugaðu',
    description: 'Title of the monthly pricing notice',
  },
  pricingNoticeMessage: {
    id: 'osr.application:pricingNoticeMessage',
    defaultMessage:
      'Í þeim tilfellum þar sem gistitímabil fer yfir mánaðamót þarf upphæðin að skiptast á milli þeirra mánaða sem það tímabil tilheyrir.',
    description: 'Explanation shown when a stay crosses a month boundary',
  },
  pricingNoticePeriods: {
    id: 'osr.application:pricingNoticePeriods',
    defaultMessage: 'Skoðaðu gistingar í {periods}.',
    description: 'Month pairs that cross month boundaries',
  },
  pricingMonthBoundaryTooltip: {
    id: 'osr.application:pricingMonthBoundaryTooltip',
    defaultMessage: 'Athugaðu að gistinætur ná yfir mánaðamót.',
    description: 'Tooltip for monthly night counts spanning month boundaries',
  },
  pricingPrefillTitle: {
    id: 'osr.application:pricingPrefillTitle',
    defaultMessage: 'Breyta í mánaðarupphæðir',
    description:
      'Title of the conversion suggestion shown for stale per-visit amounts',
  },
  pricingPrefillMessage: {
    id: 'osr.application:pricingPrefillMessage',
    defaultMessage:
      'Upphæðum á heimsókn verður breytt í heildarupphæðir á mánuði. Skráðar upphæðir á heimsókn verða fjarlægðar og ekki er hægt að breyta mánaðarupphæðum sjálfkrafa aftur í upphæðir á heimsókn.',
    description: 'Explanation of the one-way conversion from per-visit amounts',
  },
  pricingConvertTitle: {
    id: 'osr.application:pricingConvertTitle',
    defaultMessage: 'Breyta í mánaðarupphæðir?',
    description: 'Title of the confirmation for converting visit amounts',
  },
  pricingConvertMessage: {
    id: 'osr.application:pricingConvertMessage',
    defaultMessage:
      'Upphæðum á heimsókn verður breytt í heildarupphæðir á mánuði. Upphæðum gistitímabila sem ná yfir mánaðamót er skipt hlutfallslega eftir fjölda gistinátta. Skráðar upphæðir á heimsókn verða síðan fjarlægðar.',
    description: 'Confirmation text for converting visit amounts to months',
  },
  pricingConvertButton: {
    id: 'osr.application:pricingConvertButton',
    defaultMessage: 'Breyta í mánaðarupphæðir',
    description: 'Button that converts per-visit amounts to monthly amounts',
  },
  pricingPerVisitSwitchTitle: {
    id: 'osr.application:pricingPerVisitSwitchTitle',
    defaultMessage: 'Breyta í upphæð á heimsókn?',
    description: 'Title of the confirmation for switching to per-visit amounts',
  },
  pricingPerVisitSwitchMessage: {
    id: 'osr.application:pricingPerVisitSwitchMessage',
    defaultMessage:
      'Skráðar mánaðarupphæðir verða fjarlægðar. Ekki er hægt að skipta þeim sjálfkrafa niður á heimsóknir og því þarf að skrá upphæð fyrir hverja heimsókn aftur.',
    description: 'Confirmation text for switching to per-visit amounts',
  },
  pricingPerVisitSwitchButton: {
    id: 'osr.application:pricingPerVisitSwitchButton',
    defaultMessage: 'Byrja skráningu á heimsókn',
    description: 'Button confirming the switch to per-visit amounts',
  },
  pricingPerVisitSplitMessage: {
    id: 'osr.application:pricingPerVisitSplitMessage',
    defaultMessage:
      'Upphæðum gistitímabila sem ná yfir mánaðamót er skipt sjálfkrafa á milli mánaðanna, hlutfallslega eftir fjölda gistinátta.',
    description:
      'Explanation of the automatic month split used for per-visit amounts',
  },
  pricingTitle: {
    id: 'osr.application:pricingTitle',
    defaultMessage: 'Verð gistinótta árið {year}',
    description: 'Title above the pricing rows',
  },
  pricingDescription: {
    id: 'osr.application:pricingDescription',
    defaultMessage:
      'Skráðu tekjur af útleigu. Heildarupphæð á að innihalda allan kostnað svo sem þrifa- eða þjónustugjöld.',
    description: 'Description above the pricing rows',
  },
  pricingPeriodLabel: {
    id: 'osr.application:pricingPeriodLabel',
    defaultMessage: 'Tímabil',
    description: 'Label for a pricing period',
  },
  pricingNightsLabel: {
    id: 'osr.application:pricingNightsLabel',
    defaultMessage: 'Gistinætur',
    description: 'Label for the number of nights',
  },
  pricingAmountLabel: {
    id: 'osr.application:pricingAmountLabel',
    defaultMessage: 'Upphæð',
    description: 'Label for a rental income amount',
  },
  pricingAmountRequired: {
    id: 'osr.application:pricingAmountRequired',
    defaultMessage: 'Skrá þarf leigutekjur.',
    description: 'Error shown when a rental income amount is missing',
  },
  pricingAmountInvalid: {
    id: 'osr.application:pricingAmountInvalid',
    defaultMessage: 'Leigutekjur mega ekki vera neikvæðar.',
    description:
      'Error shown when a rental income amount is not a valid number',
  },
  pricingNoStays: {
    id: 'osr.application:pricingNoStays',
    defaultMessage:
      'Engar gistinætur eru skráðar árið {year} og því þarf ekki að skrá leigutekjur.',
    description: 'Shown when no overnight stays are registered',
  },
  pricingSelectDatesFirst: {
    id: 'osr.application:pricingSelectDatesFirst',
    defaultMessage: 'Veldu fyrst gistinætur í tímabilsskrefinu.',
    description: 'Shown when pricing has no selected dates',
  },
  overnightStaySectionTitle: {
    id: 'osr.application:overnightStaySectionTitle',
    defaultMessage: 'Skrá gistinætur',
    description: 'Title of the overnight stay registration section',
  },
  overnightStaySectionDescription: {
    id: 'osr.application:overnightStaySectionDescription',
    defaultMessage:
      'Veldu árið sem þú skilar fyrir. Þú skilar inn einu ári í einu og getur skilað aftur í tímann til ársins 2017. Ár sem þú hefur þegar skilað, eða ár þar sem eignin var ekki á skrá, eru óvirk.',
    description: 'Description shown on overnight stay registration screens',
  },
  periodSubsectionTitle: {
    id: 'osr.application:periodSubsectionTitle',
    defaultMessage: 'Tímabil',
    description: 'Title of the period subsection',
  },
  priceSubsectionTitle: {
    id: 'osr.application:priceSubsectionTitle',
    defaultMessage: 'Verð',
    description: 'Title of the price subsection',
  },
  commentsTitle: {
    id: 'osr.application:commentsTitle',
    defaultMessage: 'Athugasemdir',
    description: 'Title for comments',
  },
  commentsDescription: {
    id: 'osr.application:commentsDescription',
    defaultMessage:
      'Ef þú vilt koma á framfæri athugasemdum eða frekari útskýringum á nýtingu þinna gistinátta geturðu gert það hér.',
    description: 'Description above the comments input',
  },
  commentsInputTitle: {
    id: 'osr.application:commentsInputTitle',
    defaultMessage: 'Þín athugasemd',
    description: 'Label for the comments input',
  },
  calendarTitle: {
    id: 'osr.application:calendarTitle',
    defaultMessage: 'Gistinætur árið {year}',
    description: 'Title above the annual overnight stay calendar',
  },
  calendarDescription: {
    id: 'osr.application:calendarDescription',
    defaultMessage:
      'Smelltu á upphafsdag og svo á lokadag til að velja tímabil. Dagarnir á milli veljast sjálfkrafa. Smelltu á valið tímabil til að fjarlægja það.',
    description: 'Instructions for selecting date ranges',
  },
  calendarRequired: {
    id: 'osr.application:calendarRequired',
    defaultMessage:
      'Veldu gistinætur eða merktu við að engar gistinætur séu skráðar á fyrsta skrefi.',
    description: 'Validation message when no overnight dates are selected',
  },
  calendarDayAriaLabel: {
    id: 'osr.application:calendarDayAriaLabel',
    defaultMessage: '{day}. {month} {year}',
    description: 'Accessible label for a calendar day',
  },
  calendarKeyboardInstructions: {
    id: 'osr.application:calendarKeyboardInstructions',
    defaultMessage:
      'Notaðu örvatakkana til að fara á milli daga. Ýttu á bilslá eða Enter til að velja dag.',
    description: 'Keyboard instructions for the annual calendar',
  },
  calendarRangeStartSelected: {
    id: 'osr.application:calendarRangeStartSelected',
    defaultMessage: 'Upphafsdagur {date} valinn. Veldu lokadag.',
    description: 'Screen reader announcement after selecting a range start',
  },
  calendarRangeSelected: {
    id: 'osr.application:calendarRangeSelected',
    defaultMessage: 'Tímabil frá {from} til {to} valið.',
    description: 'Screen reader announcement after selecting a date range',
  },
  calendarRangeRemoved: {
    id: 'osr.application:calendarRangeRemoved',
    defaultMessage: 'Tímabil fjarlægt.',
    description: 'Screen reader announcement after removing a date range',
  },
  propertyNotFound: {
    id: 'osr.application:propertyNotFound',
    defaultMessage: 'Engin heimagisting fannst fyrir valið ár.',
    description: 'Shown when the selected home lodging cannot be found',
  },
  propertyNumber: {
    id: 'osr.application:propertyNumber',
    defaultMessage: 'Fasteign nr. {number}',
    description: 'Property number label and value',
  },
  unitNumber: {
    id: 'osr.application:unitNumber',
    defaultMessage: 'Íbúð: {number}',
    description: 'Unit number label and value',
  },
  guestCount: {
    id: 'osr.application:guestCount',
    defaultMessage: 'Gestir: {count}',
    description: 'Guest count label and value',
  },
  roomCount: {
    id: 'osr.application:roomCount',
    defaultMessage: 'Herbergi: {count}',
    description: 'Room count label and value',
  },
  overviewDescription: {
    id: 'osr.application:overviewDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
    description: 'Description above the application overview',
  },
  confirmButton: {
    id: 'osr.application:confirmButton',
    defaultMessage: 'Staðfesta',
    description: 'Confirmation action label',
  },
  overviewHomeLodgingTitle: {
    id: 'osr.application:overviewHomeLodgingTitle',
    defaultMessage: 'Heimagisting {year}',
    description: 'Home lodging overview heading',
  },
  overviewRegistrationTitle: {
    id: 'osr.application:overviewRegistrationTitle',
    defaultMessage: 'Skráning gistinátta {year}',
    description: 'Overnight stay overview heading',
  },
  propertyNameLabel: {
    id: 'osr.application:propertyNameLabel',
    defaultMessage: 'Heiti',
    description: 'Property name label',
  },
  registrationNumberLabel: {
    id: 'osr.application:registrationNumberLabel',
    defaultMessage: 'Skráningarnúmer',
    description: 'Registration number label',
  },
  postalCodeAndCityLabel: {
    id: 'osr.application:postalCodeAndCityLabel',
    defaultMessage: 'Póstnúmer og staður',
    description: 'Postal code and city label',
  },
  noActiveAdvertisementOverview: {
    id: 'osr.application:noActiveAdvertisementOverview',
    defaultMessage: 'Enginn virkur hlekkur er til fyrir eignina að svo stöddu.',
    description: 'Shown in the overview when no advertisement URL exists',
  },
  noStaysOverview: {
    id: 'osr.application:noStaysOverview',
    defaultMessage: 'Engar gistinætur voru skráðar þetta ár.',
    description: 'Shown in the overview when no stays were registered',
  },
  overviewNights: {
    id: 'osr.application:overviewNights',
    defaultMessage: 'Gistinætur: {count}',
    description: 'Night count in the overview',
  },
  overviewAmount: {
    id: 'osr.application:overviewAmount',
    defaultMessage: 'Samtals upphæð: {amount}',
    description: 'Rental income amount in the overview',
  },
  overviewTotal: {
    id: 'osr.application:overviewTotal',
    defaultMessage: 'Samtals alls:',
    description: 'Grand total heading in the overview',
  },
  overviewComment: {
    id: 'osr.application:overviewComment',
    defaultMessage: 'Athugasemd',
    description: 'Comment heading in the overview',
  },
  prerequisitesTitle: {
    id: 'osr.application:prerequisitesTitle',
    defaultMessage: 'Forkröfur',
    description: 'Prerequisites section title',
  },
  dataCollectionTitle: {
    id: 'osr.application:dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'External data collection title',
  },
  dataCollectionSubtitle: {
    id: 'osr.application:dataCollectionSubtitle',
    defaultMessage:
      'Gögn eru sótt úr Þjóðskrá og notendaprófíli innskráðs notanda.',
    description: 'External data collection description',
  },
  dataCollectionConsent: {
    id: 'osr.application:dataCollectionConsent',
    defaultMessage: 'Ég samþykki að þessi gögn séu sótt.',
    description: 'External data collection consent label',
  },
  nationalRegistryTitle: {
    id: 'osr.application:nationalRegistryTitle',
    defaultMessage: 'Þjóðskrá',
    description: 'National Registry provider title',
  },
  nationalRegistrySubtitle: {
    id: 'osr.application:nationalRegistrySubtitle',
    defaultMessage: 'Nafn, kennitala og heimilisfang.',
    description: 'National Registry provider description',
  },
  userProfileTitle: {
    id: 'osr.application:userProfileTitle',
    defaultMessage: 'Mínar síður',
    description: 'User profile provider title',
  },
  userProfileSubtitle: {
    id: 'osr.application:userProfileSubtitle',
    defaultMessage: 'Netfang og símanúmer.',
    description: 'User profile provider description',
  },
  homeLodgingsProviderTitle: {
    id: 'osr.application:homeLodgingsProviderTitle',
    defaultMessage: 'Heimagistingar',
    description: 'Home lodgings provider title',
  },
  homeLodgingsProviderSubtitle: {
    id: 'osr.application:homeLodgingsProviderSubtitle',
    defaultMessage:
      'Heimagistingarnúmer, ár og upplýsingar um skráðar fasteignir.',
    description: 'Home lodgings provider description',
  },
  completionTitle: {
    id: 'osr.application:completionTitle',
    defaultMessage: 'Staðfesting',
    description: 'Completion screen title',
  },
  completionAlertTitle: {
    id: 'osr.application:completionAlertTitle',
    defaultMessage: 'Sýslumaður hefur móttekið skráningu um gistinætur',
    description: 'Completion alert title',
  },
  completionAlertMessage: {
    id: 'osr.application:completionAlertMessage',
    defaultMessage:
      'Við sendum þér tilkynningu í tölvupósti um skilaboð á Mínum síðum ef þörf er á frekari gögnum eða þegar umsókn þín hefur verið afgreidd.',
    description: 'Completion alert message',
  },
  completionNextStepsTitle: {
    id: 'osr.application:completionNextStepsTitle',
    defaultMessage: 'Hvað gerist næst?',
    description: 'Next steps expandable heading',
  },
  completionNextStepsIntro: {
    id: 'osr.application:completionNextStepsIntro',
    defaultMessage:
      'Sýslumaður fer yfir skráninguna og hefur samband ef frekari upplýsingar vantar.',
    description: 'Next steps introduction',
  },
  completionNextStepsDescription: {
    id: 'osr.application:completionNextStepsDescription',
    defaultMessage:
      '- Skráningin er yfirfarin.\n- Þú færð tilkynningu á Mínum síðum þegar afgreiðslu er lokið.',
    description: 'Next steps list',
  },
  completionHelpTitle: {
    id: 'osr.application:completionHelpTitle',
    defaultMessage: 'Er eitthvað óljóst?',
    description: 'Completion help heading',
  },
  completionHelpDescription: {
    id: 'osr.application:completionHelpDescription',
    defaultMessage: 'Skoðaðu nánari upplýsingar á upplýsingasíðu Sýslumanns.',
    description: 'Completion help description',
  },
  completionContinueButton: {
    id: 'osr.application:completionContinueButton',
    defaultMessage: 'Áfram',
    description: 'Completion continue button label',
  },
  completionBottomMessage: {
    id: 'osr.application:completionBottomMessage',
    defaultMessage:
      'Á mínum síðum og í appi getur þú nálgast margvíslegar upplýsingar um stöðu þína varðandi heimagistingu.',
    description: 'Completion screen bottom message',
  },
  yearRequired: {
    id: 'osr.application:yearRequired',
    defaultMessage: 'Ár er krafist',
    description: 'Validation message when year is missing',
  },
  homeLodgingSchemaRequired: {
    id: 'osr.application:homeLodgingSchemaRequired',
    defaultMessage: 'Heimagisting er nauðsynleg',
    description: 'Validation message when home lodging is missing',
  },
  prerequisitesStateName: {
    id: 'osr.application:prerequisitesStateName',
    defaultMessage: 'Skilyrði',
    description: 'Prerequisites state name',
  },
  draftStateName: {
    id: 'osr.application:draftStateName',
    defaultMessage: 'Umsókn',
    description: 'Draft state name',
  },
  completedStateName: {
    id: 'osr.application:completedStateName',
    defaultMessage: 'Staðfesting',
    description: 'Completed state name',
  },
  january: {
    id: 'osr.application:january',
    defaultMessage: 'Janúar',
    description: 'January',
  },
  february: {
    id: 'osr.application:february',
    defaultMessage: 'Febrúar',
    description: 'February',
  },
  march: {
    id: 'osr.application:march',
    defaultMessage: 'Mars',
    description: 'March',
  },
  april: {
    id: 'osr.application:april',
    defaultMessage: 'Apríl',
    description: 'April',
  },
  may: {
    id: 'osr.application:may',
    defaultMessage: 'Maí',
    description: 'May',
  },
  june: {
    id: 'osr.application:june',
    defaultMessage: 'Júní',
    description: 'June',
  },
  july: {
    id: 'osr.application:july',
    defaultMessage: 'Júlí',
    description: 'July',
  },
  august: {
    id: 'osr.application:august',
    defaultMessage: 'Ágúst',
    description: 'August',
  },
  september: {
    id: 'osr.application:september',
    defaultMessage: 'September',
    description: 'September',
  },
  october: {
    id: 'osr.application:october',
    defaultMessage: 'Október',
    description: 'October',
  },
  november: {
    id: 'osr.application:november',
    defaultMessage: 'Nóvember',
    description: 'November',
  },
  december: {
    id: 'osr.application:december',
    defaultMessage: 'Desember',
    description: 'December',
  },
  mondayShort: {
    id: 'osr.application:mondayShort',
    defaultMessage: 'Mán',
    description: 'Short Monday name',
  },
  tuesdayShort: {
    id: 'osr.application:tuesdayShort',
    defaultMessage: 'Þri',
    description: 'Short Tuesday name',
  },
  wednesdayShort: {
    id: 'osr.application:wednesdayShort',
    defaultMessage: 'Mið',
    description: 'Short Wednesday name',
  },
  thursdayShort: {
    id: 'osr.application:thursdayShort',
    defaultMessage: 'Fim',
    description: 'Short Thursday name',
  },
  fridayShort: {
    id: 'osr.application:fridayShort',
    defaultMessage: 'Fös',
    description: 'Short Friday name',
  },
  saturdayShort: {
    id: 'osr.application:saturdayShort',
    defaultMessage: 'Lau',
    description: 'Short Saturday name',
  },
  sundayShort: {
    id: 'osr.application:sundayShort',
    defaultMessage: 'Sun',
    description: 'Short Sunday name',
  },
  applicantName: {
    id: 'osr.application:applicantName',
    defaultMessage: 'Nafn',
    description: 'Applicant full name label',
  },
  nationalId: {
    id: 'osr.application:nationalId',
    defaultMessage: 'Kennitala',
    description: 'Applicant national id label',
  },
  address: {
    id: 'osr.application:address',
    defaultMessage: 'Heimilisfang',
    description: 'Applicant address label',
  },
  email: {
    id: 'osr.application:email',
    defaultMessage: 'Netfang',
    description: 'Applicant email label',
  },
  phoneNumber: {
    id: 'osr.application:phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Applicant phone label',
  },
  overviewTitle: {
    id: 'osr.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: 'Overview title',
  },
})

export const monthMessages = [
  applicationMessages.january,
  applicationMessages.february,
  applicationMessages.march,
  applicationMessages.april,
  applicationMessages.may,
  applicationMessages.june,
  applicationMessages.july,
  applicationMessages.august,
  applicationMessages.september,
  applicationMessages.october,
  applicationMessages.november,
  applicationMessages.december,
]

export const weekdayMessages = [
  applicationMessages.mondayShort,
  applicationMessages.tuesdayShort,
  applicationMessages.wednesdayShort,
  applicationMessages.thursdayShort,
  applicationMessages.fridayShort,
  applicationMessages.saturdayShort,
  applicationMessages.sundayShort,
]
