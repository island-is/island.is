#!/usr/bin/env node
// @ts-check

// Masks personal data and secrets in errors and logs before they are shared.
// Usage: pbpaste | node scripts/scrub.mjs [--show] | pbcopy
// --show lists each masked value on stderr, for checking the rules.

import fs from 'fs'
import { pathToFileURL } from 'url'

const SENSITIVE_KEY_NAMES = [
  '(?!__typename\\b)[\\w-]*name',
  'nafn',
  '(?:street[_-]?)?address',
  'heimilisfang',
  'postal[_-]?code',
  'e[_-]?mail',
  'netfang',
  'phone(?:[_-]?number)?',
  'mobile(?:[_-]?phone)?',
  's[ií]mi',
  '[\\w-]*passw(?:or)?d',
  'pwd',
  '[\\w-]*secret',
  'code[_-]?verifier',
  '[\\w-]*token',
  '[\\w-]*api[_-]?key',
  'authorization',
  '(?:set[_-])?cookie',
  'iban',
  '(?:bank[_-]?)?account(?:[_-]?number)?',
].join('|')

const SENSITIVE_KEY = new RegExp(`^(?:${SENSITIVE_KEY_NAMES})$`, 'iu')
const PERSON_NAME_KEY =
  /^(?:full|first|middle|last|given|family|user|display)[_-]?name$/i
const PLACEHOLDER = /^\[[A-Z-]+(?:-\d+)?\]$/

const PRIVATE_KEY =
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g
const JWT = /\beyJ[\w-]*\.[\w-]+\.[\w-]*/g
const AUTH_SCHEME = /\b(Bearer|Basic)\s+([\w.~+/-]{8,}=*)/gi
const URL_SECRET_PARAM =
  /([?&][\w-]*(?:token|secret|password|key|code|signature|sig|session)[\w-]*=)[^&\s#"']+/gi
const KEY_VALUE = new RegExp(
  `(\\\\?["']?)(?<![\\w.-])((?:[\\w-]+\\.)*(?:${SENSITIVE_KEY_NAMES}))\\1(\\s*[:=]\\s*)` +
    `(\\\\?"(?:[^"\\\\]|\\\\.)*?\\\\?"|'[^']*'|\\[[A-Z-]+(?:-\\d+)?\\]|[^\\s,;&}\\]]+(?:\\s+\\p{Lu}[\\p{L}'-]*(?![\\w.-]*\\s*[:=]))*)`,
  'giu',
)
const COOKIE_HEADER = /\b((?:set-)?cookie\s*[:=]\s*)[^\r\n"]+/gi
const XML_ELEMENT = new RegExp(
  `<((?:[\\w-]+:)?(${SENSITIVE_KEY_NAMES}))(\\s[^>]*)?>([^<]*)</\\1>`,
  'giu',
)
const SQL_STATEMENT =
  /\b(?:INSERT\s+INTO|UPDATE\s+\S+\s+SET|DELETE\s+FROM|SELECT\b[\s\S]*?\bFROM)\b/i
const SQL_STRING = /'(?:[^']|'')*'/g
const EMAIL = /[\p{L}\p{N}._%+-]+@(?:[\p{L}\p{N}-]+\.)+\p{L}{2,}/gu
const IBAN = /\bIS\d{2}(?:\s?\d{4}){5}\s?\d{2}\b/gi
const BANK_ACCOUNT = /(?<!\d)\d{4}-\d{2}-\d{6}(?!\d)/g
const KENNITALA = /(?<!\d)\d{6}-?\d{4}(?!\d)/g
const CARD = /(?<![\d-])(?:\d[ -]?){12,15}\d(?![\d-])/g
const PHONE =
  /(?:\+|\b00)354[\s-]?\d{3}[\s-]?\d{4}(?!\d)|(?<![\w.:+-])[4-8]\d{2}[\s-]?\d{4}(?![\w.:-])/g
const IPV6 =
  /(?<![\w:.])(?:(?:[\da-f]{1,4}:){7}[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,7}:(?:[\da-f]{1,4}(?::[\da-f]{1,4}){0,6})?|::(?:[\da-f]{1,4}:){0,6}[\da-f]{1,4})(?![\w:.])/gi
const IPV4 =
  /(?<![\d.])(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)(?![\d.])/g

