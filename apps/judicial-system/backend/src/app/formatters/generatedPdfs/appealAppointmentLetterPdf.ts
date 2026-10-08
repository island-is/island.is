import PDFDocument from 'pdfkit'

import { formatDate } from '@island.is/judicial-system/formatters'

import {
  addEmptyLines,
  addNormalCenteredText,
  addNormalJustifiedText,
  addNormalText,
  setTitle,
} from '../pdfHelpers'

/** Which kind of advocate the letter appoints, which is most of what differs. */
export enum AppealAppointmentKind {
  DEFENDER = 'DEFENDER',
  SPOKESPERSON = 'SPOKESPERSON',
}

export interface AppealAppointmentLetter {
  kind: AppealAppointmentKind
  /** The advocate being appointed. */
  advocateName: string
  /** The accused, who names the case whichever advocate is appointed. */
  defendantName: string
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
  /** Everyone who gets a copy, in the order the letter lists them. */
  copyTo: string[]
}

// What stands in for a value the portal cannot know yet. The court of appeals
// case number is recorded on a step that does not exist, and the áfrýjunarstefna
// is a document that does not exist - so the two read differently: one is
// missing, the other is not built.
const NO_APPEAL_CASE_NUMBER = 'xxx/xxxx'
const NO_APPEAL_SUMMONS_DATE = 'Ekki útfært'

// The court's own letterhead. Fixed text rather than institution data: this
// letter only ever comes from the court of appeals, and the address it carries
// is the court's, not anything the case knows.
const LETTERHEAD = [
  'Vesturvör 2  |  200 Kópavogur  |  Sími: 432-5300',
  'Kt. 470717-1060  |  landsrettur@landsrettur.is  |  landsrettur.is',
]

/** How a criminal case is named: the prosecution against the accused. */
export const getAppealAppointmentCaseTitle = (defendantName: string) =>
  `Ákæruvaldið gegn ${defendantName}`

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
  if (names.length === 1) {
    return names[0]
  }

  if (names.length === 2) {
    return `${names[0]} og ${names[1]}`
  }

  return names.length > 2 ? `${names[0]} o.fl.` : ''
}

/** The court of appeals number, or what stands in for it until one is recorded. */
export const getAppealCaseNumberOrPlaceholder = (
  appealCaseNumber?: string | null,
) => appealCaseNumber || NO_APPEAL_CASE_NUMBER

export const getAppealAppointmentSubject = (
  kind: AppealAppointmentKind,
  appealCaseNumber?: string | null,
) =>
  `Skipun ${
    kind === AppealAppointmentKind.DEFENDER ? 'verjanda' : 'réttargæslumanns'
  } í landsréttarmálinu nr. ${getAppealCaseNumberOrPlaceholder(
    appealCaseNumber,
  )}:`

/** The sentence that does the appointing, which is the point of the letter. */
export const getAppealAppointmentSentence = (kind: AppealAppointmentKind) =>
  kind === AppealAppointmentKind.DEFENDER
    ? 'Þér eruð hér með skipaðir verjandi ákærða fyrir Landsrétti.'
    : 'Þér eruð hér með skipaðir réttargæslumaður brotaþola fyrir Landsrétti.'

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

/**
 * The letter by which the Court of Appeals appoints one party's advocate for
 * an appeal.
 *
 * Two letters in one formatter, because they differ in three places only: the
 * subject line, the sentence that appoints, and who is copied. A spokesperson's
 * letter also copies the defender; a defender's copies the prosecutor alone.
 *
 * Deliberately given everything it prints. The signatory and the date come from
 * the appointment event rather than the party row, which keeps neither, and
 * resolving that is the caller's job - this stays a pure function of its
 * arguments so it can be read against the letter it has to reproduce.
 *
 * No recipient address block. The lawyer register does not store one, and the
 * court does not need it.
 */
export const createAppealAppointmentLetter = (
  letter: AppealAppointmentLetter,
): Promise<Buffer> => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 80, bottom: 60, left: 50, right: 50 },
    bufferPages: true,
  })

  const chunks: Uint8Array[] = []

  doc.on('data', (chunk) => chunks.push(chunk))

  const title = getAppealAppointmentSubject(
    letter.kind,
    letter.appealCaseNumber,
  )

  setTitle(doc, title)

  for (const line of LETTERHEAD) {
    addNormalCenteredText(doc, line, 'Times-Roman')
  }

  addEmptyLines(doc, 3)

  // Where the letter was written and when, as formal letters carry it. The
  // court sits in Kópavogur.
  addNormalText(
    doc,
    `Kópavogi, ${formatDate(letter.appointedDate, 'PPP')}`,
    'Times-Roman',
  )

  addEmptyLines(doc, 2)

  addNormalText(doc, title, 'Times-Bold')
  addNormalText(
    doc,
    getAppealAppointmentCaseTitle(letter.defendantName),
    'Times-Bold',
  )

  addEmptyLines(doc, 2)

  addNormalJustifiedText(doc, getAppealAppointmentBody(letter), 'Times-Roman')

  addEmptyLines(doc, 2)

  addNormalText(doc, getAppealAppointmentSentence(letter.kind), 'Times-Roman')
  addNormalText(
    doc,
    'Tilkynnt verður síðar um frest til greinargerðar í málinu.',
    'Times-Roman',
  )

  addEmptyLines(doc, 3)

  addNormalText(doc, 'Fyrir hönd Landsréttar', 'Times-Roman')
  addNormalText(doc, letter.appointedBy.name, 'Times-Bold')

  if (letter.appointedBy.title) {
    addNormalText(doc, letter.appointedBy.title, 'Times-Roman')
  }

  if (letter.copyTo.length > 0) {
    addEmptyLines(doc, 2)
    addNormalText(doc, `Afrit: ${letter.copyTo.join(', ')}`, 'Times-Roman')
  }

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(chunks))),
  )
}
