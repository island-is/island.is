import PDFDocument from 'pdfkit'
import getStream from 'get-stream'
import { PassThrough } from 'stream'
import { infer as zinfer } from 'zod'
import { inheritanceReportSchema } from '@island.is/application/templates/inheritance-report'

type InheritanceSchema = zinfer<typeof inheritanceReportSchema>

const moveDownBy = (n: number, doc: PDFKit.PDFDocument) => {
  for (let i = 0; i < n; i++) {
    doc.moveDown()
  }
}

const fieldWithValue = (
  doc: PDFKit.PDFDocument,
  field: string,
  value: string,
): void => {
  doc
    .font('Helvetica-Bold')
    .text(field, { continued: true })
    .font('Helvetica')
    .text(`: ${value}`)
}

const formatNumber = (value?: number): string =>
  typeof value === 'number' ? value.toLocaleString('is-IS') : '-'

/**
 * Renders a human-readable PDF copy of an inheritance report application.
 * Used to email a copy of the application to the parties (málsaðilar).
 */
export const transformInheritanceReportToPDFStream = async (
  answers: InheritanceSchema,
  applicationId: string,
  title: string,
): Promise<Buffer> => {
  const doc = new PDFDocument()
  const fontSizes = { title: 20, subtitle: 16, text: 12 }

  doc.fontSize(fontSizes.title).text(title, { align: 'center' })
  moveDownBy(3, doc)

  doc.fontSize(fontSizes.subtitle).text('Umsækjandi')
  doc.fontSize(fontSizes.text)
  fieldWithValue(
    doc,
    'Kennitala',
    answers?.applicant?.nationalId ?? 'Kennitölu vantar',
  )
  fieldWithValue(doc, 'Netfang', answers?.applicant?.email ?? 'Netfang vantar')
  fieldWithValue(
    doc,
    'Símanúmer',
    answers?.applicant?.phone ?? 'Símanúmer vantar',
  )
  fieldWithValue(doc, 'Tengsl', answers?.applicant?.relation ?? 'Tengsl vantar')
  moveDownBy(2, doc)

  const heirs = answers?.heirs?.data ?? []
  if (heirs.length > 0) {
    doc.fontSize(fontSizes.subtitle).text('Erfingjar')
    doc.fontSize(fontSizes.text)
    heirs.forEach((heir, index) => {
      const activeInfo = heir?.enabled === false ? ' (Óvirkjað í umsókn)' : ''
      doc
        .font('Helvetica-Bold')
        .text(`Erfingi ${index + 1}${activeInfo}`)
        .font('Helvetica')
      fieldWithValue(doc, 'Nafn', heir.name ?? 'Nafn vantar')
      fieldWithValue(doc, 'Kennitala', heir.nationalId ?? 'Kennitölu vantar')
      fieldWithValue(doc, 'Tengsl', heir.relation ?? 'Tengsl vantar')
      if (heir.heirsPercentage) {
        fieldWithValue(doc, 'Hlutfall', `${heir.heirsPercentage}%`)
      }
      if (heir.inheritance) {
        fieldWithValue(doc, 'Arfur', heir.inheritance)
      }
      doc.moveDown()
    })
    moveDownBy(1, doc)
  }

  doc.fontSize(fontSizes.subtitle).text('Samtölur')
  doc.fontSize(fontSizes.text)
  fieldWithValue(doc, 'Eignir samtals', formatNumber(answers?.total))
  fieldWithValue(doc, 'Skuldir samtals', formatNumber(answers?.debtsTotal))
  fieldWithValue(doc, 'Hrein eign', formatNumber(answers?.netTotal))
  fieldWithValue(
    doc,
    'Eign til skipta',
    formatNumber(answers?.netPropertyForExchange),
  )
  moveDownBy(2, doc)

  doc
    .text(
      'Þetta skjal var framkallað með sjálfvirkum hætti á island.is þann: ' +
        new Date().toLocaleDateString('is-IS'),
    )
    .moveDown()
    .text(`Kenninúmer umsóknar hjá island.is: ${applicationId}`)

  const stream = new PassThrough()
  doc.pipe(stream)
  doc.end()
  return await getStream.buffer(stream)
}
