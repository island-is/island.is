import { NodeHtmlMarkdown } from 'node-html-markdown'
import sanitizeHtml from 'sanitize-html'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { IcelandicGovernmentInstitutionVacanciesResponse } from './dto/icelandicGovernmentInstitutionVacanciesResponse'
import { IcelandicGovernmentInstitutionVacancyByIdResponse } from './dto/icelandicGovernmentInstitutionVacancyByIdResponse'
import { Html, Vacancy } from '@island.is/cms'
import { IcelandicGovernmentInstitutionVacancyContact } from './models/icelandicGovernmentInstitutionVacancy.model'
import { VacancyResponseDto } from '@island.is/clients/financial-management-authority'

export const CMS_ID_PREFIX = 'c-'
export const EXTERNAL_SYSTEM_ID_PREFIX = 'x-'

// ============================================================================
// Shared helper functions
// ============================================================================

const formatDate = (date?: Date | string | null) => {
  if (!date) {
    return undefined
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    return undefined
  }

  const day = `${dateObj.getDate()}`.padStart(2, '0')
  const month = `${dateObj.getMonth() + 1}`.padStart(2, '0')
  const year = dateObj.getFullYear()

  return `${day}.${month}.${year}`
}

export const convertHtmlToPlainText = async (html: string) => {
  if (!html) return ''
  const contentfulRichText = await convertHtmlToContentfulRichText(html)
  return documentToPlainTextString(contentfulRichText.document)
}

export const convertHtmlToContentfulRichText = async (
  html: string,
  id?: string,
) => {
  const sanitizedHtml = sanitizeHtml(html)
  const markdown = NodeHtmlMarkdown.translate(sanitizedHtml)
  const richText = await richTextFromMarkdown(markdown)
  return {
    __typename: 'Html',
    document: richText,
    id,
  }
}


// ============================================================================
// Sorting and types
// ============================================================================

// Internal type for sorting - includes creationDate which is not exposed via GraphQL
export type VacancyWithCreationDate =
  IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number] & {
    _creationDate?: Date
  }

const parseDisplayDate = (dateStr: string): Date | null => {
  const [day, month, year] = dateStr.split('.')
  if (!day || !month || !year) return null
  // Note: month - 1 because JavaScript months are 0-indexed
  return new Date(Number(year), Number(month) - 1, Number(day))
}

export const sortVacancyList = (vacancyList: VacancyWithCreationDate[]) => {
  vacancyList.sort((a, b) => {
    // Primary sort: by creationDate descending (newest first)
    if (a?._creationDate && b?._creationDate) {
      if (a._creationDate < b._creationDate) return 1
      if (a._creationDate > b._creationDate) return -1
    } else if (a?._creationDate && !b?._creationDate) {
      // Items with creation dates come before items without
      return -1
    } else if (!a?._creationDate && b?._creationDate) {
      return 1
    }

    // Secondary sort: by applicationDeadlineFrom (publish date) descending
    // Fallback for items without creation dates or when creation dates are equal
    if (a?.applicationDeadlineFrom && b?.applicationDeadlineFrom) {
      const dateA = parseDisplayDate(a.applicationDeadlineFrom)
      const dateB = parseDisplayDate(b.applicationDeadlineFrom)

      if (dateA && dateB) {
        if (dateA < dateB) return 1
        if (dateA > dateB) return -1
      }
    } else if (a?.applicationDeadlineFrom && !b?.applicationDeadlineFrom) {
      return -1
    } else if (!a?.applicationDeadlineFrom && b?.applicationDeadlineFrom) {
      return 1
    }

    return 0
  })
}


// ============================================================================
// Mappers for new Elfur API client (Financial Management Authority)
// ============================================================================

