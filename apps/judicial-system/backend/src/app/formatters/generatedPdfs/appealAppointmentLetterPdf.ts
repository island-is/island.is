import PDFDocument from 'pdfkit'

import { formatDate } from '@island.is/judicial-system/formatters'

import {
  addEmptyLines,
  addNormalPlusCenteredText,
  addNormalPlusJustifiedText,
  addNormalPlusRightAlignedText,
  addNormalPlusText,
  baseFontSize,
  basePlusFontSize,
  setTitle,
  smallFontSize,
} from '../pdfHelpers'

/** Which kind of advocate the letter appoints, which is most of what differs. */
export enum AppealAppointmentKind {
  DEFENDER = 'DEFENDER',
  SPOKESPERSON = 'SPOKESPERSON',
}

export interface AppealAppointmentLetter {
  kind: AppealAppointmentKind
  /** The advocate being appointed, who is also who the letter is addressed to. */
  advocateName: string
  /** Their firm, as the lawyer register records it. */
  advocatePractice?: string | null
  /** The accused, who names the case whichever advocate is appointed. */
  defendantName: string
  /**
   * The party this advocate is appointed to, which the appointing sentence
   * names. Only a defender's letter carries one - the injured party is not
   * named on the letters this reproduces.
   */
  clientName?: string | null
  /** The district court and its case number, which a completed case always has. */
  courtName: string
  courtCaseNumber: string
  /** The court of appeals number, which nothing records yet. */
  appealCaseNumber?: string | null
  /** When the áfrýjunarstefna was issued. Nothing records it yet. */
  appealSummonsDate?: Date | string | null
  /** Who appointed the advocate, and when - read off the appointment event. */
  appointedBy: { name: string; title?: string | null }
  appointedDate: Date | string
  /** Everyone who gets a copy, one per line in the order the letter lists them. */
  copyTo: string[]
}

// What stands in for a value the portal cannot know yet. The court of appeals
// case number is recorded on a step that does not exist, and the áfrýjunarstefna
// is a document that does not exist - so the two read differently: one is
// missing, the other is not built.
const NO_APPEAL_CASE_NUMBER = 'xxx/xxxx'
const NO_APPEAL_SUMMONS_DATE = 'Ekki útfært'

/**
 * What the copy line says in place of a party the case does not name. A party
 * with nobody recorded is still a party, and saying so reads as a gap to be
 * filled - where leaving the line out reads as a list that is complete.
 */
export const NOT_RECORDED = 'Ekki skráð'

// The court's own stationery, reproduced from the letters on the ticket. Fixed
// text rather than institution data: this letter only ever comes from the court
// of appeals, and the address it carries is the court's, not anything the case
// knows.
const WORDMARK = 'LANDSRÉTTUR'
const FOOTER = [
  'Vesturvör 2  |  200 Kópavogur  |  Sími: 432-5300',
  'Kt. 470717-1060  |  landsrettur@landsrettur.is  |  landsrettur.is',
]

// Measured off those letters, in points. The stationery sits outside the text
// column: the wordmark and its rule at the page's own left margin, the footer
// and its rule mirrored against the right.
const BRAND_COLOUR = '#5B2646'
const PAGE_MARGIN = 36
const TEXT_LEFT = 71
const TEXT_RIGHT = 73
const TEXT_TOP = 96
// The real wordmark is set in a condensed face the built-in PDF fonts cannot
// reach: at the letters' cap height Times is half again as wide. Matched on
// width instead, which is what governs the proportion against the rule below
// it, with the tracking the original has.
const WORDMARK_Y = 40
const WORDMARK_SPACING = 0.8
const HEADER_RULE_Y = 57
const RULE_LENGTH = 261
const FOOTER_RULE_Y = 777
const FOOTER_TEXT_Y = 786
const FOOTER_LINE_HEIGHT = 12
const COPY_BLOCK_Y = 712
const COPY_LINE_HEIGHT = 17
const COPY_BLOCK_GAP = 24
const COPY_BLOCK_BOTTOM_GAP = 14

/** How a criminal case is named: the prosecution against the accused. */
export const getAppealAppointmentCaseTitle = (defendantName: string) =>
  `Ákæruvaldið gegn ${defendantName}`

/**
 * The same title as the letter heads itself with: three lines, which is how a
 * court document names a case.
 */
export const getAppealAppointmentCaseTitleLines = (defendantName: string) => [
  'Ákæruvaldið',
  'gegn',
  defendantName,
]

/** The court of appeals number, or what stands in for it until one is recorded. */
export const getAppealCaseNumberOrPlaceholder = (
  appealCaseNumber?: string | null,
) => appealCaseNumber || NO_APPEAL_CASE_NUMBER

/**
 * The district court as the letter names it: "dómur Héraðsdóms Reykjavíkur",
 * not "dómur Héraðsdómur Reykjavíkur". Icelandic has no general way to decline
 * a name, but every district court is "Héraðsdómur <place>" and only the first
 * word changes - the same substitution the custody notice has made for years.
 */
