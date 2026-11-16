#!/usr/bin/env node
// @ts-check

// Masks personal data and secrets in errors and logs before they are shared.
// Usage: pbpaste | node scripts/scrub.mjs [--show] [--names] | pbcopy
//        node scripts/scrub.mjs [--show] [--names] <file>
// --help explains the options and what is masked.
// --show lists each masked value and its original in a pager, which leaves
// nothing in scrollback or on disk; without a terminal it falls back to stderr.
// --names asks for names to mask everywhere, such as the person being debugged.

import { spawnSync } from 'child_process'
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
const EMAIL =
  /(?<![\p{L}\p{N}._%+-])[\p{L}\p{N}._%+-]+@(?:[\p{L}\p{N}-]+\.)+\p{L}{2,}/gu
const IBAN = /\bIS\d{2}(?:\s?\d{4}){5}\s?\d{2}\b/gi
const BANK_ACCOUNT = /(?<!\d)\d{4}-\d{2}-\d{6}(?!\d)/g
const KENNITALA = /(?<!\d)\d{6}-?\d{4}(?!\d)/g
const CARD = /(?<![\d-])(?:\d[ -]?){12,15}\d(?![\d-])/g
const PHONE =
  /(?:\+|\b00)354[\s-]?\d{3}[\s-]?\d{4}(?!\d)|(?<![\w.:+-])[4-8]\d{2}[\s-]?\d{4}(?![\w.:-])/g
const IPV6 =
  /(?<![\w:.])(?:(?:[\da-f]{1,4}:){7}[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,7}:(?:[\da-f]{1,4}(?::[\da-f]{1,4}){0,6})?|::(?:[\da-f]{1,4}:){0,6}[\da-f]{1,4})(?![\w:.])/gi
const ICELANDIC_NAME =
  /(?<![\p{L}\p{N}])(?:(?:\p{Lu}\p{Ll}+(?:-\p{Lu}\p{Ll}+)?|\p{Lu}\.)\s+){1,4}(?!(?:Reason|Season|Treason|Lesson)\b)\p{Lu}\p{Ll}*(?:(?:s|a|ar)(?:son|syni|sonar)|d[oó]tt[iu]r)(?!\p{L})/gu
const IPV4 =
  /(?<![\d.])(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)(?![\d.])/g

const URL_ENCODED = /(?<![^\s"'<>])[^\s"'<>]*%[\dA-Fa-f]{2}[^\s"'<>]*/g
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

const NAME_KEY = /(?:name|nafn)$/i
const NAME_SEPARATOR = '[\\s_.-]*'
const FOLDED_LETTERS = {
  a: 'aáàâäãå',
  c: 'cç',
  d: 'dð',
  e: 'eéèêë',
  i: 'iíìîï',
  n: 'nñ',
  o: 'oóòôöõø',
  s: 'sš',
  u: 'uúùûü',
  y: 'yýÿ',
  z: 'zž',
}

/** @param {string} name */
const nameWords = (name) =>
  name
    .toLowerCase()
    .replace(/þ/g, 'th')
    .replace(/æ/g, 'ae')
    .replace(/ð/g, 'd')
    .replace(/ø/g, 'o')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[\s_.,-]+/)
    .filter(Boolean)

/** @param {string} word */
const namePattern = (word) =>
  word.replace(/th|ae|ss|[\s\S]/g, (part) =>
    part === 'th'
      ? '(?:th|þ)'
      : part === 'ae'
      ? '(?:ae|æ)'
      : part === 'ss'
      ? '(?:ss|ß)'
      : part in FOLDED_LETTERS
      ? `[${FOLDED_LETTERS[part]}]`
      : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  )

