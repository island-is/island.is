import { NodeHtmlMarkdown } from 'node-html-markdown'
import sanitizeHtml from 'sanitize-html'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { Html, Vacancy } from '@island.is/cms'
import { IcelandicGovernmentInstitutionVacanciesV2Response } from './dto/icelandicGovernmentInstitutionVacanciesV2Response'
import { IcelandicGovernmentInstitutionVacancyByIdResponse } from './dto/icelandicGovernmentInstitutionVacancyByIdResponse'

export const CMS_ID_PREFIX = 'c-'
export const EXTERNAL_SYSTEM_ID_PREFIX = 'x-'

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

export const sortVacancyList = (
  vacancyList: IcelandicGovernmentInstitutionVacanciesV2Response['vacancies'],
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

export const mapSingleVacancyFromCms = (
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
): IcelandicGovernmentInstitutionVacanciesV2Response['vacancies'][number] => {
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
