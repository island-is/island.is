import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/shared'
import PDFDocument from 'pdfkit'
import { ApplicationDto } from '../app/modules/applications/models/dto/application.dto'

const formatValue = (value: unknown, fieldType: string): string => {
  if (fieldType === FieldTypesEnum.CHECKBOX) {
    return value === true ? 'Valið' : 'Ekki valið'
  }

  if (fieldType === FieldTypesEnum.BANK_ACCOUNT && value === '--') return ''

  if (
    fieldType === FieldTypesEnum.DROPDOWN_LIST ||
    fieldType === FieldTypesEnum.RADIO_BUTTONS ||
    fieldType === FieldTypesEnum.ASSETS
  ) {
    if (typeof value === 'object' && value !== null && 'is' in value) {
      return String((value as { is?: unknown }).is ?? '')
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

export const buildApplicationPdf = (
  application: ApplicationDto,
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 56, size: 'A4' })
    const chunks: Buffer[] = []

    document.on('data', (chunk) => chunks.push(chunk))
    document.on('end', () => resolve(Buffer.concat(chunks)))
    document.on('error', reject)

    document.info.Title = application.formName?.is ?? 'Umsókn'
    document.fontSize(20).text(application.formName?.is ?? 'Umsókn')
    document.moveDown(0.5)
    document.fontSize(10).text(`Númer: ${application.id ?? ''}`)
    if (application.submittedAt) {
      document.text(
        `Móttekin: ${new Date(application.submittedAt).toLocaleString(
          'is-IS',
        )}`,
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
      document.moveDown()
      if (section.sectionType !== SectionTypes.PARTIES) {
        document.font('Helvetica-Bold').fontSize(15).text(section.name.is)
      }

      for (const screen of section.screens ?? []) {
        if (screen.isHidden) continue
        if (screen.name.is) {
          document.moveDown(0.5)
          document.font('Helvetica-Bold').fontSize(12).text(screen.name.is)
        }

        for (const field of screen.fields ?? []) {
          if (field.isHidden || field.fieldType === FieldTypesEnum.MESSAGE) {
            continue
          }

          if (section.sectionType !== SectionTypes.PARTIES) {
            document
              .moveDown(0.35)
              .font('Helvetica-Bold')
              .fontSize(10)
              .text(`${field.name.is}${field.isRequired ? '*' : ''}`)
          }

          const values = field.values ?? []
          values.forEach((value, index) => {
            const prefix = values.length > 1 ? `${index + 1}. ` : ''
            const json = value?.json
            const lines =
              field.fieldType === FieldTypesEnum.FILE
                ? fileNames(json)
                : typeof json === 'object' && json !== null
                ? Object.entries(json)
                    .filter(
                      ([key]) =>
                        ![
                          'delegationType',
                          'isLoggedInUser',
                          'applicantType',
                        ].includes(key),
                    )
                    .map(([, entry]) => formatValue(entry, field.fieldType))
                    .filter(Boolean)
                : [formatValue(json, field.fieldType)].filter(Boolean)

            document
              .font('Helvetica')
              .fontSize(10)
              .text(`${prefix}${lines.join('\n')}`)
          })
        }
      }
    }

    document.end()
  })
