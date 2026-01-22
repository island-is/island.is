import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { IcelandicGovernmentInstitutionVacanciesResponse } from './dto/icelandicGovernmentInstitutionVacanciesResponse'
import { IcelandicGovernmentInstitutionVacancyByIdResponse } from './dto/icelandicGovernmentInstitutionVacancyByIdResponse'
import { IcelandicGovernmentInstitutionVacancyContact } from './models/icelandicGovernmentInstitutionVacancy.model'
import {
  EXTERNAL_SYSTEM_ID_PREFIX,
  VacancyWithCreationDate,
  convertHtmlToContentfulRichText,
  convertHtmlToPlainText,
} from './utils'

// ============================================================================
// Types for old X-Road API client
// ============================================================================

interface DefaultApiVacancyContact {
  '@nr'?: number
  nafn?: string
  netfang?: string
  simi?: string | number
  starfsheiti?: string
}

interface DefaultApiVacancyLocation {
  '@kodi'?: number
  '@text'?: string
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
  stadsetningar?:
    | {
        stadsetning?: DefaultApiVacancyLocation
      }
    | DefaultApiVacancyLocation[]
  starfshlutfall?: string
  starfssvid?: string
  stettarfelagHeiti?: string
  stofnunHeiti?: string
  stofnunNr?: string | number
  tengilidir?:
    | {
        tengilidur?: DefaultApiVacancyContact
      }
    | DefaultApiVacancyContact[]
  umsoknarfrestur_fra?: string
  umsoknarfrestur_til?: string
  undirtexti?: string | null
  verkefni?: string
  vinnutimaskipulag?: string
  weblink?: { url?: string; text?: string }
  weblink_extra?: null
}

export interface DefaultApiVacancyDetails {
  starfsauglysing: DefaultApiVacanciesListItem
}

// ============================================================================
// Helper functions for old X-Road API client
// ============================================================================

const mapLocationsFromXRoad = (item: DefaultApiVacanciesListItem) => {
  const locations: IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number]['locations'] =
    []

  if ('stadsetning' in (item?.stadsetningar ?? {})) {
    const location = (
      item.stadsetningar as {
        stadsetning?: DefaultApiVacancyLocation
      }
    )['stadsetning']

    if (location) {
      locations.push({
        postalCode: location['@kodi'],
        title: location['@text'],
      })
    }
  } else {
    for (const location of (item?.stadsetningar as DefaultApiVacancyLocation[]) ??
      []) {
      if (location) {
        locations.push({
          postalCode: location['@kodi'],
          title: location['@text'],
        })
      }
    }
  }
  return locations
}

const mapContactsFromXRoad = (item: DefaultApiVacanciesListItem) => {
  const contacts: IcelandicGovernmentInstitutionVacancyContact[] = []
  if ('tengilidur' in (item?.tengilidir ?? {})) {
    const contact = (
      item.tengilidir as {
        tengilidur?: DefaultApiVacancyContact
      }
    )['tengilidur']

    if (contact) {
      contacts.push({
        email: contact?.netfang,
        name: contact?.nafn,
        phone:
          typeof contact?.simi === 'number'
            ? String(contact?.simi)
            : contact?.simi,
        jobTitle: contact?.starfsheiti,
      })
    }
  } else {
    for (const contact of (item.tengilidir as DefaultApiVacancyContact[]) ??
      []) {
      if (contact) {
        contacts.push({
          email: contact?.netfang,
          name: contact?.nafn,
          phone:
            typeof contact?.simi === 'number'
              ? String(contact?.simi)
              : contact?.simi,
          jobTitle: contact?.starfsheiti,
        })
      }
    }
  }
  return contacts
}

// ============================================================================
// Mappers for old X-Road API client
// ============================================================================

export const mapIcelandicGovernmentInstitutionVacanciesFromXRoad = async (
  data: DefaultApiVacanciesListItem[],
): Promise<VacancyWithCreationDate[]> => {
  const mappedData: VacancyWithCreationDate[] = []

  const introPromises: Promise<string>[] = []

  for (const item of data) {
    const locations = mapLocationsFromXRoad(item)
    const introHtml = item.inngangur ?? ''
    introPromises.push(convertHtmlToPlainText(introHtml))
    mappedData.push({
      id: `${EXTERNAL_SYSTEM_ID_PREFIX}${item.id}`,
      title: item.fyrirsogn,
      applicationDeadlineFrom: item.umsoknarfrestur_fra,
      applicationDeadlineTo: item.umsoknarfrestur_til,
      intro: '',
      fieldOfWork: item.starfssvid,
      institutionName: item.stofnunHeiti,
      institutionReferenceIdentifier:
        typeof item.stofnunNr === 'number'
          ? String(item.stofnunNr)
          : item.stofnunNr,
      logoUrl: item.logoURL,
      locations,
      address: item.heimilisfang,
    })
  }

  const intros = await Promise.all(introPromises)

  for (let i = 0; i < mappedData.length; i += 1) {
    if (intros[i]) {
      mappedData[i].intro = intros[i]
    }
  }

  return mappedData
}

export const mapIcelandicGovernmentInstitutionVacancyByIdResponseFromXRoad =
  async (
    vacancy: DefaultApiVacancyDetails,
  ): Promise<IcelandicGovernmentInstitutionVacancyByIdResponse['vacancy']> => {
    const item = vacancy.starfsauglysing

    const contacts = mapContactsFromXRoad(item)
    const locations = mapLocationsFromXRoad(item)

    const [
      intro,
      qualificationRequirements,
      tasksAndResponsibilities,
      description,
      salaryTerms,
    ] = await Promise.all([
      convertHtmlToContentfulRichText(item.inngangur ?? '', 'intro'),
      convertHtmlToContentfulRichText(
        item.haefnikrofur ?? '',
        'qualificationRequirements',
      ),
      convertHtmlToContentfulRichText(
        item.verkefni ?? '',
        'tasksAndResponsibilities',
      ),
      convertHtmlToContentfulRichText(item.undirtexti ?? '', 'description'),
      convertHtmlToContentfulRichText(
        item.launaskilmaliFull ?? '',
        'salaryTerms',
      ),
    ])

    return {
      id: `${EXTERNAL_SYSTEM_ID_PREFIX}${item.id}`,
      title: item.fyrirsogn,
      applicationDeadlineFrom: item.umsoknarfrestur_fra,
      applicationDeadlineTo: item.umsoknarfrestur_til,
      intro,
      fieldOfWork: item.starfssvid,
      institutionName: item.stofnunHeiti,
      institutionReferenceIdentifier:
        typeof item.stofnunNr === 'number'
          ? String(item.stofnunNr)
          : item.stofnunNr,
      logoUrl: item.logoURL,
      locations,
      contacts,
      jobPercentage: item.starfshlutfall,
      applicationHref: item.weblink?.url,
      qualificationRequirements,
      tasksAndResponsibilities,
      description,
      salaryTerms,
      plainTextIntro: documentToPlainTextString(intro.document),
    }
  }
