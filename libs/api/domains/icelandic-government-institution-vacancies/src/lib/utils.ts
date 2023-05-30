interface DefaultApiVacancyContact {
  '@nr'?: number
  nafn?: string
  netfang?: string
  simi?: string
}

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
  tengilidir?:
    | {
        tengilidur?: DefaultApiVacancyContact
      }
    | DefaultApiVacancyContact[]
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
    intro: item.inngangur,
    fieldOfWork: item.starfssvid,
    institutionName: item.stofnunHeiti,
    logoUrl: item.logoURL,
    locationTitle: item.stadsetningar?.stadsetning?.['@text'],
    locationPostalCode: item.stadsetningar?.stadsetning?.['@kodi'],
  }))
}

export const mapIcelandicGovernmentInstitutionVacancyByIdResponse = (
  vacancy: DefaultApiVacancyDetails,
) => {
  const item = vacancy.starfsauglysing

  const contacts = []

  if ('tengilidur' in (item?.tengilidir ?? {})) {
    const contact = (item.tengilidir as {
      tengilidur?: DefaultApiVacancyContact
    })['tengilidur']

    if (contact) {
      contacts.push({
        email: contact?.netfang,
        name: contact?.nafn,
        phone: contact?.simi,
      })
    }
  } else {
    for (const contact of (item.tengilidir as DefaultApiVacancyContact[]) ??
      []) {
      if (contact) {
        contacts.push({
          email: contact?.netfang,
          name: contact?.nafn,
          phone: contact?.simi,
        })
      }
    }
  }

  return {
    id: item.id,
    title: item.fyrirsogn,
    applicationDeadlineFrom: item.umsoknarfrestur_fra,
    applicationDeadlineTo: item.umsoknarfrestur_til,
    intro: item.inngangur,
    fieldOfWork: item.starfssvid,
    institutionName: item.stofnunHeiti,
    logoUrl: item.logoURL,
    locationTitle: item.stadsetningar?.stadsetning?.['@text'],
    locationPostalCode: item.stadsetningar?.stadsetning?.['@kodi'],
    address: item.heimilisfang,
    contacts,
    jobPercentage: item.starfshlutfall,
    postalAddress: item.postfang,
    applicationHref: item.weblink?.url,
    qualificationRequirements: item.haefnikrofur,
    tasksAndResponsibilities: item.verkefni,
  }
}
