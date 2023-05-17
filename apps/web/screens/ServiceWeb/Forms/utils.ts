import { Organization, SupportCategory } from '@island.is/web/graphql/schema'

enum SjuktratryggingarCategories {
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
        c?.id !== SjuktratryggingarCategories.HJALPARTAEKI_OG_NAERING &&
        c?.id !== SjuktratryggingarCategories.SLYS_OG_SJUKLINGATRYGGING,
    )
    .concat([
      {
        id: SjuktratryggingarCategories.HJALPARTAEKI,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjuktratryggingarCategories.HJALPARTAEKI,
        title:
          namespace?.['sjukratryggingarAssistiveDevices'] ||
          (locale === 'is' ? 'Hjálpartæki' : 'Assistive devices'),
      },
      {
        id: SjuktratryggingarCategories.NAERING,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjuktratryggingarCategories.NAERING,
        title:
          namespace?.['sjukratryggingarNutrition'] ||
          (locale === 'is' ? 'Næring' : 'Nutrition'),
      },
      {
        id: SjuktratryggingarCategories.SLYSATRYGGING,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjuktratryggingarCategories.SLYSATRYGGING,
        title:
          namespace?.['sjukratryggingarAccidentInsurance'] ||
          (locale === 'is' ? 'Slysatrygging' : 'Accident insurance'),
      },
      {
        id: SjuktratryggingarCategories.SJUKLINGATRYGGING,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjuktratryggingarCategories.SJUKLINGATRYGGING,
        title:
          namespace?.['sjukratryggingarPatientInsurance'] ||
          (locale === 'is' ? 'Sjúklingatrygging' : 'Patient insurance'),
      },
      {
        id: SjuktratryggingarCategories.HJUKRUNARHEIMILI,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjuktratryggingarCategories.HJUKRUNARHEIMILI,
        title:
          namespace?.['sjukratryggingarNursingHome'] ||
          (locale === 'is' ? 'Hjúkrunarheimili' : 'Nursing home'),
      },
      {
        id: SjuktratryggingarCategories.TULKATHJONUSTA,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjuktratryggingarCategories.TULKATHJONUSTA,
        title:
          namespace?.['sjukratryggingarInterpretationServices'] ||
          (locale === 'is' ? 'Túlkaþjónusta' : 'Interpretation services'),
      },
    ])
}
