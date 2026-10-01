import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/shared'
import type { Locale } from '@island.is/shared/types'
import PDFDocument from 'pdfkit'
import { getLanguageTypeForValueTypeAttribute } from '../app/dataTypes/valueTypes/valueType.helper'
import { ApplicationDto } from '../app/modules/applications/models/dto/application.dto'

const colors = {
  ink: '#00003C',
  muted: '#33335A',
  accent: '#0061FF',
  accentSoft: '#CCDFFF',
  surface: '#FFFFFF',
  border: '#CCDFFF',
  white: '#FFFFFF',
}

const pageMargin = 56
const contentWidth = 483
const footerHeight = 28
const sectionContentReservation = 150
const screenContentReservation = 90
const screenIndent = 10

const translations = {
  application: { is: 'Umsókn', en: 'Application' },
  applicationNumber: { is: 'Númer umsóknar', en: 'Application number' },
  received: { is: 'Móttekin', en: 'Received' },
  page: { is: 'Bls.', en: 'Page' },
  selected: { is: 'Valið', en: 'Selected' },
  notSelected: { is: 'Ekki valið', en: 'Not selected' },
  noAnswer: { is: 'Ekkert svar skráð', en: 'No answer provided' },
}

const textFor = (
  value: { is?: string; en?: string } | undefined,
  locale: Locale,
) => (locale === 'en' ? value?.en || value?.is : value?.is || value?.en) ?? ''

const formatDate = (
  value: Date | string | null | undefined,
  locale: Locale,
) => {
  if (!value) return ''

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(locale === 'en' ? 'en-GB' : 'is-IS')
}

const truncateText = (
  document: PDFKit.PDFDocument,
  text: string,
  maxWidth: number,
) => {
  if (document.widthOfString(text) <= maxWidth) return text

  const suffix = '...'
  let truncated = text
  while (
    truncated.length > 0 &&
    document.widthOfString(`${truncated}${suffix}`) > maxWidth
  ) {
    truncated = truncated.slice(0, -1)
  }

  return `${truncated}${suffix}`
}

