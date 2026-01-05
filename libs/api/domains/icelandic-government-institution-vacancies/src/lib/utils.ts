import { NodeHtmlMarkdown } from 'node-html-markdown'
import sanitizeHtml from 'sanitize-html'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { IcelandicGovernmentInstitutionVacanciesResponse } from './dto/icelandicGovernmentInstitutionVacanciesResponse'
import { IcelandicGovernmentInstitutionVacancyByIdResponse } from './dto/icelandicGovernmentInstitutionVacancyByIdResponse'
import { Html, Vacancy } from '@island.is/cms'
import { IcelandicGovernmentInstitutionVacancyContact } from './models/icelandicGovernmentInstitutionVacancy.model'

export const CMS_ID_PREFIX = 'c-'
export const EXTERNAL_SYSTEM_ID_PREFIX = 'x-'

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

const convertHtmlToPlainText = async (html: string) => {
  if (!html) return ''
  const contentfulRichText = await convertHtmlToContentfulRichText(html)
  return documentToPlainTextString(contentfulRichText.document)
}

const convertHtmlToContentfulRichText = async (html: string, id?: string) => {
  const sanitizedHtml = sanitizeHtml(html)
  const markdown = NodeHtmlMarkdown.translate(sanitizedHtml)
  const richText = await richTextFromMarkdown(markdown)
  return {
    __typename: 'Html',
    document: richText,
    id,
  }
}

const mapLocations = (item: DefaultApiVacanciesListItem) => {
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

const mapContacts = (item: DefaultApiVacanciesListItem) => {
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
        })
      }
    }
  }
  return contacts
}

export const sortVacancyList = (
  vacancyList: IcelandicGovernmentInstitutionVacanciesResponse['vacancies'],
) => {
  vacancyList.sort((a, b) => {
    if (!a?.applicationDeadlineFrom || !b?.applicationDeadlineFrom) return 0

    const [dayA, monthA, yearA] = a.applicationDeadlineFrom.split('.')
    if (!dayA || !monthA || !yearA) return 0

    const [dayB, monthB, yearB] = b.applicationDeadlineFrom.split('.')
    if (!dayB || !monthB || !yearB) return 0

    const dateA = new Date(Number(yearA), Number(monthA), Number(dayA))
    const dateB = new Date(Number(yearB), Number(monthB), Number(dayB))

    if (dateA < dateB) {
      return 1
    }
    if (dateA > dateB) {
      return -1
    }

    return 0
  })
}

export const mapIcelandicGovernmentInstitutionVacanciesFromExternalSystem =
  async (data: DefaultApiVacanciesListItem[]) => {
    const mappedData: IcelandicGovernmentInstitutionVacanciesResponse['vacancies'] =
      []

    const introPromises: Promise<string>[] = []

    for (const item of data) {
      const locations = mapLocations(item)
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

export const mapIcelandicGovernmentInstitutionVacancyByIdResponseFromExternalSystem =
  async (
    vacancy: DefaultApiVacancyDetails,
  ): Promise<IcelandicGovernmentInstitutionVacancyByIdResponse['vacancy']> => {
    const item = vacancy.starfsauglysing

    const contacts = mapContacts(item)
    const locations = mapLocations(item)

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

export const mapRichTextField = (field: Html | null | undefined) => {
  return (
    (field && {
      ...field,
      __typename: field.typename,
    }) ??
    null
  )
}

const mapDate = (date?: string) => {
  const list = date?.split('-') ?? []
  return list?.length === 3 ? `${list[2]}.${list[1]}.${list[0]}` : undefined
}

export const mapIcelandicGovernmentInstitutionVacancyByIdResponseFromCms = (
  vacancy: Vacancy,
): IcelandicGovernmentInstitutionVacancyByIdResponse['vacancy'] => {
  const contacts = vacancy.contacts ?? []
  const locations =
    vacancy.locations?.map((location) => ({
      postalCode: undefined,
      title: location,
    })) ?? []

  return {
    id: vacancy.id ? `${CMS_ID_PREFIX}${vacancy.id}` : vacancy.id,
    title: vacancy.title,
    applicationDeadlineFrom: mapDate(vacancy.applicationDeadlineFrom),
    applicationDeadlineTo: mapDate(vacancy.applicationDeadlineTo),
    fieldOfWork: vacancy.fieldOfWork,
    institutionName:
      vacancy.organization?.shortTitle || vacancy.organization?.title,
    institutionReferenceIdentifier: vacancy.organization?.referenceIdentifier,
    logoUrl: vacancy.organization?.logo?.url,
    locations,
    contacts,
    jobPercentage: vacancy.jobPercentage,
    applicationHref: vacancy.applicationHref,
    intro: mapRichTextField(vacancy.intro),
    qualificationRequirements: mapRichTextField(
      vacancy.qualificationRequirements,
    ),
    tasksAndResponsibilities: mapRichTextField(
      vacancy.tasksAndResponsibilities,
    ),
    description: mapRichTextField(vacancy.description),
    salaryTerms: mapRichTextField(vacancy.salaryTerms),
    plainTextIntro: vacancy.intro?.document
      ? documentToPlainTextString(vacancy.intro.document)
      : undefined,
  }
}

export const mapVacancyListItemFromCms = (
  vacancy: Vacancy,
): IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number] => {
  return {
    id: vacancy.id ? `${CMS_ID_PREFIX}${vacancy.id}` : vacancy.id,
    title: vacancy.title,
    applicationDeadlineFrom: mapDate(vacancy.applicationDeadlineFrom),
    applicationDeadlineTo: mapDate(vacancy.applicationDeadlineTo),
    fieldOfWork: vacancy.fieldOfWork,
    institutionName: vacancy.organization?.title,
    intro: vacancy.intro?.document
      ? documentToPlainTextString(vacancy.intro?.document)
      : undefined,
    locations: (vacancy.locations ?? []).map((location) => ({
      postalCode: undefined,
      title: location,
    })),
    logoUrl: vacancy.organization?.logo?.url,
  }
}
