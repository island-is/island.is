import type { FormExpression } from '@island.is/application/types'
import type { z } from 'zod'

type IfExpressionOptions = {
  condition: FormExpression
  then: FormExpression
  otherwise: FormExpression
}

type SchemaAnswers<TSchema> = TSchema extends z.ZodTypeAny
  ? z.infer<TSchema>
  : TSchema
type AnswerKey<TSchema> = Extract<keyof SchemaAnswers<TSchema>, string>
type SchemaAnswerValue<TSchema, TKey extends AnswerKey<TSchema>> = NonNullable<
  SchemaAnswers<TSchema>[TKey]
>
type NumericAnswerKey<TSchema> = {
  [TKey in AnswerKey<TSchema>]: Extract<
    SchemaAnswerValue<TSchema, TKey>,
    number
  > extends never
    ? never
    : TKey
}[AnswerKey<TSchema>]
type TypedFormExpression<
  TKey extends string = string,
  TValue = unknown,
> = FormExpression & {
  readonly __answerKey?: TKey
  readonly __answerValue?: TValue
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
  gt: (arg1: FormExpression, arg2: FormExpression): FormExpression => ({
    operator: 'GT',
    args: [arg1, arg2],
  }),
  gte: (arg1: FormExpression, arg2: FormExpression): FormExpression => ({
    operator: 'GTE',
    args: [arg1, arg2],
  }),
  lt: (arg1: FormExpression, arg2: FormExpression): FormExpression => ({
    operator: 'LT',
    args: [arg1, arg2],
  }),
  lte: (arg1: FormExpression, arg2: FormExpression): FormExpression => ({
    operator: 'LTE',
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
    ...args:
      | [IfExpressionOptions]
      | [FormExpression, FormExpression, FormExpression]
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
  // Array membership: true when the `collection` answer (e.g. a checkbox array)
  // includes the literal `value`. Unlike the other helpers, `value` is kept as a
  // literal — it is the searched-for entry, not an answer reference.
  contains: (
    collection: FormExpression | string,
    value: FormExpression,
  ): FormExpression => ({
    operator: 'CONTAINS',
    args: [normalizeFieldReference(collection), value],
  }),
  sum: (...args: FormExpression[]): FormExpression => ({
    operator: 'SUM',
    args,
  }),
  multiply: (...args: FormExpression[]): FormExpression => ({
    operator: 'MULTIPLY',
    args,
  }),
  forSchema: <TSchema>() => ({
    get: <TKey extends AnswerKey<TSchema>>(
      fieldId: TKey,
    ): TypedFormExpression<TKey, SchemaAnswerValue<TSchema, TKey>> =>
      expr.get(fieldId),
    gt: <TKey extends NumericAnswerKey<TSchema>>(
      arg1: TypedFormExpression<TKey, number>,
      arg2: number,
    ): FormExpression => expr.gt(arg1, arg2),
    gte: <TKey extends NumericAnswerKey<TSchema>>(
      arg1: TypedFormExpression<TKey, number>,
      arg2: number,
    ): FormExpression => expr.gte(arg1, arg2),
    lt: <TKey extends NumericAnswerKey<TSchema>>(
      arg1: TypedFormExpression<TKey, number>,
      arg2: number,
    ): FormExpression => expr.lt(arg1, arg2),
    lte: <TKey extends NumericAnswerKey<TSchema>>(
      arg1: TypedFormExpression<TKey, number>,
      arg2: number,
    ): FormExpression => expr.lte(arg1, arg2),
  }),
}
