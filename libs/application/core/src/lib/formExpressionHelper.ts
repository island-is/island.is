import type { FormExpression } from '@island.is/application/types'

type IfExpressionOptions = {
  condition: FormExpression
  then: FormExpression
  otherwise: FormExpression
}

const normalizeFieldReference = (
  expression: FormExpression | string,
): FormExpression =>
  typeof expression === 'string' ? expr.get(expression) : expression

export const expr = {
  get: (fieldId: string): FormExpression => ({
    operator: 'GET',
    args: [fieldId],
  }),
  isEmpty: (expression: FormExpression | string): FormExpression => ({
    operator: 'IS_EMPTY',
    args: [normalizeFieldReference(expression)],
  }),
  isNotEmpty: (expression: FormExpression | string): FormExpression => ({
    operator: 'NOT',
    args: [expr.isEmpty(expression)],
  }),
  equals: (arg1: FormExpression, arg2: FormExpression): FormExpression => ({
    operator: 'EQUALS',
    args: [arg1, arg2],
  }),
  not: (expression: FormExpression): FormExpression => ({
    operator: 'NOT',
    args: [expression],
  }),
  or: (...args: FormExpression[]): FormExpression => ({
    operator: 'OR',
    args,
  }),
  and: (...args: FormExpression[]): FormExpression => ({
    operator: 'AND',
    args,
  }),
  if: (
    ...args: [IfExpressionOptions] | [FormExpression, FormExpression, FormExpression]
  ): FormExpression => {
    if (args.length === 1) {
      const [options] = args

      return {
        operator: 'IF',
        args: [options.condition, options.then, options.otherwise],
      }
    }

    return {
      operator: 'IF',
      args,
    }
  },
  sum: (...args: FormExpression[]): FormExpression => ({
    operator: 'SUM',
    args,
  }),
  multiply: (...args: FormExpression[]): FormExpression => ({
    operator: 'MULTIPLY',
    args,
  }),
}
