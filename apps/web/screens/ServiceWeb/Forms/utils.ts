import { Organization, SupportCategory } from '@island.is/web/graphql/schema'

export enum SjukratryggingarCategories {
  // Ferðakostnaður
  FERDAKOSTNADUR = '5IetjgJbs6lgS5umDC6k17',

  // Heilbrigðisstarfsfólk
  HEILBRIGDISSTARFSFOLK = '1gYJuVaNKXXi5FXAFrEsCt',

  // Heilbrigðisþjónusta
  HEILBRIGDISTHJONUSTA = '5Q5c7YkbkHB1SFRTede9xK',

  // Hjálpartæki og næring
  HJALPARTAEKI_OG_NAERING = '5FHpqHHcLFxUdhvQS64DZJ',

  // Lyf og lyfjakostnaður
  LYF_OG_LYFJAKOSTNADUR = '1CcMQO8dHqkayO1IZu29P5',

  // Réttindi milli landa
  RETTINDI_MILLI_LANDA = '47vHdWS9R5VsTXHg5DMeS1',

  // Sjúkradagpeningar
  SJUKRADAGPENINGAR = 'njVZaaPHKlxconopmbPCf',

  // Slys og sjúklingatrygging
  SLYS_OG_SJUKLINGATRYGGING = '6o9o2bgfY6hYc4K77nyN4v',

  // Tannlækningar
  TANNLAEKNINGAR = '5MvO1XYR3iGlYDOg3kgsHD',

  // Vefgáttir
  VEFGATTIR = '34ELo2Zt3A6ynYdgZx72m',

  // Þjálfun
  THJALFUN = '2SvNHpvfhViaUTLDMQt0ZI',

  // Önnur þjónusta Sjúkratrygginga
  ONNUR_THJONUSTA_SJUKRATRYGGINGA = 'vVBHhkPz8AF9BEzLJsoZo',

  // Hjálpartæki
  HJALPARTAEKI = 'hjalpartaeki',

  // Næring
  NAERING = 'naering',

  // Slysatrygging
  SLYSATRYGGING = 'slysatrygging',

  // Sjúklingatrygging
  SJUKLINGATRYGGING = 'sjuklingatrygging',

  // Hjúkrunarheimili
  HJUKRUNARHEIMILI = 'hjukrunarheimili',

  // Túlkaþjónusta
  TULKATHJONUSTA = 'tulkathjonusta',
}

export enum DirectorateOfImmigrationCategories {
  // ALþjóðleg vernd
  INTERNATIONAL_PROTECTION = 'vURM4bLHZZefkRTFMMhkW',

  // Dvalarleyfiskort og ferðaskilríki
  RESIDENCE_PERMIT_CARDS_AND_TRAVEL_DOCUMENTS = '2Z8C7zKJPsAtsbjaClcCAg',

  // Dvalarleyfi - Almenn skilyrði
  RESIDENCE_PERMIT_GENERAL_CONDITIONS = '5HwuyKorz5r8xmk3UxLE1q',

  // Dvalarleyfi - Tegundir
  RESIDENCE_PERMIT_TYPES = '3Jrix29x8wFv5X0O7P0KsB',

  // Ferðalög og heimsóknir til Íslands
  TRAVEL_AND_VISITS_TO_ICELAND = '3jzNnjUIuZAIU2MCwzYi1Q',

  // Ríkisborgararéttur
  CITIZENSHIP = '2PdX8CTx3uiGFphBbbazzc',

  // Staða umsókna, beiðni um gögn og afgreiðslugjald
  APPLICATION_STATUS = '7s7yrJ8Nl1YmocagF93QB7',

  // Dvalarleyfi
  RESIDENCE_PERMIT = 'dvalarleyfi',

  // Aðstoð við sjálfviljuga heimför
  ASSISTED_VOLUNTARY_RETURN = 'adstod-vid-sjalfviljuga-heimfor',
}

