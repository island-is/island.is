/*
Specific calculations for LSH questionnaires. They may contain formulas and values derived from user answers. */

import { QuestionAnswer } from '../../../types/questionnaire'
import { evaluateExpression } from './visibilityUtils'

const asNumber = (v: unknown): number => {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = parseFloat(v)
    if (!Number.isNaN(n)) return n
  }
  return 0
}

const normalizeDateString = (s: string) => {
  // Make "YYYY-MM-DD HH:mm" parseable in all runtimes by inserting 'T'
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) {
    return s.replace(' ', 'T')
  }
  return s
}

const toMillis = (v: unknown): number | null => {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.getTime()
  if (typeof v === 'number' && Number.isFinite(v)) {
    // Heuristic: treat >= 10^12 as ms epoch, <= 10^10 as seconds epoch
    if (v > 1e11) return v
    if (v > 1e9) return v * 1000
  }
  if (typeof v === 'string') {
    // Try numeric first
    const n = Number(v)
    if (Number.isFinite(n)) {
      if (n > 1e11) return n
      if (n > 1e9) return n * 1000
    }
    // Then ISO/loose datetime
    const d = new Date(normalizeDateString(v))
    const t = d.getTime()
    if (!Number.isNaN(t)) return t
  }
  return null
}

const resolveRef = (
  token: string,
  answers: { [key: string]: QuestionAnswer },
): unknown => {
  // token is either "@@@id" or a literal
  if (token.startsWith('@@@')) {
    const id = token.slice(3)
    return answers[id]?.answers?.[0]?.value ?? null
  }
  return token
}

const evalMinuteDiffs = (
  expr: string,
  answers: { [key: string]: QuestionAnswer },
): string => {
  // Matches MinuteDiff('arg1','arg2') allowing spaces; args cannot contain single quotes
  const minuteDiffRe = /MinuteDiff\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g

  return expr.replace(minuteDiffRe, (_m, rawA, rawB) => {
    const aVal = resolveRef(rawA, answers)
    const bVal = resolveRef(rawB, answers)

    const aMs = toMillis(aVal)
    const bMs = toMillis(bVal)

    if (aMs == null || bMs == null) {
      // If either cannot be parsed, collapse to 0 to keep expression evaluable
      return '0'
    }

    const diffMinutes = Math.round((bMs - aMs) / 60000)
    return String(diffMinutes)
  })
}

const substitutePlainRefs = (
  expr: string,
  answers: { [key: string]: QuestionAnswer },
): string => {
  // Replace any remaining @@@id outside of MinuteDiff with numeric values (arrays get summed)
  const refRe = /@@@([a-zA-Z0-9_-]+)/g
  return expr.replace(refRe, (_m, id) => {
    const ans = answers[id]
    let value = 0

    if (ans && ans.answers && ans.answers.length > 0) {
      // Sum all values in the answers array
      value = ans.answers.reduce((sum: number, item) => {
        return sum + asNumber(item.value)
      }, 0)
    }

    return String(value)
  })
}

const safeEval = (expr: string): number | null => {
  const cleaned = expr.trim()
  if (!cleaned) return null

  // Validate expression contains only numbers, operators, parentheses, decimal points, and whitespace
  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    // If it's just a single number that includes a leading minus or decimals, parse it
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : null
  }

  try {
    return evaluateExpression(cleaned)
  } catch {
    return null
  }
}

export const calculateFormula = (
  formula: string,
  answers: { [key: string]: QuestionAnswer },
): number | null => {
  if (!formula || !formula.trim()) return null

  // 1) Evaluate MinuteDiff() calls first
  let expression = evalMinuteDiffs(formula.trim(), answers)

  // 2) Replace remaining @@@refs with numbers
  expression = substitutePlainRefs(expression, answers)

  // 3) Evaluate arithmetic
  return safeEval(expression)
}
