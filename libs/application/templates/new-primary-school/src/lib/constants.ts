import { DefaultEvents } from '@island.is/application/types'

export enum Actions {
  SEND_APPLICATION = 'sendApplication',
}
export const enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export type Option = {
  value: string
  label: string
}

export enum RelationOptions {
  GRANDPARENT = 'grandparent',
  SIBLING = 'sibling',
  STEPPARENT = 'stepparent',
  RELATIVE = 'relative',
  FRIEND_OR_OTHER = 'friendOrOther',
}

export enum ReasonForApplicationOptions {
  TRANSFER_OF_LEGAL_DOMICILE = 'transferOfLegalDomicile',
  STUDY_STAY_FOR_PARENTS = 'studyStayForParents',
  PARENTS_PARLIAMENTARY_MEMBERSHIP = 'parentsParliamentaryMembership',
  TEMPORARY_FROSTER = 'temporaryFoster',
  EXPERT_SERVICE = 'expertService',
  SICKLY = 'sickly',
  LIVES_IN_TWO_HOMES = 'livesInTwoHomes',
  SIBLINGS_IN_THE_SAME_PRIMARY_SCHOOL = 'siblingsInTheSamePrimarySchool',
  MOVING_ABROAD = 'movingAbroad',
  OTHER_REASONS = 'otherReasons',
}

export enum SiblingRelationOptions {
  SIBLING = 'Sibling',
  HALF_SIBLING = 'halfSibling',
  STEP_SIBLING = 'stepSibling',
}

export enum FoodAllergiesOptions {
  EGG_ALLERGY = 'eggAllergy',
  FISH_ALLERGY = 'fishAllergy',
  PENUT_ALLERGY = 'peanutAllergy',
  WHEAT_ALLERGY = 'wheatAllergy',
  MILK_ALLERGY = 'milkAllergy',
  OTHER = 'other',
}

export enum FoodIntolerancesOptions {
  LACTOSE_INTOLERANCE = 'lactoseIntolerance',
  GLUTEN_INTOLERANCE = 'glutenIntolerance',
  MSG_INTOLERANCE = 'msgIntolerance',
  OTHER = 'other',
}

export interface Language {
  code: string
  name: string
}

