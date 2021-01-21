import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'
import fs from 'fs'

export function writeFile(fileName: string, documentContent: string) {
  fs?.writeFileSync(`../${fileName}`, documentContent, { encoding: 'binary' })
}

export async function generateResidenceChangePdf(
  childrenAppliedFor: [{name: string, ssn: string}],
  parentA: {name: string, ssn: string, phoneNumber: string, email:string, homeAddress: string, postalCode: string, city: string},
  parentB: {name: string, ssn: string, phoneNumber: string, email:string, homeAddress: string, postalCode: string, city: string},
  expiry: string
): Promise<string> {

  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 40,
      left: 50,
      right: 50,
    },
  })

  const boldFont = 'Helvetica-Bold'
  const normalFont = 'Helvetica'
  const permanent = 'permanent'
  const headerFontSize = 26
  const subheadingFontSize = 14
  const valueFontSize = 12
  const largeLineGap = 24
  const normalLineGap = 8
  const noLineGap = 0

  const parentHomeAddress = (parent: {name: string, ssn: string, phoneNumber: string, email:string, homeAddress: string, postalCode: string, city: string}) => {
    return `${parent.homeAddress}, ${parent.postalCode} ${parent.city}`
  }

  const addParentToDoc = (header: string, parent: {name: string, ssn: string, phoneNumber: string, email:string, homeAddress: string, postalCode: string, city: string}) => {
    addToDoc(boldFont, subheadingFontSize, normalLineGap, header)
    addToDoc(normalFont, valueFontSize, noLineGap, `Nafn: ${parent.name}`)

    doc
      .text(`Kennitala: ${parent.ssn}`)
      .text(`Netfang: ${parent.email}`)
      .text(`Símanúmer: ${parent.phoneNumber}`)
      .lineGap(largeLineGap)
      .text(`Heimilisfang: ${parentHomeAddress(parent)}`)

  }
  const addToDoc = (font: string, fontSize: number, lineGap: number, text: string) => {
    doc
      .font(font)
      .fontSize(fontSize)
      .lineGap(lineGap)
      .text(text)
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  addToDoc(boldFont, headerFontSize, normalLineGap, 'Samningur foreldra með sameiginlega forsjá um breytt lögheimili barna')
  addToDoc(normalFont, subheadingFontSize, largeLineGap, 'skv. 32.gr. barnalaga nr. 76/2003')
  addToDoc(boldFont, subheadingFontSize, normalLineGap, 'Barn/börn undir 18 ára aldri sem erindið varðar')

  childrenAppliedFor.map((c, i) => addToDoc(normalFont, valueFontSize, i === childrenAppliedFor.length - 1 ? largeLineGap: noLineGap, `Nafn og kennitala barns: ${c.name}, ${c.ssn}`))

  addParentToDoc('Foreldri A', parentA)
  addParentToDoc('Foreldri B', parentB)

  addToDoc(boldFont, subheadingFontSize, normalLineGap, 'Lögheimilsbreyting:')
  addToDoc(normalFont, valueFontSize, noLineGap, `Fyrra lögheimili: ${parentHomeAddress(parentA)}`)
  addToDoc(normalFont, valueFontSize, largeLineGap, `Fyrra lögheimili: ${parentHomeAddress(parentB)}`)

  addToDoc(boldFont, subheadingFontSize, normalLineGap, 'Gildistími samnings')
  addToDoc(normalFont, valueFontSize, noLineGap, expiry === permanent ? 'Samningurinn er til frambúðar, þar til barnið hefur náð 18 ára aldri.' : `Samningurinn gildir til ${expiry}`)

  doc.end()

  // wait for the writing to finish

  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  writeFile(`${parentA.ssn}-domicile-transfer.pdf`, pdf as string)

  return pdf
}
