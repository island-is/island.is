import { Organization, SupportCategory } from '@island.is/web/graphql/schema'

export enum SjukratryggingarCategories {
  SJUKRADAGPENINGAR = 'sjukradagpeningar',
  SLYSAMAL_SJUKLINGATRYGGING = 'slysamal-sjuklingatrygging',
  HJALPARTAEKI_NAERING = 'hjalpartaeki-naering',
  HEILBRIGDISTHJONUSTA = 'heilbrigdisthjonusta',
  LYFJAMAL = 'lyfjamal',
  SAMNINGAR_INNKAUP = 'samningar-innkaup',
  ALTHJODAMAL = 'althjodamal',
  ONNUR_THJONUSTA = 'onnur-thjonusta',
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

export enum FiskistofaCategories {
  STRANDVEIDAR = '6vPorSHCBf4o22rhbHedHR',
  VEIDILEYFI = '5QmuK7Ns1wgpEUWTetbLGb',
  AFLASKRANING = '4D5Fhl2YedrTOJ7PTMYeo0',
  FISKVEIDAR = '5i5oQMp8r2oE43bYNPeZig',
  UTFLUTNINGUR = '6sE8R2mNldfv9ZEHGv5FA',
  VEIDIHEIMILDIR = '1agbWJCHTDVfVR4yQZPaEK',
}

export enum VinnueftirlitidCategories {
  NAMSKEID = '41SeTRazu0qKIixRhWpDLA',
  SKRANING_OG_SKODUN_VINNUVELA = '1ulMblBQwDkfSNgh2NyKpw',
  VINNUSLYS = '3VY4skpcXo7XyniStyxrVc',
  VINNUVELARETTINDI = '1AkjZQc1CO6hMPXYaLSqTw',
  VINNUVERND = '4Wmxb25h9R7L0kuYsz19jG',
  MARKADSEFTIRLIT = '61OI7gY23wC80mRRA4yrbA',
  MANNVIRKJAGERD = '7fLoJqpyojUHgdDofIpqlU',
  EKKO_OG_SAMSKIPTI = '3SAlg8Xt7AKBQFrGUCTkG1',
  VINNUADSTADA = '7FPsjPxRHA2aIOUXY3Xr3V',
  LOG_OG_REGLUGERDIR = '7vb5yId3HMigcXEDMYN9uN',
  LEYFI_OG_UMSAGNIR = '7nLIjBeO5EovoPYwINWoyv',
  ONNUR_THJONUSTA = 'fdkCIdREoNlYmgkr37DTl',
}

export const filterSupportCategories = (
  supportCategories: SupportCategory[] | undefined,
  slug: string,
  organization: Organization | undefined,
  locale: string,
  namespace: Record<string, string> | undefined,
) => {
  if (
    slug === 'sjukratryggingar' ||
    slug === 'icelandic-health-insurance' ||
    slug === 'iceland-health'
  ) {
    return [
      {
        id: SjukratryggingarCategories.SJUKRADAGPENINGAR,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjukratryggingarCategories.SJUKRADAGPENINGAR,
        title:
          namespace?.['icelandHealthSjukradagpeningar'] ||
          (locale === 'is' ? 'Sjúkradagpeningar' : 'Cash sickness benefits'),
      },
      {
        id: SjukratryggingarCategories.SLYSAMAL_SJUKLINGATRYGGING,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjukratryggingarCategories.SLYSAMAL_SJUKLINGATRYGGING,
        title:
          namespace?.['icelandHealthSlysamalSjuklingatrygging'] ||
          (locale === 'is'
            ? 'Slysamál - sjúklingatrygging'
            : 'Accident and patient insurance'),
      },
      {
        id: SjukratryggingarCategories.HJALPARTAEKI_NAERING,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjukratryggingarCategories.HJALPARTAEKI_NAERING,
        title:
          namespace?.['icelandHealthHjalpartaekiNaering'] ||
          (locale === 'is'
            ? 'Hjálpartæki - næring'
            : 'Assistive devices and nutrition'),
      },
      {
        id: SjukratryggingarCategories.HEILBRIGDISTHJONUSTA,
        importance: 0,
        __typename: 'SupportCategory',
        description:
          namespace?.['icelandHealthHeilbrigdisthjonustaDescription'] ||
          (locale === 'is'
            ? 'Þjálfun, lýtalækningar, innlend tannmál, ferðakostnaður, hjúkrunarheimili, heilsugæsla, greiðsluþátttökukerfi, leguskrá, heilbrigðisstarfsfólk og ljósmæður'
            : ''),
        organization: organization,
        slug: SjukratryggingarCategories.HEILBRIGDISTHJONUSTA,
        title:
          namespace?.['icelandHealthHeilbrigdisthjonusta'] ||
          (locale === 'is' ? 'Heilbrigðisþjónusta' : 'Health services'),
      },
      {
        id: SjukratryggingarCategories.LYFJAMAL,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjukratryggingarCategories.LYFJAMAL,
        title:
          namespace?.['icelandHealthLyfjamal'] ||
          (locale === 'is' ? 'Lyfjamál' : 'Pharmaceutical matters'),
      },
      {
        id: SjukratryggingarCategories.SAMNINGAR_INNKAUP,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjukratryggingarCategories.SAMNINGAR_INNKAUP,
        title:
          namespace?.['icelandHealthSamningarInnkaup'] ||
          (locale === 'is' ? 'Samningar - innkaup' : 'Contracts - procurement'),
      },
      {
        id: SjukratryggingarCategories.ALTHJODAMAL,
        importance: 0,
        __typename: 'SupportCategory',
        description:
          namespace?.['icelandHealthAlthjodamalDescription'] ||
          (locale === 'is'
            ? 'Til dæmis erlendur lækniskostnaður, evrópska sjúkratryggingakortið, erlendur tannlæknakostnaður'
            : ''),
        organization: organization,
        slug: SjukratryggingarCategories.ALTHJODAMAL,
        title:
          namespace?.['icelandHealthAlthjodamal'] ||
          (locale === 'is' ? 'Alþjóðamál' : 'International matters'),
      },
      {
        id: SjukratryggingarCategories.ONNUR_THJONUSTA,
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: SjukratryggingarCategories.ONNUR_THJONUSTA,
        title:
          namespace?.['icelandHealthOnnurThjonusta'] ||
          (locale === 'is' ? 'Önnur þjónusta' : 'Other services'),
      },
    ]
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

  if (slug === 'samgongustofa' || slug === 'transport-authority') {
    return [
      {
        id: 'umferd',
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: 'umferd',
        title:
          namespace?.['transportAuthorityTraffic'] ||
          (locale === 'is' ? 'Umferð' : 'Traffic'),
      },
      {
        id: 'flug',
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: 'flug',
        title:
          namespace?.['transportAuthorityFlight'] ||
          (locale === 'is' ? 'Flug' : 'Flight'),
      },
      {
        id: 'siglingar',
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: 'siglingar',
        title:
          namespace?.['transportAuthoritySailing'] ||
          (locale === 'is' ? 'Siglingar' : 'Sailing'),
      },
      {
        id: 'annad',
        importance: 0,
        __typename: 'SupportCategory',
        description: '',
        organization: organization,
        slug: 'annad',
        title:
          namespace?.['transportAuthorityOther'] ||
          (locale === 'is'
            ? 'Önnur þjónusta Samgöngustofu'
            : 'Other services of Transport Authority'),
      },
    ]
  }

  return supportCategories
}
