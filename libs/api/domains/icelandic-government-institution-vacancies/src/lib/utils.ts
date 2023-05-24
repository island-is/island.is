export interface DefaultApiVacanciesListItem {
  birt?: string
  fyrirsogn?: string
  haefnikrofur?: string
  heimilisfang?: string
  id?: number
  inngangur?: string
  language?: string
  languages?: string
  launaskilmali?: string
  launaskilmaliFull?: string
  logoURL?: string
  other_languages?: null
  postfang?: string
  skipulagseining?: string
  stadsetningar?: {
    stadsetning?: {
      '@kodi'?: number
      '@text'?: string
    }
  }
  starfshlutfall?: string
  starfssvid?: string
  stettarfelagHeiti?: string
  stofnunHeiti?: string
  tengilidir?: {
    tengilidur?: {
      '@nr'?: number
      nafn?: string
      netfang?: string
    }
  }
  umsoknarfrestur_fra?: string
  umsoknarfrestur_til?: string
  undirtexti?: null
  verkefni?: string
  vinnutimaskipulag?: string
  weblink?: { url?: string; text?: string }
  weblink_extra?: null
}

export interface DefaultApiVacancyDetails {
  starfsauglysing: DefaultApiVacanciesListItem
}

export const mapIcelandicGovernmentInstitutionVacanciesResponse = (
  data: DefaultApiVacanciesListItem[],
) => {
  return data.map((item) => ({
    id: item.id,
    title: item.fyrirsogn,
    applicationDeadlineFrom: item.umsoknarfrestur_fra,
    applicationDeadlineTo: item.umsoknarfrestur_til,
    description: item.inngangur,
    fieldOfWork: item.starfssvid,
    institutionName: item.stofnunHeiti,
    logoUrl: item.logoURL,
    locations: item.stadsetningar?.stadsetning?.['@text']
      ? {
          postalCode: item.stadsetningar.stadsetning['@kodi'],
          title: item.stadsetningar.stadsetning['@text'],
        }
      : undefined,
  }))
}

export const mapIcelandicGovernmentInstitutionVacancyByIdResponse = (
  vacancy: DefaultApiVacancyDetails,
) => {
  const item = vacancy.starfsauglysing

  return {
    id: item.id,
    title: item.fyrirsogn,
    applicationDeadlineFrom: item.umsoknarfrestur_fra,
    applicationDeadlineTo: item.umsoknarfrestur_til,
    description: item.inngangur,
    fieldOfWork: item.starfssvid,
    institutionName: item.stofnunHeiti,
    logoUrl: item.logoURL,
    locations: item.stadsetningar?.stadsetning?.['@text']
      ? {
          postalCode: item.stadsetningar.stadsetning['@kodi'],
          title: item.stadsetningar.stadsetning['@text'],
        }
      : undefined,
    address: item.heimilisfang,
    contacts: item.tengilidir?.tengilidur?.nafn
      ? {
          email: item.tengilidir.tengilidur.netfang,
          name: item.tengilidir.tengilidur.nafn,
        }
      : undefined,
    jobPercentage: item.starfshlutfall,
    postalAddress: item.postfang,
  }
}