const URL_ENCODED = /[^\s"'<>]*%[\dA-Fa-f]{2}[^\s"'<>]*/g
const BASE64 =
  /(?<![\w+/=-])(?:[A-Za-z\d+/]{4}){4,}(?:[A-Za-z\d+/]{2}==|[A-Za-z\d+/]{3}=)?(?![\w+/=-])/g
const CONTROL_CHAR = /[^\P{Cc}\t\n\r]/u
const UTF8 = new TextDecoder('utf-8', { fatal: true })

const NAME_WORD = /^(?:\p{L}\.|\p{L}+(?:['-]\p{L}+)*)$/u
const MID_WORD_CAPITAL = /\p{Ll}(?<!^Ma?c)\p{Lu}/u
const ERROR_CLASS = /^(?:Error|Exception)$/

/** @param {string} value */
const looksLikePersonName = (value) => {
  const words = value.trim().split(/\s+/)
  return (
    words.length <= 5 &&
    words.every(
      (word) => NAME_WORD.test(word) && !MID_WORD_CAPITAL.test(word),
    ) &&
    (words.length > 1 ||
      (/^\p{Lu}/u.test(words[0]) && !ERROR_CLASS.test(words[0])))
  )
}

const isSensitiveKey = (key, value) => {
  const lastSegment = key.split('.').pop() ?? ''
  return (
    SENSITIVE_KEY.test(lastSegment) &&
    (!/name$/i.test(lastSegment) ||
      PERSON_NAME_KEY.test(lastSegment) ||
      looksLikePersonName(value))
  )
}

/** @param {string} kt */
export const kennitalaKind = (kt) => {
  const day = parseInt(kt.slice(0, 2), 10)
  const month = parseInt(kt.slice(2, 4), 10)
  if (month < 1 || month > 12) return undefined
  if (day >= 1 && day <= 31) return 'person'
  if (day >= 41 && day <= 71) return 'company'
  return undefined
}

/** @param {string} token */
const urlDecoded = (token) => {
  let decoded = token
  for (let i = 0; i < 3 && /%[\dA-Fa-f]{2}/.test(decoded); i++) {
    try {
      decoded = decodeURIComponent(decoded.replace(/\+/g, ' '))
    } catch {
      break
    }
  }
  return decoded
}

/** @param {string} token */
const base64Text = (token) => {
  try {
    const text = UTF8.decode(Buffer.from(token, 'base64'))
    return CONTROL_CHAR.test(text) ? undefined : text
  } catch {
    return undefined
  }
}

/** @param {string} digits */
const passesLuhn = (digits) => {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return sum % 10 === 0
}

const keepBigIntegers = (_, value, context) =>
  typeof value === 'number' &&
  !Number.isSafeInteger(value) &&
  /^-?\d+$/.test(context.source)
    ? JSON.rawJSON(context.source)
    : value

const createScrubber = () => {
  /** @type {Map<string, string>} */
  const labels = new Map()
  /** @type {Record<string, number>} */
  const counts = {}
  /** @type {Array<[string, string]>} */
  const masked = []

  const label = (kind, value) => {
    const id = `${kind}:${value}`
    if (!labels.has(id)) {
      counts[kind] = (counts[kind] ?? 0) + 1
      labels.set(id, `[${kind}-${counts[kind]}]`)
      masked.push([`[${kind}-${counts[kind]}]`, value])
    }
    return /** @type {string} */ (labels.get(id))
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  const redacted = (key, value) => {
    counts.REDACTED = (counts.REDACTED ?? 0) + 1
    masked.push(['[REDACTED]', `${key} = ${value}`])
    return '[REDACTED]'
  }

  /** @param {string} text */
  const scrubText = (text) =>
    text
      .replace(URL_ENCODED, (token) => urlDecoded(token))
      .replace(PRIVATE_KEY, () => label('PRIVATE-KEY', 'key'))
      .replace(JWT, (jwt) => label('JWT', jwt))
      .replace(
        AUTH_SCHEME,
        (_, scheme, token) => `${scheme} ${label('TOKEN', token)}`,
      )
      .replace(BASE64, (token) => {
        const decoded = base64Text(token)
        if (decoded === undefined) return token
        const scrubbed = scrubText(decoded)
        return scrubbed === decoded ? token : scrubbed
      })
      .replace(
        URL_SECRET_PARAM,
        (match, param) =>
          `${param}${redacted(param.slice(1, -1), match.slice(param.length))}`,
      )
      .replace(
        COOKIE_HEADER,
        (match, header) =>
          `${header}${redacted(
            header.replace(/\s*[:=]\s*$/, ''),
            match.slice(header.length),
          )}`,
      )
      .replace(EMAIL, (email) => label('EMAIL', email.toLowerCase()))
      .replace(IBAN, (iban) =>
        label('IBAN', iban.replace(/\s/g, '').toUpperCase()),
      )
      .replace(BANK_ACCOUNT, (account) => label('BANK-ACCOUNT', account))
      .replace(KENNITALA, (match) => {
        const kt = match.replace('-', '')
        const kind = kennitalaKind(kt)
        return kind ? label(`KT-${kind.toUpperCase()}`, kt) : match
      })
      .replace(CARD, (match) => {
        const digits = match.replace(/\D/g, '')
        return passesLuhn(digits) ? label('CARD', digits) : match
      })
      .replace(PHONE, (phone) =>
        label('PHONE', phone.replace(/\D/g, '').slice(-7)),
      )
      .replace(IPV4, (ip) => label('IP', ip))
      .replace(IPV6, (ip) => label('IP', ip.toLowerCase()))
      .replace(XML_ELEMENT, (match, tag, localName, attributes = '', value) =>
        PLACEHOLDER.test(value) || !isSensitiveKey(localName, value)
          ? match
          : `<${tag}${attributes}>${redacted(localName, value)}</${tag}>`,
      )
      .replace(SQL_STRING, (literal) =>
        SQL_STATEMENT.test(text) && !PLACEHOLDER.test(literal.slice(1, -1))
          ? `'${redacted('sql', literal.slice(1, -1))}'`
          : literal,
      )
      .replace(KEY_VALUE, (match, quote, key, separator, value) => {
        const [, open = '', inner = '', close = '', rest = ''] =
          /^(\\?["'])([\s\S]*?)(\\?["'])$/.exec(value) ??
          /^()(\S+(?:\s+\p{Lu}[\p{L}'-]*)*)()([\s\S]*)$/u.exec(value) ??
          []
        return !PLACEHOLDER.test(inner) && isSensitiveKey(key, inner)
          ? `${quote}${key}${quote}${separator}${open}${redacted(
              key,
              inner,
            )}${close}${rest}`
          : match
      })

  const scrubValue = (value, key = '') => {
    const text = JSON.isRawJSON(value) ? value.rawJSON : String(value)
    if (key && value !== null && isSensitiveKey(key, text)) {
      const scrubbed = scrubText(text)
      return PLACEHOLDER.test(scrubbed) ? scrubbed : redacted(key, text)
    }
    if (typeof value === 'string') return scrubText(value)
    if (JSON.isRawJSON(value)) {
      const scrubbed = scrubText(value.rawJSON)
      return scrubbed === value.rawJSON ? value : scrubbed
    }
    if (typeof value === 'number') {
      const scrubbed = scrubText(String(value))
      return scrubbed === String(value) ? value : scrubbed
    }
    if (Array.isArray(value)) return value.map((item) => scrubValue(item))
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, scrubValue(v, k)]),
      )
    }
    return value
  }

  const tryParseJson = (text) => {
    const trimmed = text.trim()
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return undefined
    try {
      return JSON.parse(trimmed, keepBigIntegers)
    } catch {
      return undefined
    }
  }

  /** @param {string} input */
  const scrub = (input) => {
    const whole = tryParseJson(input)
    if (whole !== undefined) {
      return JSON.stringify(scrubValue(whole), null, 2) + '\n'
    }
    return input
      .replace(PRIVATE_KEY, () => label('PRIVATE-KEY', 'key'))
      .split('\n')
      .map((line) => {
        const parsed = tryParseJson(line)
        return parsed === undefined
          ? scrubText(line)
          : JSON.stringify(scrubValue(parsed))
      })
      .join('\n')
  }

  return { scrub, counts, masked }
}

const main = () => {
  const { scrub, counts, masked } = createScrubber()
  process.stdout.write(scrub(fs.readFileSync(0, 'utf8')))
  const summary = Object.entries(counts)
    .map(([kind, count]) => `${kind}: ${count}`)
    .join(', ')
  process.stderr.write(
    `scrub: ${summary || 'nothing masked'}. ` +
      'Names in free text are not caught; read the output before sharing.\n',
  )
  if (process.argv.includes('--show')) {
    for (const [placeholder, value] of masked) {
      process.stderr.write(`  ${placeholder.padEnd(18)} ${value}\n`)
    }
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main()
}
