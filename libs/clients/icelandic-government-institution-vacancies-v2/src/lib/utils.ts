import { NodeHtmlMarkdown } from 'node-html-markdown'
import sanitizeHtml from 'sanitize-html'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import type { Openvacaniesv2Starfsauglysingar } from '../../gen/fetch/models'

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

const mapContacts = (item: Openvacaniesv2Starfsauglysingar) => {
  const contacts = []
  for (const contact of item.tengilidir ?? []) {
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

  return contacts
}

const mapLocations = (item: Openvacaniesv2Starfsauglysingar) => {
  const locations = []

  for (const location of item?.stadsetningar ?? []) {
    if (location) {
      locations.push({
        postalCode: location.kodi,
        title: location.text,
      })
    }
  }

  return locations
}

export const mapSingleVacancy = async (
  item: Openvacaniesv2Starfsauglysingar,
) => {
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
    applicationDeadlineFrom: item.umsoknarfresturFra,
    applicationDeadlineTo: item.umsoknarfresturTil,
    intro,
    fieldOfWork: item.starfssvid,
    institutionName: item.stofnunHeiti,
    institutionReferenceIdentifier:
      typeof item.stofnunNr === 'number'
        ? String(item.stofnunNr)
        : item.stofnunNr,
    logoUrl: item.logoURL as string | undefined,
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

export const mapVacancies = async (data: Openvacaniesv2Starfsauglysingar[]) => {
  const mappedData = []

  const introPromises: Promise<string>[] = []

  for (const item of data) {
    const locations = mapLocations(item)
    const introHtml = item.inngangur ?? ''
    introPromises.push(convertHtmlToPlainText(introHtml))
    mappedData.push({
      id: item.id,
      title: item.fyrirsogn,
      applicationDeadlineFrom: item.umsoknarfresturFra,
      applicationDeadlineTo: item.umsoknarfresturTil,
      intro: '',
      fieldOfWork: item.starfssvid,
      institutionName: item.stofnunHeiti,
      institutionReferenceIdentifier:
        typeof item.stofnunNr === 'number'
          ? String(item.stofnunNr)
          : item.stofnunNr,
      logoUrl: item.logoURL as string | undefined,
      locations,
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
