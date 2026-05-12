import type { ClientDisplayExpression } from '../../lib/graphql'

const parseNumericAnswer = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return 0
  }

  const numeric = value.replace(/[^\d,.-]/g, '').replace(/[,.]+$/g, '')
  const hasIcelandicDecimal = numeric.includes(',')
  const hasGroupedThousands = /^\-?\d{1,3}(\.\d{3})+$/.test(numeric)
  const normalized = hasIcelandicDecimal
    ? numeric.replace(/\./g, '').replace(',', '.')
    : hasGroupedThousands
    ? numeric.replace(/\./g, '')
    : numeric.replace(/,/g, '')
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : 0
}

export const evaluateClientDisplayExpression = (
  expression: ClientDisplayExpression,
  answers: Record<string, unknown>,
): string => {
  if (expression.type === 'sum') {
    const sum = expression.fields.reduce(
      (total, field) => total + parseNumericAnswer(answers[field]),
      0,
    )
    return String(sum)
  }

  const product = expression.factors.reduce((total, factor) => {
    if ('field' in factor) {
      return total * parseNumericAnswer(answers[factor.field])
    }
    return total * factor.value
  }, 1)

  return String(product)
}
