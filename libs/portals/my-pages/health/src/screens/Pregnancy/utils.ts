// EL subject terms arrive ALL CAPS ("MÆÐRASKOÐUN") — display sentence case,
// but leave mixed-case values untouched.
export const formatSubjectTerm = (term: string): string =>
  term === term.toLocaleUpperCase('is')
    ? term.charAt(0) + term.slice(1).toLocaleLowerCase('is')
    : term

export interface ParsedPhoneCallText {
  reason?: string
  rows: { label: string; value: string }[]
  result?: string
}

/*
  Phone-call records arrive as newline-separated "Label: value" free text, e.g.
  "Ástæða: Kviðverkir/blæðing\nBlæðing: Lítil, \nNiðurstaða: Bókaður tími".
  Ástæða becomes the page title/reason, Niðurstaða its own section (including
  any following prose lines), the rest label/value rows.
*/
export const parsePhoneCallText = (text: string): ParsedPhoneCallText => {
  const parsed: ParsedPhoneCallText = { rows: [] }
  let inResult = false

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    if (inResult) {
      parsed.result = `${parsed.result}\n${line}`
      continue
    }

    const match = line.match(/^([^:]+):\s*(.*)$/)
    if (!match) {
      const lastRow = parsed.rows[parsed.rows.length - 1]
      if (lastRow) {
        lastRow.value = lastRow.value ? `${lastRow.value}\n${line}` : line
      }
      continue
    }

    const label = match[1].trim()
    const value = match[2].trim().replace(/,\s*$/, '')
    const normalized = label.toLocaleLowerCase('is')

    if (normalized === 'ástæða') {
      parsed.reason = value
    } else if (normalized === 'niðurstaða') {
      parsed.result = value
      inResult = true
    } else {
      parsed.rows.push({ label, value })
    }
  }

  return parsed
}
