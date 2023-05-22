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

export const filterSupportCategories = (
  supportCategories: SupportCategory[] | undefined,
  slug: string,
  organization: Organization | undefined,
  locale: string,
  namespace: Record<string, string> | undefined,
) => {
  if (slug !== 'sjukratryggingar' && slug !== 'icelandic-health-insurance') {
    return supportCategories
  }

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
