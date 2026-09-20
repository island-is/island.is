/**
 * GSM 03.38 basic character set. Any message containing a character outside
 * this set (plus the extension table) is sent as UCS-2, which cuts segment
 * capacity from 160 to 70 characters.
 */
const GSM7_BASIC =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà'

/** GSM 03.38 extension table. Valid GSM-7, but each costs two septets. */
const GSM7_EXTENSION = '\f^{}\\[~]|€'

const GSM7_CHARS = new Set([...GSM7_BASIC, ...GSM7_EXTENSION])

/**
 * Characters that either have no canonical decomposition or whose
 * decomposition would give the wrong result, mapped by convention.
 * Þ is handled separately because its replacement depends on casing context.
 */
const SUBSTITUTIONS: Record<string, string> = {
  // Icelandic
  á: 'a',
  Á: 'A',
  ð: 'd',
  Ð: 'D',
  í: 'i',
  Í: 'I',
  ó: 'o',
  Ó: 'O',
  ú: 'u',
  Ú: 'U',
  ý: 'y',
  Ý: 'Y',
  þ: 'th',
  // Other Latin letters without a decomposition
  đ: 'd',
  Đ: 'D',
  ł: 'l',
  Ł: 'L',
  œ: 'oe',
  Œ: 'OE',
  ı: 'i',
  // Punctuation
  '„': '"',
  '“': '"',
  '”': '"',
  '«': '"',
  '»': '"',
  '‚': "'",
  '‘': "'",
  '’': "'",
  '‹': "'",
  '›': "'",
  '–': '-',
  '—': '-',
  '−': '-',
  '‑': '-',
  '…': '...',
  '•': '-',
  // Whitespace
  '\t': ' ',
  ' ': ' ',
  ' ': ' ',
  ' ': ' ',
  ' ': ' ',
  ' ': ' ',
}

const COMBINING_MARKS = /[̀-ͯ]/g

const URL_PATTERN = /https?:\/\/\S+/g

/**
 * Percent-encode non-ASCII letters and digits in URLs so the link survives
 * transliteration intact. Existing percent-encoding is left alone.
 * Non-ASCII punctuation and symbols are left for the substitution pass, since
 * they are far more likely to be quotes or dashes trailing the link than part
 * of it.
 */
const encodeUrls = (text: string): string =>
  text.replace(URL_PATTERN, (url) =>
    url.replace(
      // eslint-disable-next-line no-control-regex
      /[^\u0000-\u007f\p{P}\p{S}]/gu,
      (char) => encodeURIComponent(char),
    ),
  )

const isUpperCase = (char: string | undefined): boolean =>
  char !== undefined &&
  char !== char.toLowerCase() &&
  char === char.toUpperCase()

/**
 * Transliterate text so that it only contains GSM 03.38 characters.
 *
 * - Characters already in GSM-7 (including é, æ, ö and their capitals) pass through.
 * - Icelandic letters and common typographic punctuation are substituted.
 * - Other accented Latin letters are reduced to their base letter.
 * - Anything left over (emoji, other symbols) is dropped.
 * - URLs are percent-encoded instead so links stay valid.
 */
export const toGsm7 = (text: string): string => {
  const chars = [...encodeUrls(text)]
  let result = ''

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]

    if (GSM7_CHARS.has(char)) {
      result += char
      continue
    }

    if (char === 'Þ') {
      result += isUpperCase(chars[i + 1]) ? 'TH' : 'Th'
      continue
    }

    const substitution = SUBSTITUTIONS[char]
    if (substitution !== undefined) {
      result += substitution
      continue
    }

    const stripped = char.normalize('NFD').replace(COMBINING_MARKS, '')
    for (const base of stripped) {
      if (GSM7_CHARS.has(base)) {
        result += base
      }
    }
  }

  return result
}
