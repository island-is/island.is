import showdown from 'showdown'
import { JSDOM } from 'jsdom'
import sanitizeHtml from 'sanitize-html'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
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

const convertHtmlToPlainText = (html: string) => {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ')
}

const shortenText = (text: string, maxLength: number) => {
  if (!text) return ''
  if (text.length > maxLength) {
    if (text[text.length - 1] === ' ') {
      maxLength -= 1
    }
    return text.slice(0, maxLength).concat('...')
  }
  return text
}

const convertHtmlToContentfulRichText = async (html: string) => {
  const sanitizedHtml = sanitizeHtml(html)
  const virtualDom = new JSDOM(sanitizedHtml)
  const converter = new showdown.Converter()
  const markdown = converter.makeMarkdown(
    sanitizedHtml,
    virtualDom.window.document,
  )
  const richText = await richTextFromMarkdown(markdown)
  return {
    __typename: 'Html',
    document: richText,
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

export const mapIcelandicGovernmentInstitutionVacanciesResponse = (
  data: DefaultApiVacanciesListItem[],
) => {
  const mappedData: IcelandicGovernmentInstitutionVacanciesResponse['vacancies'] = []

  for (const item of data) {
    const locations = mapLocations(item)
    mappedData.push({
      id: item.id,
      title: item.fyrirsogn,
      applicationDeadlineFrom: item.umsoknarfrestur_fra,
      applicationDeadlineTo: item.umsoknarfrestur_til,
      intro: shortenText(convertHtmlToPlainText(item.inngangur ?? ''), 80),
      fieldOfWork: item.starfssvid,
      institutionName: item.stofnunHeiti,
      logoUrl: item.logoURL,
      locations,
    })
  }
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
  ] = await Promise.all([
    convertHtmlToContentfulRichText(item.inngangur ?? ''),
    convertHtmlToContentfulRichText(item.haefnikrofur ?? ''),
    convertHtmlToContentfulRichText(item.verkefni ?? ''),
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
  }
}