// TODO: Hvar eigum við að geyma þetta? (Sama og í Bjargey)
export const languageCodes: Language[] = [
  { code: 'is', name: 'Íslenska' },
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian - shqip' },
  { code: 'am', name: 'Amharic - አማርኛ' },
  { code: 'ar', name: 'Arabic - العربية' },
  { code: 'an', name: 'Aragonese - aragonés' },
  { code: 'hy', name: 'Armenian - հայերեն' },
  { code: 'ast', name: 'Asturian - asturianu' },
  { code: 'az', name: 'Azerbaijani - azərbaycan dili' },
  { code: 'eu', name: 'Basque - euskara' },
  { code: 'be', name: 'Belarusian - беларуская' },
  { code: 'bn', name: 'Bengali - বাংলা' },
  { code: 'bs', name: 'Bosnian - bosanski' },
  { code: 'br', name: 'Breton - brezhoneg' },
  { code: 'bg', name: 'Bulgarian - български' },
  { code: 'ca', name: 'Catalan - català' },
  { code: 'ckb', name: 'Central Kurdish - کوردی (دەستنوسی عەرەبی)' },
  { code: 'zh', name: 'Chinese - 中文' },
  { code: 'zh-HK', name: 'Chinese (Hong Kong) - 中文（香港）' },
  { code: 'zh-CN', name: 'Chinese (Simplified) - 中文（简体）' },
  { code: 'zh-TW', name: 'Chinese (Traditional) - 中文（繁體）' },
  { code: 'co', name: 'Corsican' },
  { code: 'hr', name: 'Croatian - hrvatski' },
  { code: 'cs', name: 'Czech - čeština' },
  { code: 'da', name: 'Danish - dansk' },
  { code: 'nl', name: 'Dutch - Nederlands' },
  { code: 'eo', name: 'Esperanto - esperanto' },
  { code: 'et', name: 'Estonian - eesti' },
  { code: 'fo', name: 'Faroese - føroyskt' },
  { code: 'fil', name: 'Filipino' },
  { code: 'fi', name: 'Finnish - suomi' },
  { code: 'fr', name: 'French - français' },
  { code: 'fr-CA', name: 'French (Canada) - français (Canada)' },
  { code: 'fr-FR', name: 'French (France) - français (France)' },
  { code: 'fr-CH', name: 'French (Switzerland) - français (Suisse)' },
  { code: 'gl', name: 'Galician - galego' },
  { code: 'ka', name: 'Georgian - ქართული' },
  { code: 'de', name: 'German - Deutsch' },
  { code: 'de-AT', name: 'German (Austria) - Deutsch (Österreich)' },
  { code: 'de-DE', name: 'German (Germany) - Deutsch (Deutschland)' },
  { code: 'de-LI', name: 'German (Liechtenstein) - Deutsch (Liechtenstein)' },
  { code: 'de-CH', name: 'German (Switzerland) - Deutsch (Schweiz)' },
  { code: 'el', name: 'Greek - Ελληνικά' },
  { code: 'gn', name: 'Guarani' },
  { code: 'gu', name: 'Gujarati - ગુજરાતી' },
  { code: 'ha', name: 'Hausa' },
  { code: 'haw', name: 'Hawaiian - ʻŌlelo Hawaiʻi' },
  { code: 'he', name: 'Hebrew - עברית' },
  { code: 'hi', name: 'Hindi - हिन्दी' },
  { code: 'hu', name: 'Hungarian - magyar' },
  { code: 'id', name: 'Indonesian - Indonesia' },
  { code: 'ia', name: 'Interlingua' },
  { code: 'ga', name: 'Irish - Gaeilge' },
  { code: 'it', name: 'Italian - italiano' },
  { code: 'it-IT', name: 'Italian (Italy) - italiano (Italia)' },
  { code: 'it-CH', name: 'Italian (Switzerland) - italiano (Svizzera)' },
  { code: 'ja', name: 'Japanese - 日本語' },
  { code: 'kn', name: 'Kannada - ಕನ್ನಡ' },
  { code: 'kk', name: 'Kazakh - қазақ тілі' },
  { code: 'km', name: 'Khmer - ខ្មែរ' },
  { code: 'ko', name: 'Korean - 한국어' },
  { code: 'ku', name: 'Kurdish - Kurdî' },
  { code: 'ky', name: 'Kyrgyz - кыргызча' },
  { code: 'lo', name: 'Lao - ລາວ' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian - latviešu' },
  { code: 'ln', name: 'Lingala - lingála' },
  { code: 'lt', name: 'Lithuanian - lietuvių' },
  { code: 'mk', name: 'Macedonian - македонски' },
  { code: 'ms', name: 'Malay - Bahasa Melayu' },
  { code: 'ml', name: 'Malayalam - മലയാളം' },
  { code: 'mt', name: 'Maltese - Malti' },
  { code: 'mr', name: 'Marathi - मराठी' },
  { code: 'mn', name: 'Mongolian - монгол' },
  { code: 'ne', name: 'Nepali - नेपाली' },
  { code: 'no', name: 'Norwegian - norsk' },
  { code: 'nb', name: 'Norwegian Bokmål - norsk bokmål' },
  { code: 'nn', name: 'Norwegian Nynorsk - nynorsk' },
  { code: 'oc', name: 'Occitan' },
  { code: 'or', name: 'Oriya - ଓଡ଼ିଆ' },
  { code: 'om', name: 'Oromo - Oromoo' },
  { code: 'ps', name: 'Pashto - پښتو' },
  { code: 'fa', name: 'Persian - فارسی' },
  { code: 'pt', name: 'Portuguese - português' },
  { code: 'pt-BR', name: 'Portuguese (Brazil) - português (Brasil)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal) - português (Portugal)' },
  { code: 'pa', name: 'Punjabi - ਪੰਜਾਬੀ' },
  { code: 'qu', name: 'Quechua' },
  { code: 'ro', name: 'Romanian - română' },
  { code: 'mo', name: 'Romanian (Moldova) - română (Moldova)' },
  { code: 'rm', name: 'Romansh - rumantsch' },
  { code: 'ru', name: 'Russian - русский' },
  { code: 'gd', name: 'Scottish Gaelic' },
  { code: 'sr', name: 'Serbian - српски' },
  { code: 'sh', name: 'Serbo-Croatian - Srpskohrvatski' },
  { code: 'sn', name: 'Shona - chiShona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhala - සිංහල' },
  { code: 'sk', name: 'Slovak - slovenčina' },
  { code: 'sl', name: 'Slovenian - slovenščina' },
  { code: 'so', name: 'Somali - Soomaali' },
  { code: 'st', name: 'Southern Sotho' },
  { code: 'es', name: 'Spanish - español' },
  { code: 'es-AR', name: 'Spanish (Argentina) - español (Argentina)' },
  { code: 'es-419', name: 'Spanish (Latin America) - español (Latinoamérica)' },
  { code: 'es-MX', name: 'Spanish (Mexico) - español (México)' },
  { code: 'es-ES', name: 'Spanish (Spain) - español (España)' },
  { code: 'es-US', name: 'Spanish (United States) - español (Estados Unidos)' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili - Kiswahili' },
  { code: 'sv', name: 'Swedish - svenska' },
  { code: 'tg', name: 'Tajik - тоҷикӣ' },
  { code: 'ta', name: 'Tamil - தமிழ்' },
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu - తెలుగు' },
  { code: 'th', name: 'Thai - ไทย' },
  { code: 'ti', name: 'Tigrinya - ትግርኛ' },
  { code: 'to', name: 'Tongan - lea fakatonga' },
  { code: 'tr', name: 'Turkish - Türkçe' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'tw', name: 'Twi' },
  { code: 'uk', name: 'Ukrainian - українська' },
  { code: 'ur', name: 'Urdu - اردو' },
  { code: 'ug', name: 'Uyghur' },
  { code: 'uz', name: 'Uzbek - o‘zbek' },
  { code: 'vi', name: 'Vietnamese - Tiếng Việt' },
  { code: 'wa', name: 'Walloon - wa' },
  { code: 'cy', name: 'Welsh - Cymraeg' },
  { code: 'fy', name: 'Western Frisian' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'yo', name: 'Yoruba - Èdè Yorùbá' },
  { code: 'zu', name: 'Zulu - isiZulu' },
]

export enum OptionsType {
  ALLERGRY = 'allergy',
  INTELERENCE = 'intolerence',
  REASON = 'rejectionReason',
}