const formatValue = (
  value: unknown,
  fieldType: string,
  locale: Locale,
): string => {
  if (fieldType === FieldTypesEnum.CHECKBOX) {
    return value === true
      ? textFor(translations.selected, locale)
      : textFor(translations.notSelected, locale)
  }

  if (fieldType === FieldTypesEnum.BANK_ACCOUNT && value === '--') return ''

  if (
    fieldType === FieldTypesEnum.DROPDOWN_LIST ||
    fieldType === FieldTypesEnum.RADIO_BUTTONS ||
    fieldType === FieldTypesEnum.ASSETS
  ) {
    if (typeof value === 'object' && value !== null && 'is' in value) {
      return textFor(value as { is?: string; en?: string }, locale)
    }
  }

  if (fieldType === FieldTypesEnum.DATE_PICKER && typeof value === 'string') {
    const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
    if (isoDate) return `${isoDate[3]}.${isoDate[2]}.${isoDate[1]}`
  }

  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const fileNames = (value: unknown): string[] => {
  if (typeof value !== 'object' || value === null || !('s3Key' in value)) {
    return []
  }

  const keys = Array.isArray(value.s3Key) ? value.s3Key : [value.s3Key]
  return keys
    .filter((key): key is string => typeof key === 'string' && key.length > 0)
    .map((key) => {
      const storedName = key.split('/').pop() ?? key
      const separator = storedName.indexOf('_')
      return separator >= 0 ? storedName.slice(separator + 1) : storedName
    })
}

const drawPageChrome = (
  document: PDFKit.PDFDocument,
  title: string,
  locale: Locale,
  page: number,
) => {
  const { width, height } = document.page
  const footerTop = height - pageMargin - footerHeight
  const { x, y } = document
  const pageNumber = `${textFor(translations.page, locale)} ${page}`

  document.save()
  document.fillColor(colors.accent).rect(0, 0, width, 8).fill()
  document
    .fillColor(colors.muted)
    .font('Helvetica')
    .fontSize(8)
    .text(
      truncateText(
        document,
        title,
        contentWidth - document.widthOfString(pageNumber) - 16,
      ),
      pageMargin,
      footerTop,
    )
  document.text(
    pageNumber,
    pageMargin + contentWidth - document.widthOfString(pageNumber),
    footerTop,
  )
  document.restore()
  document.x = x
  document.y = y
}

const ensureSpace = (document: PDFKit.PDFDocument, height: number) => {
  if (document.y + height <= document.page.height - pageMargin - footerHeight) {
    return
  }
  document.addPage()
}

const fieldLines = (
  field: {
    fieldType: string
    values?: Array<{ json?: unknown }>
  },
  locale: Locale,
): string[] => {
  const values = field.values ?? []

  return values.flatMap((value, index) => {
    const prefix = values.length > 1 ? `${index + 1}. ` : ''
    const json = value?.json
    if (field.fieldType === FieldTypesEnum.FILE) {
      return fileNames(json).map((fileName, lineIndex) =>
        lineIndex === 0 ? `${prefix}${fileName}` : fileName,
      )
    }

    if (typeof json !== 'object' || json === null) {
      const formatted = formatValue(json, field.fieldType, locale)
      return formatted ? [`${prefix}${formatted}`] : []
    }

    const entries = Object.entries(json).filter(([key]) => {
      if (['delegationType', 'isLoggedInUser', 'applicantType'].includes(key)) {
        return false
      }

      return !(
        (field.fieldType === FieldTypesEnum.DROPDOWN_LIST ||
          field.fieldType === FieldTypesEnum.RADIO_BUTTONS) &&
        key === 'value'
      )
    })
    const isMultiAttribute = entries.length > 1

    return entries.flatMap(([key, entry], entryIndex) => {
      const formatted =
        field.fieldType === FieldTypesEnum.DATE_PICKER && key === 'date'
          ? formatDate(entry as Date | string | null | undefined, locale)
          : formatValue(entry, field.fieldType, locale)
      if (!formatted) return []

      const itemPrefix = entryIndex === 0 ? prefix : ''
      return isMultiAttribute
        ? [
            `${itemPrefix}${textFor(
              getLanguageTypeForValueTypeAttribute(key),
              locale,
            )}: ${formatted}`,
          ]
        : [`${itemPrefix}${formatted}`]
    })
  })
}

const drawField = (
  document: PDFKit.PDFDocument,
  field: {
    name: { is: string }
    isRequired?: boolean
    fieldType: string
    values?: Array<{ json?: unknown }>
  },
  showLabel: boolean,
  locale: Locale,
) => {
  const lines = fieldLines(field, locale)
  const value = lines.join('\n') || textFor(translations.noAnswer, locale)
  const label = `${textFor(field.name, locale)}${field.isRequired ? ' *' : ''}`
  const labelHeight = showLabel
    ? document
        .font('Helvetica-Bold')
        .fontSize(9)
        .heightOfString(label, {
          width: contentWidth - 32,
        }) + 6
    : 0
  const valueHeight = document
    .font('Helvetica')
    .fontSize(10)
    .heightOfString(value, {
      width: contentWidth - 32,
    })
  const blockHeight = Math.max(42, labelHeight + valueHeight + 28)

  ensureSpace(document, blockHeight + 8)
  const top = document.y
  document
    .roundedRect(pageMargin, top, contentWidth, blockHeight, 4)
    .fillAndStroke(colors.surface, colors.border)

  let textTop = top + 14
  if (showLabel) {
    document
      .fillColor(colors.ink)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(label, pageMargin + 16, textTop, { width: contentWidth - 32 })
    textTop += labelHeight
  }

  document
    .fillColor(lines.length ? colors.ink : colors.muted)
    .font('Helvetica')
    .fontSize(10)
    .text(value, pageMargin + 16, textTop, { width: contentWidth - 32 })
  document.y = top + blockHeight + 8
}

export const buildApplicationPdf = (
  application: ApplicationDto,
  locale: Locale = 'is',
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const title =
      textFor(application.formName, locale) ||
      textFor(translations.application, locale)
    const document = new PDFDocument({ margin: pageMargin, size: 'A4' })
    const chunks: Buffer[] = []
    let page = 1

    document.on('data', (chunk) => chunks.push(chunk))
    document.on('end', () => resolve(Buffer.concat(chunks)))
    document.on('error', reject)
    document.on('pageAdded', () => {
      page += 1
      drawPageChrome(document, title, locale, page)
    })

    document.info.Title = title
    drawPageChrome(document, title, locale, page)
    document
      .fillColor(colors.accent)
      .font('Helvetica-Bold')
      .fontSize(20)
      .text(title)
    document.moveDown(0.45)
    document
      .fillColor(colors.muted)
      .font('Helvetica')
      .fontSize(10)
      .text(
        `${textFor(translations.applicationNumber, locale)}: ${
          application.id ?? ''
        }`,
      )
    if (application.submittedAt) {
      document.text(
        `${textFor(translations.received, locale)}: ${new Date(
          application.submittedAt,
        ).toLocaleString(locale === 'en' ? 'en-GB' : 'is-IS')}`,
      )
    }

    const sections =
      application.sections?.filter(
        (section) =>
          !section.isHidden &&
          section.sectionType !== SectionTypes.PREMISES &&
          section.sectionType !== SectionTypes.SUMMARY &&
          section.sectionType !== SectionTypes.COMPLETED,
      ) ?? []

    for (const section of sections) {
      ensureSpace(document, sectionContentReservation)
      document.moveDown(1.2)
      if (section.sectionType !== SectionTypes.PARTIES) {
        const top = document.y
        document
          .roundedRect(pageMargin, top, contentWidth, 32, 4)
          .fill(colors.accent)
          .fillColor(colors.white)
          .font('Helvetica-Bold')
          .fontSize(13)
          .text(textFor(section.name, locale), pageMargin + 14, top + 9, {
            width: contentWidth - 28,
          })
        document.y = top + 40
      }

      for (const screen of section.screens ?? []) {
        if (screen.isHidden) continue
        if (textFor(screen.name, locale)) {
          ensureSpace(document, screenContentReservation)
          document.moveDown(0.4)
          const top = document.y
          document
            .fillColor(colors.ink)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text(textFor(screen.name, locale), pageMargin + screenIndent, top)
          document
            .moveTo(pageMargin + screenIndent, top + 18)
            .lineTo(pageMargin + contentWidth, top + 18)
            .lineWidth(1)
            .strokeColor(colors.accentSoft)
            .stroke()
          document.y = top + 26
        }

        for (const field of screen.fields ?? []) {
          if (field.isHidden || field.fieldType === FieldTypesEnum.MESSAGE) {
            continue
          }

          drawField(
            document,
            field,
            section.sectionType !== SectionTypes.PARTIES,
            locale,
          )
        }
      }
    }

    document.end()
  })
