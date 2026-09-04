import fs from 'fs'
import os from 'os'
import path from 'path'
import { PDFArray, PDFDict, PDFDocument, PDFName, PDFRef } from 'pdf-lib'

import { createTestIntl } from '@island.is/cms-translations/test'

import { IndictmentSubtype } from '@island.is/judicial-system/types'

import {
  Case,
  Defendant,
  PoliceDigitalCaseFile,
} from '../../modules/repository'
import { createCaseFilesRecord, formatDefendant } from './caseFilesRecordPdf'

describe('FormatDefendant', () => {
  test('with national id', () => {
    const result = formatDefendant({
      name: 'John Doe',
      address: '123 Main Street',
      nationalId: '1234567890',
    } as Defendant)

    expect(result).toBe('John Doe, kt. 123456-7890, 123 Main Street')
  })

  test('with date of birth', () => {
    const result = formatDefendant({
      name: 'John Doe',
      address: '123 Main Street',
      noNationalId: true,
      nationalId: '01.10.1999',
    } as Defendant)

    expect(result).toBe('John Doe, fd. 01.10.1999, 123 Main Street')
  })

  test('without nationa id and date of birth', () => {
    const result = formatDefendant({
      name: 'John Doe',
      address: '123 Main Street',
      noNationalId: true,
    } as Defendant)

    expect(result).toBe('John Doe, 123 Main Street')
  })
})

describe('createCaseFilesRecord - table of contents', () => {
  const formatMessage = createTestIntl({
    locale: 'is-IS',
    onError: jest.fn,
  }).formatMessage

  const policeCaseNumber = '007-2024-000001'

  const theCase = {
    id: 'case-id',
    prosecutorsOffice: { name: 'Héraðssaksóknari' },
    defendants: [
      {
        name: 'Jón Jónsson',
        nationalId: '0101012519',
        address: 'Suðurgata 1',
      },
    ],
    indictmentSubtypes: { [policeCaseNumber]: [IndictmentSubtype.THEFT] },
  } as unknown as Case

  // The number of files per chapter is chosen so that one table of contents
  // row starts in the narrow band just above the bottom margin of the cover
  // page (y ≈ 756, where the invisible line-link text still fits on the page
  // but the date/page number - drawn with marginTop 1 - does not)
  const chapterCounts = [10, 5, 6, 4, 4]
  const caseFiles = chapterCounts.flatMap((count, chapter) =>
    Array.from({ length: count }, (_, index) => async () => ({
      date: new Date('2024-03-01T10:00:00Z'),
      name: `Skjal ${chapter + 1}.${index + 1}`,
      chapter,
      buffer: undefined, // each file renders as a one-page missing-file page
    })),
  )

  // Realistic police digital case file names: long and without any whitespace
  const policeDigitalCaseFiles = Array.from({ length: 5 }, (_, index) => ({
    id: `digital-${index + 1}`,
    name: `Hljodupptaka_007-2024-000001_yfirheyrsla_nr_${
      index + 1
    }_2024-03-01.mp4`,
    policeDigitalFileId: `IDES-${1000 + index}`,
    policeExternalVendorId: `VENDOR-${2000 + index}`,
    displayDate: new Date('2024-03-02T10:00:00Z'),
    orderWithinChapter: index,
  })) as unknown as PoliceDigitalCaseFile[]

  it('should not insert extra pages when stamping page numbers', async () => {
    const pdf = await createCaseFilesRecord(
      theCase,
      policeCaseNumber,
      caseFiles,
      policeDigitalCaseFiles,
      formatMessage,
    )

    const outPath = path.join(os.tmpdir(), 'caseFilesRecord.pdf')
    fs.writeFileSync(outPath, pdf)

    console.log(`Case files record written to ${outPath}`)

    const document = await PDFDocument.load(new Uint8Array(pdf))

    // 1 cover page + 1 table of contents page + 29 case file pages
    // + 1 digital case files page = 32 pages
    // Guards against a regression where stamping the page number of a table
    // of contents row starting in the overflow window triggered
    // auto-pagination, inserting a phantom page into the finished document
    // and tearing the table of contents apart (stray page numbers on the
    // phantom page, none on the real table of contents page, and all page
    // references off by one)
    expect(document.getPageCount()).toBe(32)
  })

  it('should reference each digital case file page in the table of contents', async () => {
    // Eight digital case files: the first seven fill the first digital case
    // files page and the eighth overflows to a second page. The eighth also
    // has no display date.
    const digitalCaseFiles = Array.from({ length: 8 }, (_, index) => ({
      id: `digital-${index + 1}`,
      name: `Hljodupptaka_007-2024-000001_yfirheyrsla_nr_${
        index + 1
      }_2024-03-01.mp4`,
      policeDigitalFileId: `IDES-${1000 + index}`,
      policeExternalVendorId: `VENDOR-${2000 + index}`,
      displayDate: index < 7 ? new Date('2024-03-02T10:00:00Z') : undefined,
      orderWithinChapter: index,
    })) as unknown as PoliceDigitalCaseFile[]

    const pdf = await createCaseFilesRecord(
      theCase,
      policeCaseNumber,
      caseFiles,
      digitalCaseFiles,
      formatMessage,
    )

    const outPath = path.join(os.tmpdir(), 'caseFilesRecord-digital.pdf')
    fs.writeFileSync(outPath, pdf)

    console.log(`Case files record written to ${outPath}`)

    const document = await PDFDocument.load(new Uint8Array(pdf))

    // 1 cover page + 1 table of contents page + 29 case file pages
    // + 2 digital case files pages = 33 pages
    expect(document.getPageCount()).toBe(33)

    const pages = document.getPages()
    const linkTargets = collectLinkTargets(document)

    // The table of contents should link to both digital case files pages.
    // The last page is only linked if the file without a display date is
    // listed in the table of contents and its row links to the second
    // digital case files page instead of the first
    expect(linkTargets.has(pages[31].ref.toString())).toBe(true)
    expect(linkTargets.has(pages[32].ref.toString())).toBe(true)
  })
})

const collectLinkTargets = (document: PDFDocument): Set<string> => {
  const targets = new Set<string>()

  for (const page of document.getPages()) {
    const annots = page.node.Annots()

    if (!annots) {
      continue
    }

    for (let index = 0; index < annots.size(); index++) {
      const annot = document.context.lookup(annots.get(index))

      if (!(annot instanceof PDFDict)) {
        continue
      }

      const dest = annot.lookup(PDFName.of('Dest'))

      if (!(dest instanceof PDFArray)) {
        continue
      }

      const target = dest.get(0)

      if (target instanceof PDFRef) {
        targets.add(target.toString())
      }
    }
  }

  return targets
}