export const mapIcelandicGovernmentInstitutionVacanciesFromElfur =
  async (data: VacancyResponseDto[]): Promise<VacancyWithCreationDate[]> => {
    const mappedData: VacancyWithCreationDate[] = []

    const introPromises: Promise<string>[] = []

    for (const item of data) {
      const introHtml = item.introduction ?? ''
      introPromises.push(convertHtmlToPlainText(introHtml))

      const locations: IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number]['locations'] =
        []

      const locationTitles =
        item.locations
          ?.split(',')
          .map((location) => location.trim())
          .filter(Boolean) ?? []

      for (const title of locationTitles) {
        locations.push({
          postalCode: item.postCode ?? undefined,
          title,
        })
      }

      mappedData.push({
        id: item.vacancyID
          ? `${EXTERNAL_SYSTEM_ID_PREFIX}${item.vacancyID}`
          : undefined,
        title: item.heading ?? undefined,
        applicationDeadlineFrom: formatDate(item.publishDate),
        applicationDeadlineTo: formatDate(item.openTo),
        intro: '',
        fieldOfWork: item.jobTitle ?? undefined,
        institutionName: item.orgName ?? undefined,
        institutionReferenceIdentifier: (() => {
          const orgNrStr =
            typeof item.orgNr === 'number' && item.orgNr !== null
              ? String(item.orgNr)
              : item.orgNr ?? undefined

          if (!orgNrStr) {
            return undefined
          }

          if (!orgNrStr.startsWith('0') && orgNrStr.length !== 5) {
            return `0${orgNrStr}`
          }

          return orgNrStr
        })(),
        logoUrl: item.logoUrl ?? undefined,
        locations,
        address: item.address ?? undefined,
        // Display fields
        creationDate: formatDate(item.creationDate),
        updatedDate: formatDate(item.updatedDate),
        // Internal field for sorting
        _creationDate: item.creationDate
          ? new Date(item.creationDate)
          : undefined,
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

export const mapIcelandicGovernmentInstitutionVacancyByIdResponseFromElfur =
  async (
    vacancy: VacancyResponseDto,
  ): Promise<IcelandicGovernmentInstitutionVacancyByIdResponse['vacancy']> => {
    const locations: IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number]['locations'] =
      []

    const locationTitles =
      vacancy.locations
        ?.split(',')
        .map((location) => location.trim())
        .filter(Boolean) ?? []

    for (const title of locationTitles) {
      locations.push({
        postalCode: vacancy.postCode ?? undefined,
        title,
      })
    }

    const contacts: IcelandicGovernmentInstitutionVacancyContact[] = []

    if (
      vacancy.contact1Name ||
      vacancy.contact1EmailAddress ||
      vacancy.contact1PhoneNumber ||
      vacancy.contact1JobTitle
    ) {
      contacts.push({
        name: vacancy.contact1Name ?? undefined,
        email: vacancy.contact1EmailAddress ?? undefined,
        phone: vacancy.contact1PhoneNumber ?? undefined,
        jobTitle: vacancy.contact1JobTitle ?? undefined,
      })
    }

    if (
      vacancy.contact2Name ||
      vacancy.contact2EmailAddress ||
      vacancy.contact2PhoneNumber ||
      vacancy.contact2JobTitle
    ) {
      contacts.push({
        name: vacancy.contact2Name ?? undefined,
        email: vacancy.contact2EmailAddress ?? undefined,
        phone: vacancy.contact2PhoneNumber ?? undefined,
        jobTitle: vacancy.contact2JobTitle ?? undefined,
      })
    }

    const [
      intro,
      qualificationRequirements,
      tasksAndResponsibilities,
      description,
      salaryTerms,
    ] = await Promise.all([
      convertHtmlToContentfulRichText(vacancy.introduction ?? '', 'intro'),
      convertHtmlToContentfulRichText(
        vacancy.qualifications ?? '',
        'qualificationRequirements',
      ),
      convertHtmlToContentfulRichText(
        vacancy.assignments ?? '',
        'tasksAndResponsibilities',
      ),
      convertHtmlToContentfulRichText(vacancy.moreInfo ?? '', 'description'),
      convertHtmlToContentfulRichText('', 'salaryTerms'),
    ])

    return {
      id: vacancy.vacancyID
        ? `${EXTERNAL_SYSTEM_ID_PREFIX}${vacancy.vacancyID}`
        : undefined,
      title: vacancy.heading ?? undefined,
      applicationDeadlineFrom: formatDate(vacancy.publishDate),
      applicationDeadlineTo: formatDate(vacancy.openTo),
      intro,
      fieldOfWork: vacancy.jobTitle ?? undefined,
      institutionName: vacancy.orgName ?? undefined,
      institutionReferenceIdentifier: (() => {
        const orgNrStr =
          typeof vacancy.orgNr === 'number' && vacancy.orgNr !== null
            ? String(vacancy.orgNr)
            : vacancy.orgNr ?? undefined

        if (!orgNrStr) {
          return undefined
        }

        if (!orgNrStr.startsWith('0') && orgNrStr.length !== 5) {
          return `0${orgNrStr}`
        }

        return orgNrStr
      })(),
      logoUrl: vacancy.logoUrl ?? undefined,
      locations,
      contacts,
      jobPercentage: vacancy.hoursRatio ?? undefined,
      applicationHref: vacancy.webLinkUrl ?? undefined,
      qualificationRequirements,
      tasksAndResponsibilities,
      description,
      salaryTerms,
      plainTextIntro: documentToPlainTextString(intro.document),
      creationDate: formatDate(vacancy.creationDate),
      updatedDate: formatDate(vacancy.updatedDate),
    }
  }

// ============================================================================
// Mappers for CMS (Contentful)
// ============================================================================

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
    creationDate: formatDate(vacancy.createdAt),
    updatedDate: formatDate(vacancy.updatedAt),
  }
}

export const mapVacancyListItemFromCms = (
  vacancy: Vacancy,
): VacancyWithCreationDate => {
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
    creationDate: formatDate(vacancy.createdAt),
    updatedDate: formatDate(vacancy.updatedAt),
    // Internal field for sorting
    _creationDate: vacancy.createdAt ? new Date(vacancy.createdAt) : undefined,
  }
}
