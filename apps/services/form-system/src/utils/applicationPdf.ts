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
  accentMinimal: '#F2F7FF',
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
const fieldIndent = 20

const translations = {
  application: { is: 'Umsókn', en: 'Application' },
  applicationNumber: { is: 'Númer umsóknar', en: 'Application number' },
  received: { is: 'Móttekin', en: 'Received' },
  page: { is: 'Bls.', en: 'Page' },
  selected: { is: 'Hakað við', en: 'checked' },
  notSelected: { is: 'Ekki hakað við', en: 'Not checked' },
  noAnswer: { is: 'Ekkert svar skráð', en: 'No answer provided' },
  premises: { is: 'Gagnaöflun', en: 'Data collection' },
  premisesIntroduction: {
    is: 'Eftirfarandi upplýsingar verða sóttar rafrænt.',
    en: 'The following information will be retrieved electronically.',
  },
  nationalRegistryInformation: {
    is: 'Upplýsingar frá Þjóðskrá',
    en: 'Information from Registers Iceland',
  },
  nationalRegistryDescription: {
    is: 'Upplýsingar um nafn, kennitölu og lögheimili',
    en: 'Information about name, national ID and legal domicile',
  },
  islandIsInformation: {
    is: 'Upplýsingar frá Ísland.is',
    en: 'Information from Ísland.is',
  },
  islandIsDescription: {
    is: 'Upplýsingar um símanúmer og netfang.',
    en: 'Information about phone number and email address.',
  },
  premisesAgreement: {
    is: 'Ég skil að ofangreindra upplýsinga verði aflað',
    en: 'I understand that the above-mentioned information will be collected',
  },
  checked: { is: 'Hakað við', en: 'Checked' },
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

type ValueLine = { prefix: string; text: string }

const fieldLines = (
  field: {
    fieldType: string
    fieldSettings?: { isAddressRequired?: boolean }
    values?: Array<{ json?: unknown }>
  },
  locale: Locale,
): ValueLine[] => {
  const values = field.values ?? []

  return values.flatMap((value, index) => {
    const prefix = values.length > 1 ? `${index + 1}. ` : ''
    const json = value?.json
    if (field.fieldType === FieldTypesEnum.FILE) {
      return fileNames(json).map((fileName, lineIndex) => ({
        prefix: lineIndex === 0 ? prefix : '',
        text: fileName,
      }))
    }

    if (typeof json !== 'object' || json === null) {
      const formatted = formatValue(json, field.fieldType, locale)
      return formatted ? [{ prefix, text: formatted }] : []
    }

    const entries = Object.entries(json).filter(([key]) => {
      if (['delegationType', 'isLoggedInUser', 'applicantType'].includes(key)) {
        return false
      }

      if (
        field.fieldType === FieldTypesEnum.APPLICANT &&
        (key === 'municipality' ||
          ((key === 'address' || key === 'postalCode') &&
            field.fieldSettings?.isAddressRequired !== true))
      ) {
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
            {
              prefix: itemPrefix,
              text: `${textFor(
                getLanguageTypeForValueTypeAttribute(key),
                locale,
              )}: ${formatted}`,
            },
          ]
        : [{ prefix: itemPrefix, text: formatted }]
    })
  })
}

const drawValue = (
  document: PDFKit.PDFDocument,
  label: string,
  value: string,
  showLabel: boolean,
  hasValue: boolean,
  valueLines?: ValueLine[],
) => {
  const labelHeight = showLabel
    ? document
        .font('Helvetica-Bold')
        .fontSize(9)
        .heightOfString(label, {
          width: contentWidth - fieldIndent - 32,
        }) + 6
    : 0
  const valueWidth = contentWidth - fieldIndent - 32
  document.fontSize(10)
  const valueHeight = valueLines
    ? valueLines.reduce((height, line) => {
        const prefixWidth = document
          .font('Helvetica-Bold')
          .widthOfString(line.prefix)
        return (
          height +
          document.font('Helvetica').heightOfString(line.text, {
            width: valueWidth,
            indent: prefixWidth,
          })
        )
      }, 0)
    : document.font('Helvetica').heightOfString(value, { width: valueWidth })
  const blockHeight = Math.max(42, labelHeight + valueHeight + 28)

  ensureSpace(document, blockHeight + 8)
  const top = document.y
  document
    .roundedRect(
      pageMargin + fieldIndent,
      top,
      contentWidth - fieldIndent,
      blockHeight,
      4,
    )
    .fillAndStroke(colors.surface, colors.border)

  let textTop = top + 14
  if (showLabel) {
    document
      .fillColor(colors.ink)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(label, pageMargin + fieldIndent + 16, textTop, {
        width: contentWidth - fieldIndent - 32,
      })
    textTop += labelHeight
  }

  document
    .fillColor(hasValue ? colors.ink : colors.muted)
    .font('Helvetica')
    .fontSize(10)
  if (valueLines) {
    document.y = textTop
    for (const line of valueLines) {
      if (line.prefix) {
        document
          .font('Helvetica-Bold')
          .text(line.prefix, pageMargin + fieldIndent + 16, document.y, {
            width: valueWidth,
            continued: true,
          })
        document.font('Helvetica').text(line.text, { continued: false })
      } else {
        document
          .font('Helvetica')
          .text(line.text, pageMargin + fieldIndent + 16, document.y, {
            width: valueWidth,
          })
      }
    }
  } else {
    document.text(value, pageMargin + fieldIndent + 16, textTop, {
      width: valueWidth,
    })
  }
  document.y = top + blockHeight + 8
}

const drawMessage = (
  document: PDFKit.PDFDocument,
  header: string,
  description: string,
) => {
  if (!header && !description) return

  const textOptions = { width: contentWidth - fieldIndent - 32 }
  const headerHeight = header
    ? document
        .font('Helvetica-Bold')
        .fontSize(11)
        .heightOfString(header, textOptions) + 6
    : 0
  const descriptionHeight = description
    ? document
        .font('Helvetica')
        .fontSize(10)
        .heightOfString(description, textOptions)
    : 0
  ensureSpace(document, headerHeight + descriptionHeight + 24)
  document.y += 10
  document.fillColor(colors.ink)
  if (header) {
    document
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(header, pageMargin + fieldIndent + 16, document.y, textOptions)
    document.y += 6
  }
  if (description) {
    document
      .font('Helvetica')
      .fontSize(10)
      .text(description, pageMargin + fieldIndent + 16, document.y, textOptions)
  }
  document.y += 14
}

const drawField = (
  document: PDFKit.PDFDocument,
  field: {
    name: { is: string }
    description?: { is?: string; en?: string }
    isRequired?: boolean
    fieldType: string
    fieldSettings?: { isAddressRequired?: boolean }
    values?: Array<{ json?: unknown }>
  },
  showLabel: boolean,
  locale: Locale,
) => {
  if (field.fieldType === FieldTypesEnum.MESSAGE) {
    drawMessage(
      document,
      textFor(field.name, locale),
      textFor(field.description, locale),
    )
    return
  }

  const lines = fieldLines(field, locale)
  drawValue(
    document,
    `${textFor(field.name, locale)}${field.isRequired ? ' *' : ''}`,
    lines.map((line) => `${line.prefix}${line.text}`).join('\n') ||
      textFor(translations.noAnswer, locale),
    showLabel,
    lines.length > 0,
    lines.some((line) => line.prefix) ? lines : undefined,
  )
}

const drawScreenHeading = (document: PDFKit.PDFDocument, name: string) => {
  if (!name) return

  ensureSpace(document, screenContentReservation)
  document.moveDown(0.4)
  const top = document.y
  document
    .roundedRect(
      pageMargin + screenIndent,
      top,
      contentWidth - screenIndent,
      30,
      4,
    )
    .fillAndStroke(colors.accentMinimal, colors.accentSoft)
    .fillColor(colors.ink)
    .font('Helvetica-Bold')
    .fontSize(11)
    .text(name, pageMargin + screenIndent + 12, top + 9, {
      width: contentWidth - screenIndent - 24,
    })
  document.y = top + 38
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

    const premises = application.sections?.find(
      (section) => section.sectionType === SectionTypes.PREMISES,
    )
    if (application.sectionInfo && !premises?.isHidden) {
      ensureSpace(document, sectionContentReservation)
      document.moveDown(1.2)
      const top = document.y
      document
        .roundedRect(pageMargin, top, contentWidth, 32, 4)
        .fill(colors.accent)
        .fillColor(colors.white)
        .font('Helvetica-Bold')
        .fontSize(13)
        .text(
          textFor(premises?.name, locale) ||
            textFor(translations.premises, locale),
          pageMargin + 14,
          top + 9,
          { width: contentWidth - 28 },
        )
      document.y = top + 40

      drawScreenHeading(
        document,
        textFor(translations.premisesIntroduction, locale),
      )
      const premiseValues = [
        {
          title: translations.nationalRegistryInformation,
          description: translations.nationalRegistryDescription,
        },
        {
          title: translations.islandIsInformation,
          description: translations.islandIsDescription,
        },
        ...(application.sectionInfo.additionalPremises ?? []),
      ]
      for (const premise of premiseValues) {
        drawMessage(
          document,
          textFor(premise.title, locale),
          textFor(premise.description, locale),
        )
      }
      drawValue(
        document,
        textFor(translations.premisesAgreement, locale),
        textFor(translations.checked, locale),
        true,
        true,
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

      for (const screen of section.screens ?? []) {
        if (screen.isHidden) continue
        drawScreenHeading(document, textFor(screen.name, locale))

        for (const field of screen.fields ?? []) {
          if (field.isHidden) continue

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
