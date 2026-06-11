'use client'

import { useMemo } from 'react'

import { evaluateFormExpression } from '@island.is/application/core'
import type { FormExpression } from '../lib/graphql'

export const useFormExpressionEvaluator = (
  expression: FormExpression | undefined,
  answers: Record<string, unknown>,
): unknown =>
  useMemo(() => evaluateFormExpression(expression, answers), [answers, expression])
