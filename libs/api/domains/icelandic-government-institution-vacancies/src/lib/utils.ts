import { NodeHtmlMarkdown } from 'node-html-markdown'
import sanitizeHtml from 'sanitize-html'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { IcelandicGovernmentInstitutionVacanciesResponse } from './dto/icelandicGovernmentInstitutionVacanciesResponse'
import { IcelandicGovernmentInstitutionVacancyByIdResponse } from './dto/icelandicGovernmentInstitutionVacancyByIdResponse'

interface DefaultApiVacancyContact {
  '@nr'?: number
  nafn?: string
  netfang?: string
  simi?: string
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
  const locations: IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number]['locations'] = []

  if ('stadsetning' in (item?.stadsetningar ?? {})) {
    const location = (item.stadsetningar as {
      stadsetning?: DefaultApiVacancyLocation
    })['stadsetning']

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
  const contacts: IcelandicGovernmentInstitutionVacancyByIdResponse['vacancy']['contacts'] = []
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
  return contacts
}

export const mapIcelandicGovernmentInstitutionVacanciesResponse = async (
  data: DefaultApiVacanciesListItem[],
) => {
  const mappedData: IcelandicGovernmentInstitutionVacanciesResponse['vacancies'] = []

  const introPromises: Promise<string>[] = []

  for (const item of data) {
    const locations = mapLocations(item)
    const introHtml = item.inngangur ?? ''
    introPromises.push(convertHtmlToPlainText(introHtml))
    mappedData.push({
      id: item.id,
      title: item.fyrirsogn,
      applicationDeadlineFrom: item.umsoknarfrestur_fra,
      applicationDeadlineTo: item.umsoknarfrestur_til,
      intro: '',
      fieldOfWork: item.starfssvid,
      institutionName: item.stofnunHeiti,
      logoUrl: item.logoURL,
      locations,
    })
  }

  const intros = await Promise.all(introPromises)

  for (let i = 0; i < mappedData.length; i += 1) {
    if (intros[i]) {
      mappedData[i].intro = intros[i]
    }
  }

  mappedData.sort((a, b) => {
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

  return mappedData
}

export const mapIcelandicGovernmentInstitutionVacancyByIdResponse = async (
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
    id: item.id,
    title: item.fyrirsogn,
    applicationDeadlineFrom: item.umsoknarfrestur_fra,
    applicationDeadlineTo: item.umsoknarfrestur_til,
    intro,
    fieldOfWork: item.starfssvid,
    institutionName: item.stofnunHeiti,
    logoUrl: item.logoURL,
    locations,
    address: item.heimilisfang,
    contacts,
    jobPercentage: item.starfshlutfall,
    postalAddress: item.postfang,
    applicationHref: item.weblink?.url,
    qualificationRequirements,
    tasksAndResponsibilities,
    description,
    salaryTerms,
    plainTextIntro: documentToPlainTextString(intro.document),
  }
}
