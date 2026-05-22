import type { ServerShowWhen, SimpleCondition } from '../builders/PageBuilder'
import type { z } from 'zod'

type ServerExpressionValue = string | number

export type ServerExpressionAnswer<
  TKey extends string = string,
  TValue = ServerExpressionValue,
> = {
  field: TKey
  readonly value?: TValue
}

export type SchemaAnswers<TSchema> = TSchema extends z.ZodTypeAny
  ? z.infer<TSchema>
  : TSchema
export type AnswerKey<TSchema> = Extract<keyof SchemaAnswers<TSchema>, string>
export type AnswerValue<
  TSchema,
  TKey extends AnswerKey<TSchema>,
> = Extract<NonNullable<SchemaAnswers<TSchema>[TKey]>, ServerExpressionValue>
export type NumericAnswerKey<TSchema> = {
  [TKey in AnswerKey<TSchema>]: Extract<
    NonNullable<SchemaAnswers<TSchema>[TKey]>,
    number
  > extends never
    ? never
    : TKey
}[AnswerKey<TSchema>]

type TypedServerExpressionHelper<TSchema> = {
  answer: <TKey extends AnswerKey<TSchema>>(
    field: TKey,
  ) => ServerExpressionAnswer<TKey, AnswerValue<TSchema, TKey>>
  equals: <TKey extends AnswerKey<TSchema>>(
    answer: ServerExpressionAnswer<TKey, AnswerValue<TSchema, TKey>>,
    value: AnswerValue<TSchema, TKey>,
  ) => SimpleCondition
  notEquals: <TKey extends AnswerKey<TSchema>>(
    answer: ServerExpressionAnswer<TKey, AnswerValue<TSchema, TKey>>,
    value: AnswerValue<TSchema, TKey>,
  ) => SimpleCondition
  contains: <TKey extends AnswerKey<TSchema>>(
    answer: ServerExpressionAnswer<TKey, AnswerValue<TSchema, TKey>>,
    value: AnswerValue<TSchema, TKey>,
  ) => SimpleCondition
  gt: <TKey extends NumericAnswerKey<TSchema>>(
    answer: ServerExpressionAnswer<TKey, number>,
    value: number,
  ) => SimpleCondition
  gte: <TKey extends NumericAnswerKey<TSchema>>(
    answer: ServerExpressionAnswer<TKey, number>,
    value: number,
  ) => SimpleCondition
  lt: <TKey extends NumericAnswerKey<TSchema>>(
    answer: ServerExpressionAnswer<TKey, number>,
    value: number,
  ) => SimpleCondition
  lte: <TKey extends NumericAnswerKey<TSchema>>(
    answer: ServerExpressionAnswer<TKey, number>,
    value: number,
  ) => SimpleCondition
  all: (...conditions: SimpleCondition[]) => ServerShowWhen
  any: (...conditions: SimpleCondition[]) => ServerShowWhen
}

export const serverExpr = {
  answer: (field: string): ServerExpressionAnswer => ({ field }),
  equals: (
    answer: ServerExpressionAnswer,
    value: ServerExpressionValue,
  ): SimpleCondition => ({
    field: answer.field,
    equals: value,
  }),
  notEquals: (
    answer: ServerExpressionAnswer,
    value: ServerExpressionValue,
  ): SimpleCondition => ({
    field: answer.field,
    notEquals: value,
  }),
  contains: (
    answer: ServerExpressionAnswer,
    value: ServerExpressionValue,
  ): SimpleCondition => ({
    field: answer.field,
    contains: value,
  }),
  gt: (answer: ServerExpressionAnswer, value: number): SimpleCondition => ({
    field: answer.field,
    gt: value,
  }),
  gte: (answer: ServerExpressionAnswer, value: number): SimpleCondition => ({
    field: answer.field,
    gte: value,
  }),
  lt: (answer: ServerExpressionAnswer, value: number): SimpleCondition => ({
    field: answer.field,
    lt: value,
  }),
  lte: (answer: ServerExpressionAnswer, value: number): SimpleCondition => ({
    field: answer.field,
    lte: value,
  }),
  all: (...conditions: SimpleCondition[]): ServerShowWhen => ({
    all: conditions,
  }),
  any: (...conditions: SimpleCondition[]): ServerShowWhen => ({
    any: conditions,
  }),
  forSchema: <TSchema,>(): TypedServerExpressionHelper<TSchema> => ({
    answer: (field) => ({ field }),
    equals: (answer, value) => serverExpr.equals(answer, value),
    notEquals: (answer, value) => serverExpr.notEquals(answer, value),
    contains: (answer, value) => serverExpr.contains(answer, value),
    gt: (answer, value) => serverExpr.gt(answer, value),
    gte: (answer, value) => serverExpr.gte(answer, value),
    lt: (answer, value) => serverExpr.lt(answer, value),
    lte: (answer, value) => serverExpr.lte(answer, value),
    all: (...conditions) => serverExpr.all(...conditions),
    any: (...conditions) => serverExpr.any(...conditions),
  }),
}
