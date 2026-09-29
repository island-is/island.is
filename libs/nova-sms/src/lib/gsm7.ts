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

/** Punctuation trailing a URL match, e.g. a closing quote, dash or period. */
const TRAILING_PUNCTUATION = /\p{P}+$/u

/**
 * Percent-encode non-ASCII characters in URLs so the link survives
 * transliteration intact. Existing percent-encoding is left alone.
 * Punctuation trailing the URL is split off first and left for the
 * substitution pass, since a closing quote or dash after a link is far more
 * likely than one inside it.
 */
const encodeUrls = (text: string): string =>
  text.replace(URL_PATTERN, (match) => {
    const suffix = match.match(TRAILING_PUNCTUATION)?.[0] ?? ''
    const url = match.slice(0, match.length - suffix.length)
    return (
      // eslint-disable-next-line no-control-regex
      url.replace(/[^\u0000-\u007f]/gu, (char) => encodeURIComponent(char)) +
      suffix
    )
  })

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