export const getCourtNameInGenitive = (courtName?: string | null) =>
  courtName?.replace('dómur', 'dóms') ?? ''

/**
 * How the letter names the accused. The title names the case, not the party
 * the letter appoints an advocate for, so a case with several accused carries
 * all of them - abbreviated the way court documents abbreviate it once there
 * are more than two.
 */
export const getAppealAppointmentDefendantNames = (names: string[]): string => {
  if (names.length === 0) {
    return ''
  }

  if (names.length === 1) {
    return names[0]
  }

  return names.length === 2 ? `${names[0]} og ${names[1]}` : `${names[0]} o.fl.`
}

/**
 * Who the letter is addressed to. Every advocate the court appoints is a
 * lawyer, whichever role it appoints them to, and that is how both letters
 * address them, with their firm beneath.
 *
 * The street address that follows on those letters is left out - the lawyer
 * register does not hold one - and so is the firm when the register has not
 * recorded it, rather than leaving a blank line in the block.
 */
export const getAppealAppointmentAddresseeLines = (
  advocateName: string,
  advocatePractice?: string | null,
): string[] =>
  [`${advocateName} lögmaður`, advocatePractice].filter(
    (line): line is string => Boolean(line),
  )

export const getAppealAppointmentSubject = (
  kind: AppealAppointmentKind,
  appealCaseNumber?: string | null,
) =>
  `Skipun ${
    kind === AppealAppointmentKind.DEFENDER ? 'verjanda' : 'réttargæslumanns'
  } í landsréttarmálinu nr. ${getAppealCaseNumberOrPlaceholder(
    appealCaseNumber,
  )}:`

/**
 * The paragraph that does the appointing, which is the point of the letter.
 * One paragraph rather than two lines: the notice about the deadline runs on
 * from the appointment in both letters.
 *
 * The court speaks in its own name rather than addressing the advocate in the
 * formal plural. The old wording - "Þér eruð hér með skipaðir ..." - forced a
 * gender on whoever it was sent to, and had no neutral form that courts use;
 * the registry settled on this instead (parent ticket, 2026-10-09).
 *
 * The defender's letter names the accused they are appointed to, because a
 * case may have several and each gets their own letter. The spokesperson's
 * does not: the injured party is not named on the letters this reproduces.
 */
export const getAppealAppointmentSentence = (
  kind: AppealAppointmentKind,
  clientName?: string | null,
) =>
  `Landsréttur hefur skipað þig ${
    kind === AppealAppointmentKind.DEFENDER
      ? `verjanda ákærða${clientName ? ` ${clientName}` : ''}`
      : 'réttargæslumann brotaþola'
  } í ofangreindu máli. Tilkynnt verður síðar um frest til greinargerðar í málinu.`

/**
 * What reached this court, and how. It carries both values the portal cannot
 * know yet, so it is where the placeholders show.
 */
export const getAppealAppointmentBody = (
  letter: Pick<
    AppealAppointmentLetter,
    | 'courtName'
    | 'courtCaseNumber'
    | 'defendantName'
    | 'appealCaseNumber'
    | 'appealSummonsDate'
  >,
) =>
  `Landsrétti hefur borist dómur ${letter.courtName} í máli nr. ${
    letter.courtCaseNumber
  }; ${getAppealAppointmentCaseTitle(
    letter.defendantName,
  )} sem áfrýjað var með áfrýjunarstefnu útgefinni ${
    letter.appealSummonsDate
      ? formatDate(letter.appealSummonsDate, 'PPP')
      : NO_APPEAL_SUMMONS_DATE
  }. Málsnúmer fyrir Landsrétti er ${getAppealCaseNumberOrPlaceholder(
    letter.appealCaseNumber,
  )}.`

const drawRule = (doc: PDFKit.PDFDocument, x: number, y: number) =>
  doc
    .moveTo(x, y)
    .lineTo(x + RULE_LENGTH, y)
    .lineWidth(1)
    .strokeColor(BRAND_COLOUR)
    .stroke()

/**
 * Draws at an exact spot on the page rather than in the flow.
 *
 * The margins have to come off first: pdfkit treats text that starts below the
 * bottom margin as overflow and silently moves it - and everything after it -
 * onto a new page, which is how the stationery at the foot of this letter
 * turned a one-page letter into three.
 */
const drawAbsolute = (doc: PDFKit.PDFDocument, draw: () => void) => {
  const margins = doc.page.margins

  doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 }

  draw()

  doc.page.margins = margins
}