export const filterSupportCategories = (
  supportCategories: SupportCategory[] | undefined,
  slug: string,
  organization: Organization | undefined,
  locale: string,
  namespace: Record<string, string> | undefined,
) => {
  if (slug === 'sjukratryggingar' || slug === 'icelandic-health-insurance') {
    return supportCategories
      ?.filter(
        (c) =>
          c?.id !== SjukratryggingarCategories.HJALPARTAEKI_OG_NAERING &&
          c?.id !== SjukratryggingarCategories.SLYS_OG_SJUKLINGATRYGGING,
      )
      .concat([
        {
          id: SjukratryggingarCategories.HJALPARTAEKI,
          importance: 0,
          __typename: 'SupportCategory',
          description: '',
          organization: organization,
          slug: SjukratryggingarCategories.HJALPARTAEKI,
          title:
            namespace?.['sjukratryggingarAssistiveDevices'] ||
            (locale === 'is' ? 'Hjálpartæki' : 'Assistive devices'),
        },
        {
          id: SjukratryggingarCategories.NAERING,
          importance: 0,
          __typename: 'SupportCategory',
          description: '',
          organization: organization,
          slug: SjukratryggingarCategories.NAERING,
          title:
            namespace?.['sjukratryggingarNutrition'] ||
            (locale === 'is' ? 'Næring' : 'Nutrition'),
        },
        {
          id: SjukratryggingarCategories.SLYSATRYGGING,
          importance: 0,
          __typename: 'SupportCategory',
          description: '',
          organization: organization,
          slug: SjukratryggingarCategories.SLYSATRYGGING,
          title:
            namespace?.['sjukratryggingarAccidentInsurance'] ||
            (locale === 'is' ? 'Slysatrygging' : 'Accident insurance'),
        },
        {
          id: SjukratryggingarCategories.SJUKLINGATRYGGING,
          importance: 0,
          __typename: 'SupportCategory',
          description: '',
          organization: organization,
          slug: SjukratryggingarCategories.SJUKLINGATRYGGING,
          title:
            namespace?.['sjukratryggingarPatientInsurance'] ||
            (locale === 'is' ? 'Sjúklingatrygging' : 'Patient insurance'),
        },
        {
          id: SjukratryggingarCategories.HJUKRUNARHEIMILI,
          importance: 0,
          __typename: 'SupportCategory',
          description: '',
          organization: organization,
          slug: SjukratryggingarCategories.HJUKRUNARHEIMILI,
          title:
            namespace?.['sjukratryggingarNursingHome'] ||
            (locale === 'is' ? 'Hjúkrunarheimili' : 'Nursing home'),
        },
        {
          id: SjukratryggingarCategories.TULKATHJONUSTA,
          importance: 0,
          __typename: 'SupportCategory',
          description: '',
          organization: organization,
          slug: SjukratryggingarCategories.TULKATHJONUSTA,
          title:
            namespace?.['sjukratryggingarInterpretationServices'] ||
            (locale === 'is' ? 'Túlkaþjónusta' : 'Interpretation services'),
        },
      ])
  }

  if (slug === 'utlendingastofnun' || slug === 'directorate-of-immigration') {
    return supportCategories
      ?.filter(
        (c) =>
          c?.id !==
            DirectorateOfImmigrationCategories.RESIDENCE_PERMIT_GENERAL_CONDITIONS &&
          c?.id !== DirectorateOfImmigrationCategories.RESIDENCE_PERMIT_TYPES,
      )
      .concat([
        {
          id: DirectorateOfImmigrationCategories.RESIDENCE_PERMIT,
          importance: 0,
          __typename: 'SupportCategory',
          description: '',
          organization: organization,
          slug: DirectorateOfImmigrationCategories.RESIDENCE_PERMIT,
          title:
            namespace?.['directorateOfImmigrationResidencePermit'] ||
            (locale === 'is' ? 'Dvalarleyfi' : 'Residence permit'),
        },
        {
          id: DirectorateOfImmigrationCategories.ASSISTED_VOLUNTARY_RETURN,
          importance: 0,
          __typename: 'SupportCategory',
          description: '',
          organization: organization,
          slug: DirectorateOfImmigrationCategories.ASSISTED_VOLUNTARY_RETURN,
          title:
            namespace?.['directorateOfImmigrationAssistedVoluntaryReturn'] ||
            (locale === 'is'
              ? 'Aðstoð við sjálfviljuga heimför'
              : 'Assisted voluntary return'),
        },
      ])
  }

  return supportCategories
}