/** @param {string} name */
const knownNameRegex = (name) => {
  const words = nameWords(name)
  const variants =
    words.length > 2 ? [words, [words[0], words.at(-1)]] : [words]
  const alternatives = variants
    .map((variant) => variant.map(namePattern).join(NAME_SEPARATOR))
    .join('|')
  return new RegExp(`(?<!\\p{L})(?:${alternatives})(?!\\p{L})`, 'giu')
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

/** @param {string} kt */
const isMinor = (kt, today = new Date()) => {
  const century = { 8: 1800, 9: 1900, 0: 2000 }[kt[9]]
  if (century === undefined) return false
  const eighteenthBirthday = new Date(
    century + Number(kt.slice(4, 6)) + 18,
    Number(kt.slice(2, 4)) - 1,
    Number(kt.slice(0, 2)),
  )
  return today < eighteenthBirthday
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

/** @param {string[]} knownNames */
const createScrubber = (knownNames = []) => {
  /** @type {Map<string, string>} */
  const labels = new Map()
  /** @type {Record<string, number>} */
  const counts = {}
  /** @type {Array<[string, string]>} */
  const masked = []

  /** @type {Set<string>} */
  const foundNames = new Set()

  const label = (kind, value, display = value) => {
    const id = `${kind}:${value}`
    if (!labels.has(id)) {
      counts[kind] = (counts[kind] ?? 0) + 1
      labels.set(id, `[${kind}-${counts[kind]}]`)
      masked.push([`[${kind}-${counts[kind]}]`, display])
    }
    return /** @type {string} */ (labels.get(id))
  }

  /** @param {string} name */
  const nameLabel = (name) => {
    const display = name.trim().replace(/\s+/g, ' ')
    foundNames.add(display)
    return label('NAME', nameWords(display).join(' '), display)
  }

  const knownNamePatterns = [...new Set(knownNames)]
    .filter((name) => nameWords(name).join('').length > 1)
    .sort((a, b) => b.length - a.length)
    .map((name) => /** @type {const} */ ([knownNameRegex(name), name]))

  /**
   * @param {string} key
   * @param {string} value
   */
  const redacted = (key, value) => {
    counts.REDACTED = (counts.REDACTED ?? 0) + 1
    masked.push(['[REDACTED]', `${key} = ${value}`])
    return '[REDACTED]'
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  const maskValue = (key, value) =>
    NAME_KEY.test(key.split('.').pop() ?? '')
      ? nameLabel(value)
      : redacted(key, value)

  /** @param {string} text */
  const scrubText = (text) =>
    knownNamePatterns
      .reduce(
        (out, [pattern, name]) => out.replace(pattern, () => nameLabel(name)),
        scrubValues(text),
      )
      .replace(ICELANDIC_NAME, (name) => nameLabel(name))
      .replace(XML_ELEMENT, (match, tag, localName, attributes = '', value) =>
        PLACEHOLDER.test(value) || !isSensitiveKey(localName, value)
          ? match
          : `<${tag}${attributes}>${maskValue(localName, value)}</${tag}>`,
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
          ? `${quote}${key}${quote}${separator}${open}${maskValue(
              key,
              inner,
            )}${close}${rest}`
          : match
      })

  /** @param {string} text */
  const scrubValues = (text) =>
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
        if (!kind) return match
        return label(
          kind === 'person' && isMinor(kt)
            ? 'KT-CHILD'
            : `KT-${kind.toUpperCase()}`,
          kt,
        )
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

  const scrubValue = (value, key = '') => {
    const text = JSON.isRawJSON(value) ? value.rawJSON : String(value)
    if (key && value !== null && isSensitiveKey(key, text)) {
      const scrubbed = scrubText(text)
      return PLACEHOLDER.test(scrubbed) ? scrubbed : maskValue(key, text)
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
      const isApplicationRow =
        'applicant' in value && ('type_id' in value || 'typeId' in value)
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [
          k,
          isApplicationRow && k === 'name' && typeof v === 'string'
            ? scrubText(v)
            : scrubValue(v, k),
        ]),
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

  return { scrub, counts, masked, foundNames }
}

const HELP = `Usage: node scripts/scrub.mjs [--names] [--show] [file]

Masks personal data and secrets in logs, errors and database extracts.
Reads the file, or standard input when no file is given, and writes the
scrubbed text to standard output.

Options:
  --names  Ask for names to mask everywhere, separated by commas, e.g.
           Jón Jónsson, Anna Smith. Input is hidden; Enter skips. Use it
           when names appear only in free text or file names.
  --show   Show each label with its original value in a pager. Press q
           to close; nothing is kept in scrollback or on disk.
  --help   Show this help.

What it masks:
  Kennitölur          [KT-PERSON-n], [KT-CHILD-n] if under 18, [KT-COMPANY-n]
  Names               [NAME-n]: under name keys, -son/-dóttir names and
                      names given with --names, wherever else they appear
  Emails, phone numbers, IBANs, bank accounts, cards, IP addresses
                      [EMAIL-n], [PHONE-n], [IBAN-n], [BANK-ACCOUNT-n],
                      [CARD-n], [IP-n]
  Tokens, JWTs, private keys
                      [TOKEN-n], [JWT-n], [PRIVATE-KEY-n]
  Passwords, API keys, cookies, secret URL parameters, SQL values
                      [REDACTED]

URL-encoded and Base64 text is decoded and scrubbed too.
The same value always gets the same label, so people can be told apart.
Labels are numbered per run, so scrub a whole file at once, not in pieces.
The script is an aid, not a guarantee: read the output before sharing it.

Examples:
  pbpaste | node scripts/scrub.mjs | pbcopy
  node scripts/scrub.mjs --names --show application.json > scrubbed.json
  kubectl logs <pod> -n <namespace> --since=15m | node scripts/scrub.mjs
`

const main = () => {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    process.stderr.write(HELP)
    process.exit(0)
  }
  const file = process.argv.slice(2).find((arg) => !arg.startsWith('--'))
  let input
  try {
    input = fs.readFileSync(file ?? 0, 'utf8')
  } catch {
    process.stderr.write(`scrub: cannot read ${file}.\n`)
    process.exit(1)
  }
  const givenNames = process.argv.includes('--names') ? askNames() : []
  const firstPass = createScrubber(givenNames)
  firstPass.scrub(input)
  const { scrub, counts, masked } = createScrubber([
    ...givenNames,
    ...firstPass.foundNames,
  ])
  process.stdout.write(scrub(input))
  const summary = Object.entries(counts)
    .map(([kind, count]) => `${kind}: ${count}`)
    .join(', ')
  process.stderr.write(
    `scrub: ${summary || 'nothing masked'}. ` +
      'Free-text names are caught only if found under a name key, given with --names, or ending in -son/-dóttir; read the output before sharing.\n',
  )
  if (process.argv.includes('--show')) {
    showMasked(masked)
  }
}

const askNames = () => {
  let tty
  try {
    tty = fs.openSync('/dev/tty', 'r+')
  } catch {
    process.stderr.write('scrub: --names needs a terminal.\n')
    process.exit(1)
  }
  fs.writeSync(
    tty,
    'Names to mask, separated by commas, e.g. Jón Jónsson, Anna Smith ' +
      '(input hidden, Enter to skip): ',
  )
  spawnSync('stty', ['-echo'], { stdio: [tty, 'ignore', 'ignore'] })
  /** @type {string[]} */
  let names = []
  try {
    const chunks = []
    const buffer = Buffer.alloc(1024)
    let bytes
    while ((bytes = fs.readSync(tty, buffer, 0, buffer.length, null)) > 0) {
      chunks.push(Buffer.from(buffer.subarray(0, bytes)))
      if (buffer.subarray(0, bytes).includes(10)) break
    }
    names = Buffer.concat(chunks)
      .toString('utf8')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
  } finally {
    spawnSync('stty', ['echo'], { stdio: [tty, 'ignore', 'ignore'] })
    const count =
      names.length === 0
        ? 'No names given.'
        : `${names.length} ${names.length === 1 ? 'name' : 'names'} given.`
    fs.writeSync(tty, `\n${count}\n`)
    fs.closeSync(tty)
  }
  return names
}

/** @param {Array<[string, string]>} masked */
const showMasked = (masked) => {
  const listing = masked
    .map(([placeholder, value]) => `  ${placeholder.padEnd(18)} ${value}\n`)
    .join('')
  try {
    const tty = fs.openSync('/dev/tty', 'w')
    const pager = spawnSync('less', ['-S'], {
      input: `Masked values. Press q to close; nothing is kept.\n\n${listing}`,
      stdio: ['pipe', tty, 'inherit'],
      env: { ...process.env, LESS: '', LESSSECURE: '1', LESSHISTFILE: '-' },
    })
    fs.closeSync(tty)
    if (!pager.error && pager.status === 0) return
  } catch {
    // No terminal or no pager: fall through to stderr.
  }
  process.stderr.write(listing)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main()
}