/** The wordmark and rule at the head of each page, and the address at its foot. */
const drawStationery = (doc: PDFKit.PDFDocument) => {
  const pages = doc.bufferedPageRange()

  for (let page = 0; page < pages.count; page++) {
    doc.switchToPage(page)

    drawAbsolute(doc, () => {
      doc
        .font('Times-Roman')
        .fontSize(baseFontSize)
        .fillColor(BRAND_COLOUR)
        .text(WORDMARK, PAGE_MARGIN, WORDMARK_Y, {
          characterSpacing: WORDMARK_SPACING,
        })

      drawRule(doc, PAGE_MARGIN, HEADER_RULE_Y)

      const footerRight = doc.page.width - PAGE_MARGIN

      drawRule(doc, footerRight - RULE_LENGTH, FOOTER_RULE_Y)

      doc.fontSize(smallFontSize)

      FOOTER.forEach((line, index) =>
        doc.text(
          line,
          PAGE_MARGIN,
          FOOTER_TEXT_Y + index * FOOTER_LINE_HEIGHT,
          { width: footerRight - PAGE_MARGIN, align: 'right' },
        ),
      )

      doc.fillColor('black')
    })
  }
}

/**
 * The copy line, anchored to the foot of the page as the letters have it -
 * unless the body has already run that far, in which case it follows the
 * signature instead of being overprinted by it.
 */
const drawCopyRecipients = (doc: PDFKit.PDFDocument, copyTo: string[]) => {
  const lines = ['Afrit:', ...copyTo]

  // Where the letters put it, unless the list is long enough to reach the
  // stationery - a case with several accused names a party per line - in which
  // case it starts higher so it still ends above the rule. A body that has
  // already run that far pushes it down regardless.
  const top = Math.max(
    doc.y + COPY_BLOCK_GAP,
    Math.min(
      COPY_BLOCK_Y,
      FOOTER_RULE_Y - COPY_BLOCK_BOTTOM_GAP - lines.length * COPY_LINE_HEIGHT,
    ),
  )

  drawAbsolute(doc, () => {
    doc.font('Times-Roman').fontSize(basePlusFontSize).fillColor('black')

    lines.forEach((line, index) =>
      doc.text(line, TEXT_LEFT, top + index * COPY_LINE_HEIGHT),
    )
  })
}

/**
 * The letter by which the Court of Appeals appoints one party's advocate for
 * an appeal.
 *
 * Two letters in one formatter, because they differ in three places only: the
 * subject line, the sentence that appoints, and who is copied. A spokesperson's
 * letter also copies the appointed defenders; a defender's copies the
 * prosecution alone.
 *
 * Laid out from the two letters attached to the ticket, down to where the rules
 * sit and how far the text column is inset. The copy list and the stationery
 * are anchored to the foot of the page as they are there, but the copy list
 * gives way if a long letter would otherwise run into it.
 *
 * Deliberately given everything it prints. The signatory and the date come from
 * the appointment event rather than the party row, which keeps neither, and
 * resolving that is the caller's job - this stays a pure function of its
 * arguments so it can be read against the letter it has to reproduce.
 */
export const createAppealAppointmentLetter = (
  letter: AppealAppointmentLetter,
): Promise<Buffer> => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: TEXT_TOP,
      bottom: PAGE_MARGIN * 2,
      left: TEXT_LEFT,
      right: TEXT_RIGHT,
    },
    bufferPages: true,
  })

  const chunks: Uint8Array[] = []

  doc.on('data', (chunk) => chunks.push(chunk))

  const title = getAppealAppointmentSubject(
    letter.kind,
    letter.appealCaseNumber,
  )

  setTitle(doc, title)

  for (const line of getAppealAppointmentAddresseeLines(
    letter.advocateName,
    letter.advocatePractice,
  )) {
    addNormalPlusText(doc, line, 'Times-Roman')
  }

  addEmptyLines(doc, 3)

  // Where the letter was written and when, as formal letters carry it. The
  // court sits in Kópavogur.
  addNormalPlusRightAlignedText(
    doc,
    `Kópavogi, ${formatDate(letter.appointedDate, 'PPP')}`,
    'Times-Roman',
  )

  addEmptyLines(doc, 2)

  addNormalPlusText(doc, title, 'Times-Bold')

  addEmptyLines(doc)

  for (const line of getAppealAppointmentCaseTitleLines(letter.defendantName)) {
    addNormalPlusText(doc, line, 'Times-Bold')
  }

  addEmptyLines(doc, 2)

  addNormalPlusJustifiedText(
    doc,
    getAppealAppointmentBody(letter),
    'Times-Roman',
  )

  addEmptyLines(doc)

  addNormalPlusJustifiedText(
    doc,
    getAppealAppointmentSentence(letter.kind, letter.clientName),
    'Times-Roman',
  )

  addEmptyLines(doc, 4)

  addNormalPlusCenteredText(doc, 'Fyrir hönd Landsréttar', 'Times-Roman')

  addEmptyLines(doc, 2)

  addNormalPlusCenteredText(doc, letter.appointedBy.name, 'Times-Roman')

  if (letter.appointedBy.title) {
    addNormalPlusCenteredText(doc, letter.appointedBy.title, 'Times-Roman')
  }

  if (letter.copyTo.length > 0) {
    drawCopyRecipients(doc, letter.copyTo)
  }

  // Last, so it lands on every page the letter turned out to need.
  drawStationery(doc)

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(chunks))),
  )
}
