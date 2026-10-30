import type { FormExpression } from '@island.is/application/types'

const parseNumericValue = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return 0
  }

  const numeric = value.replace(/[^\d,.-]/g, '').replace(/[,.]+$/g, '')
  const hasIcelandicDecimal = numeric.includes(',')
  const hasGroupedThousands = /^-?\d{1,3}(\.\d{3})+$/.test(numeric)
  const normalized = hasIcelandicDecimal
    ? numeric.replace(/\./g, '').replace(',', '.')
    : hasGroupedThousands
    ? numeric.replace(/\./g, '')
    : numeric.replace(/,/g, '')
  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : 0
}

const isExpressionObject = (
  expression: FormExpression,
): expression is Extract<FormExpression, { operator: string }> =>
  typeof expression === 'object' &&
  expression !== null &&
  'operator' in expression

const isEmptyValue = (value: unknown): boolean =>
  value == null || (typeof value === 'string' && value.trim() === '')

export const getFormExpressionDependencies = (
  expression: FormExpression | undefined,
): string[] => {
  const dependencies = new Set<string>()

  const visit = (value: FormExpression | undefined) => {
    if (value === undefined || !isExpressionObject(value)) {
      return
    }

    if (value.operator === 'GET') {
      const [fieldId] = value.args
      if (typeof fieldId === 'string') {
        dependencies.add(fieldId)
      }
    }

    for (const arg of value.args) {
      visit(arg)
    }
  }

  visit(expression)

  return Array.from(dependencies)
}

export const evaluateFormExpression = (
  expression: FormExpression | undefined,
  values: Record<string, unknown>,
): unknown => {
  if (expression === undefined || !isExpressionObject(expression)) {
    return expression
  }

  const evaluateArg = (arg: FormExpression): unknown =>
    evaluateFormExpression(arg, values)

  switch (expression.operator) {
    case 'GET': {
      const [fieldId] = expression.args
      return typeof fieldId === 'string' ? values[fieldId] : undefined
    }
    case 'SUM':
      return expression.args.reduce<number>(
        (total, arg) => total + parseNumericValue(evaluateArg(arg)),
        0,
      )
    case 'MULTIPLY':
      return expression.args.reduce<number>(
        (total, arg) => total * parseNumericValue(evaluateArg(arg)),
        1,
      )
    case 'EQUALS': {
      const [left, right] = expression.args
      return evaluateArg(left) === evaluateArg(right)
    }
    case 'GT': {
      const [left, right] = expression.args
      return (
        parseNumericValue(evaluateArg(left)) >
        parseNumericValue(evaluateArg(right))
      )
    }
    case 'GTE': {
      const [left, right] = expression.args
      return (
        parseNumericValue(evaluateArg(left)) >=
        parseNumericValue(evaluateArg(right))
      )
    }
    case 'LT': {
      const [left, right] = expression.args
      return (
        parseNumericValue(evaluateArg(left)) <
        parseNumericValue(evaluateArg(right))
      )
    }
    case 'LTE': {
      const [left, right] = expression.args
      return (
        parseNumericValue(evaluateArg(left)) <=
        parseNumericValue(evaluateArg(right))
      )
    }
    case 'IS_EMPTY': {
      const [arg] = expression.args
      return isEmptyValue(evaluateArg(arg))
    }
    case 'NOT': {
      const [arg] = expression.args
      return !evaluateArg(arg)
    }
    case 'OR':
      return expression.args.some((arg) => Boolean(evaluateArg(arg)))
    case 'AND':
      return expression.args.every((arg) => Boolean(evaluateArg(arg)))
    case 'IF': {
      const [condition, trueResult, falseResult] = expression.args
      return evaluateArg(condition)
        ? evaluateArg(trueResult)
        : evaluateArg(falseResult)
    }
    case 'CONTAINS': {
      const [collection, value] = expression.args
      const collectionValue = evaluateArg(collection)
      const target = evaluateArg(value)
      if (Array.isArray(collectionValue)) {
        return collectionValue.includes(target)
      }
      if (typeof collectionValue === 'string' && typeof target === 'string') {
        return collectionValue.includes(target)
      }
      return false
    }
  }
}
