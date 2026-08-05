/**
 * Ported from: libs/portals/admin/regulations-admin/src/utils/guessers.ts
 *
 * Utility functions for guessing regulation metadata from content:
 * - Finding affected regulations mentioned in text
 * - Parsing signature text for ministry name and date
 * - Determining regulation type from title
 */
import {
  asDiv,
  ensureISODate,
  ensureRegName,
  HTMLText,
  PlainText,
  RegName,
  RegulationType,
} from '@island.is/regulations'

// ---------------------------------------------------------------------------

const getSpacedTextContent = (html: HTMLText): PlainText => {
  const blockElms = 'p,h2,h3,h4,h5,h6,td,th,caption,li,blockquote'
  const textDiv = asDiv(html)
  textDiv.querySelectorAll(blockElms).forEach((elm) => {
    // inject spaces after each block level element to
    // ensure .textContent returns legible text for grepping
    elm.after(' ')
  })
  return textDiv.textContent as PlainText
}

/**
 * Finds regulation names (e.g. "438/2022") mentioned in title and text.
 * Used to populate the regulation selection dropdown for impacts.
 */
export const findAffectedRegulationsInText = (
  title: PlainText,
  text: HTMLText,
): Array<RegName> => {
  const totalString = title + ' ' + getSpacedTextContent(text)
  const mentionedRegNames = new Set<RegName>()

  const nameMatchRe = new RegExp(
    [
      // not obviously referring to laws
      /(?<!(?:lög|lögum|laga)(?:\s+(?:nr.|númer))?\s*?)/,
      // preceded by whitespace or parenthesis
      /[\s(]/,
      // 1-4 digits
      /(\d{1,4})/, // $1
      // single dash or " árið " or " frá árinu"
      /\s*(?:\/\s*|,?\s+(?:árið|frá\s+árinu)\s+)/,
      // Year-ish ("19XX" or "20XX")
      /((?:19|20)\d{2})/, // $2
      // followed by whitespace, parenthesis, or basic punctuation
      /[\s,.;)]/,
    ]
      .map((r) => r.source)
      .join(''),
    'gi',
  )

  let m: RegExpExecArray | null
  while ((m = nameMatchRe.exec(totalString))) {
    const maybeName = ensureRegName(m[1] + '/' + m[2])
    maybeName && mentionedRegNames.add(maybeName)
  }
  return Array.from(mentionedRegNames)
}

// ---------------------------------------------------------------------------

/**
 * Parses the signature section of a regulation to extract:
 * - Ministry name (ráðuneyti)
 * - Signature date
 */
export const findSignatureInText = (html: HTMLText) => {
  const paragraphs = Array.from(asDiv(html).querySelectorAll('p')).slice(-40)

  const threeLetterMonths = [
    'jan',
    'feb',
    'mar',
    'apr',
    'maí',
    'jún',
    'júl',
    'ágú',
    'sep',
    'okt',
    'nóv',
    'des',
  ]
  const undirskrRe = new RegExp(
    [
      // Capture name of ráðuneyti from start of paragraph
      /^(?:Í\s+)?(.+?ráðuneyti)(?:ð|nu)?/,
      /,?\s+/,
      /(?:þann\s+)?/,
      /(\d{1,2})\.?/,
      /\s(jan\.?|janúar|feb\.?|febrúar|mar\.?|mars|apr\.?|apríl|maí.?|jún\.?|júní|júl\.?|júlí|ágú\.?|ágúst|sept?\.?|september|okt\.?|október|nóv\.?|nóvember|des\.?|desember),?/,
      /\s+(20[2-9]\d).?$/,
    ]
      .map((r) => r.source)
      .join(''),
    'i',
  )

  let match: RegExpMatchArray | false | null = false

  paragraphs.find((elm) => {
    const textContent = elm.textContent || ''
    if (!/ráðuneyti/i.test(textContent)) {
      return false
    }
    match = textContent.trim().replace(/\s+/g, ' ').match(undirskrRe)
    return !!match
  })

  if (!match) {
    return {
      ministryName: undefined,
      signatureDate: undefined,
    }
  }
  const [_, ministryNameRaw, dayOfMonthStr, monthName, yearStr] =
    match as RegExpMatchArray

  const month = threeLetterMonths.indexOf(monthName.slice(0, 3).toLowerCase())

  const foundISODateRaw =
    yearStr +
    '-' +
    ('0' + (month + 1)).slice(-2) +
    '-' +
    ('0' + dayOfMonthStr).slice(-2)
  const signatureDate = ensureISODate(foundISODateRaw)

  const ministryName = ministryNameRaw
    // normalize declination
    .replace(/inu$/, 'ið')
    // Normalize/collapse spaces
    .replace(/\s+/g, ' ')

  return {
    ministryName,
    signatureDate,
  }
}

// ---------------------------------------------------------------------------

/**
 * Determines the regulation type (base or amending) from the title.
 */
export const findRegulationType = (
  title: PlainText,
): RegulationType | undefined => {
  title = title.trim().replace(/\s+/g, ' ')
  if (!title || !/reglugerð/i.test(title)) {
    return
  }
  const amendingTitleRe =
    /^Reglugerð um (?:\(?\d+\.\)? )?breyting(?:u|ar) á .*reglugerð(?:um)?(?: |$)/i
  const repealingTitleRe =
    /^Reglugerð um (að fella úr gildi|brottfelling(?:u|ar)( ýmissa)?) .*reglugerð(?:ir|a|ar)?/i
  return amendingTitleRe.test(title) || repealingTitleRe.test(title)
    ? 'amending'
    : 'base'
}
